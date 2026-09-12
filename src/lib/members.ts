import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

const OWNER_EMAILS = new Set(["me@natashathefounder.com"]);

type MemberRow = {
  user_id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "paused";
  role: "member" | "admin";
  joined_at: string;
};

export const getMembership = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const users = await sql<{ id: string; name: string; email: string }>`
      select id, name, email from "user" where id = ${context.userId} limit 1
    `;
    const user = users[0];
    if (!user) throw new Error("Your account could not be loaded");

    const isOwner = OWNER_EMAILS.has(user.email.toLowerCase());
    await sql`
      insert into member_profiles (user_id, status, role, approved_at, approved_by)
      values (${context.userId}, ${isOwner ? "active" : "pending"}, ${isOwner ? "admin" : "member"}, ${isOwner ? new Date().toISOString() : null}, ${isOwner ? context.userId : null})
      on conflict (user_id) do update set
        status = case when ${isOwner} then 'active' else member_profiles.status end,
        role = case when ${isOwner} then 'admin' else member_profiles.role end
    `;

    const rows = await sql<MemberRow>`
      select m.user_id, u.name, u.email, m.status, m.role, m.joined_at
      from member_profiles m join "user" u on u.id = m.user_id
      where m.user_id = ${context.userId}
    `;
    const membership = rows[0];
    if (!membership) throw new Error("Membership could not be loaded");

    const pending =
      membership.role === "admin"
        ? await sql<MemberRow>`
          select m.user_id, u.name, u.email, m.status, m.role, m.joined_at
          from member_profiles m join "user" u on u.id = m.user_id
          where m.status = 'pending' order by m.joined_at asc
        `
        : [];
    return { membership, pending };
  });

export const approveMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const admins = await sql<{ role: string; status: string }>`
      select role, status from member_profiles where user_id = ${context.userId}
    `;
    if (admins[0]?.role !== "admin" || admins[0]?.status !== "active") {
      throw new Error("Administrator access required");
    }
    await sql`
      update member_profiles
      set status = 'active', approved_at = now(), approved_by = ${context.userId}
      where user_id = ${data.userId} and status = 'pending'
    `;
    return { success: true };
  });
