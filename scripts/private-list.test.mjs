import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { privateListService } from "../src/lib/private-list-service.server.ts";
import { entrySchema } from "../src/lib/private-list-schema.ts";

const base = {
  kind: "offer",
  title: "Test offer",
  description: "Test fixture only",
  status: "published",
  availability: "available",
  starts_at: "",
  ends_at: "",
  event_at: "",
  location: "",
  link: "https://orajewellery.com",
  code: "SHARED-TEST",
  audience_user_id: "",
  starter: false,
};
async function setup() {
  const db = new PGlite();
  for (const file of ["0001_auth.sql", "0002_members.sql", "0003_private_list.sql"])
    await db.exec(await readFile(new URL("../migrations/" + file, import.meta.url), "utf8"));
  for (const id of ["owner", "alice", "bob", "pending", "paused", "legacy", "new"]) {
    await db.query(
      'insert into "user"(id,name,email,"emailVerified","createdAt","updatedAt") values($1,$1,$2,false,now(),now())',
      [id, id + "@example.test"],
    );
    if (id !== "new")
      await db.query("insert into member_profiles(user_id,status,role) values($1,$2,$3)", [
        id,
        ["pending", "paused"].includes(id) ? id : "active",
        id === "legacy" ? "admin" : "member",
      ]);
  }
  const sql = async (parts, ...values) =>
    (
      await db.query(
        parts.reduce((s, p, i) => s + (i ? "$" + i : "") + p, ""),
        values,
      )
    ).rows;
  sql.query = async (query, args) => (await db.query(query, args)).rows;
  return { db, service: privateListService(sql, "owner"), sql };
}
test("private list: real SQL permissions, lifecycle, scoping, validation and audit", async (t) => {
  const { db, service, sql } = await setup();
  try {
    await t.test("reads never apply for membership", async () => {
      assert.equal((await service.read("new")).membership, null);
      assert.equal((await service.read("new")).entries.length, 0);
    });
    await t.test("explicit request is idempotent and always pending for a member", async () => {
      await service.request("new");
      await service.request("new");
      assert.equal((await service.read("new")).membership.status, "pending");
    });
    await t.test("nonowners, legacy admin and unconfigured owner cannot mutate", async () => {
      for (const id of ["alice", "bob", "pending", "paused", "legacy", "missing"]) {
        await assert.rejects(service.save(id, base), /Owner access required/);
        await assert.rejects(
          service.setStatus(id, { userId: "alice", status: "active" }),
          /Owner access required/,
        );
      }
      await assert.rejects(
        privateListService(sql, undefined).save("owner", base),
        /Owner access required/,
      );
    });
    await t.test(
      "owner publishes shared, personal, draft, archived, future, expired and event records",
      async () => {
        await service.save("owner", base);
        await service.save("owner", {
          ...base,
          title: "Personal",
          code: "ALICE-ONLY",
          audience_user_id: "alice",
        });
        await service.save("owner", {
          ...base,
          title: "Draft",
          status: "draft",
          code: "DRAFT-SECRET",
        });
        await service.save("owner", {
          ...base,
          title: "Archived",
          status: "archived",
          code: "ARCHIVE-SECRET",
        });
        await service.save("owner", {
          ...base,
          title: "Future",
          starts_at: "2099-01-01T00:00:00Z",
          code: "FUTURE-SECRET",
        });
        await service.save("owner", {
          ...base,
          title: "Expired",
          ends_at: "2000-01-01T00:00:00Z",
          code: "EXPIRED-SECRET",
        });
        await service.save("owner", {
          ...base,
          title: "Sold out",
          kind: "event",
          event_at: "2099-01-01T00:00:00Z",
          availability: "sold_out",
          code: "SOLD-SECRET",
          link: "https://example.test/reserve",
        });
      },
    );
    await t.test(
      "pending, paused and missing members receive no private records or people",
      async () => {
        for (const id of ["pending", "paused", "missing"]) {
          const data = await service.read(id);
          assert.deepEqual(data.entries, []);
          assert.deepEqual(data.people, []);
        }
      },
    );
    await t.test(
      "one member cannot read another member’s code, draft or future entry",
      async () => {
        const alice = await service.read("alice"),
          bob = await service.read("bob");
        assert.equal(alice.entries.find((e) => e.title === "Personal").code, "ALICE-ONLY");
        assert.equal(
          bob.entries.find((e) => e.title === "Personal"),
          undefined,
        );
        assert.equal(bob.people.length, 0);
        for (const name of ["Draft", "Archived", "Future"])
          assert.equal(
            alice.entries.find((e) => e.title === name),
            undefined,
          );
        assert.equal(alice.entries.find((e) => e.title === "Expired").code, "");
        assert.equal(alice.entries.find((e) => e.title === "Sold out").code, "");
      },
    );
    await t.test("legacy role alone never reveals owner records", async () => {
      const d = await service.read("legacy");
      assert.equal(d.membership.role, "member");
      assert.deepEqual(d.people, []);
      assert.equal(
        d.entries.find((e) => e.title === "Draft"),
        undefined,
      );
    });
    await t.test(
      "pause and restore take effect on next server read; owner cannot pause self",
      async () => {
        await service.setStatus("owner", { userId: "alice", status: "paused" });
        assert.equal((await service.read("alice")).entries.length, 0);
        await service.setStatus("owner", { userId: "alice", status: "active" });
        assert.ok((await service.read("alice")).entries.length > 0);
        await assert.rejects(service.setStatus("owner", { userId: "owner", status: "paused" }));
      },
    );
    await t.test("optimistic concurrency rejects stale edits; archival hides content", async () => {
      const item = (await service.read("owner")).entries.find((e) => e.title === "Test offer");
      await service.save("owner", { ...item, status: "archived" });
      await assert.rejects(service.save("owner", item), /changed in another tab/);
      assert.equal(
        (await service.read("bob")).entries.find((e) => e.id === item.id),
        undefined,
      );
    });
    await t.test(
      "validation rejects unsafe URLs, invalid dates, injected fields and unknown audience",
      async () => {
        for (const patch of [
          { link: "javascript:alert(1)" },
          { link: "http://orajewellery.com" },
          { link: "https://evil.test" },
          { starts_at: "not a date" },
          { starts_at: "2030-02-01T00:00:00Z", ends_at: "2030-01-01T00:00:00Z" },
          { kind: "event", event_at: "" },
          { role: "admin" },
          { title: "" },
        ])
          assert.equal(entrySchema.safeParse({ ...base, ...patch }).success, false);
        await assert.rejects(
          service.save("owner", { ...base, audience_user_id: "missing" }),
          /existing member/,
        );
      },
    );
    await t.test("mutation audit stores actions without discount codes", async () => {
      const rows = await sql`select * from private_audit`;
      assert.ok(rows.length >= 10);
      assert.equal(JSON.stringify(rows).includes("SECRET"), false);
    });
  } finally {
    await db.close();
  }
});
