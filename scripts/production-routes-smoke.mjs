// Exercise the actual built Vercel handler without opening a network listener.
// This verifies server rendering; it does not replace browser or visual QA.
import assert from "node:assert/strict";
import handler from "../.vercel/output/functions/__server.func/index.mjs";
for (const route of [
  "/",
  "/shop",
  "/stack",
  "/custom",
  "/coaching",
  "/studio",
  "/members",
  "/login",
]) {
  const response = await handler.fetch(new Request("http://localhost:8080" + route));
  const html = await response.text();
  assert.equal(response.status, 200, route + " status");
  assert.match(html, /<main\b/, route + " content");
  assert.doesNotMatch(html, /ALICE-ONLY|DRAFT-SECRET|SHARED-TEST/, "No test codes");
  if (route === "/members") {
    assert.match(html, /Sign in, then request your place/);
    assert.doesNotMatch(html, /The names on the list|Create an entry/);
  }
  console.log("PASS", route);
}
process.exit(0);
