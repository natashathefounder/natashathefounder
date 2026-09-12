import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { entrySchema, memberStatusSchema } from "@/lib/private-list-schema";

const privateAuth = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader("Cache-Control", "private, no-store");
    // Require a real session even when the platform's development auth fallback is enabled.
    const user = await getSessionUser(context.bearerToken);
    if (!user || user.id !== context.userId) throw new Error("Unauthorized");
    return next({ context: { userId: user.id } });
  });
async function service() {
  const { getSql } = await import("@/lib/db");
  const { privateListService } = await import("@/lib/private-list-service.server");
  return privateListService(await getSql(), process.env.NATASHA_OWNER_USER_ID);
}
export const getMembership = createServerFn({ method: "GET" })
  .middleware([privateAuth])
  .handler(async ({ context }) => (await service()).read(context.userId));
export const requestMembership = createServerFn({ method: "POST" })
  .middleware([privateAuth])
  .handler(async ({ context }) => (await service()).request(context.userId));
export const updateMember = createServerFn({ method: "POST" })
  .middleware([privateAuth])
  .validator(memberStatusSchema)
  .handler(async ({ context, data }) => (await service()).setStatus(context.userId, data));
export const saveEntry = createServerFn({ method: "POST" })
  .middleware([privateAuth])
  .validator(entrySchema)
  .handler(async ({ context, data }) => (await service()).save(context.userId, data));
