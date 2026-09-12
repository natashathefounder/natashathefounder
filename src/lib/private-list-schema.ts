import { z } from "zod";

const date = z.union([z.string().datetime({ offset: true }), z.literal("")]);
const safeLink = z
  .string()
  .trim()
  .max(2000)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }, "Use a full HTTPS link.");
export const entrySchema = z
  .object({
    id: z.string().uuid().optional(),
    version: z.number().int().positive().optional(),
    kind: z.enum(["offer", "release", "event"]),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().max(5000),
    status: z.enum(["draft", "published", "expired", "archived"]),
    availability: z.enum(["available", "sold_out", "closed"]),
    starts_at: date,
    ends_at: date,
    event_at: date,
    location: z.string().trim().max(300),
    link: safeLink,
    code: z.string().trim().max(100),
    audience_user_id: z.string().trim().max(200),
    starter: z.boolean(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.ends_at && v.starts_at && Date.parse(v.ends_at) <= Date.parse(v.starts_at))
      ctx.addIssue({
        code: "custom",
        message: "Expiry must be after the start.",
        path: ["ends_at"],
      });
    if (v.status === "published" && v.kind === "event" && !v.event_at)
      ctx.addIssue({
        code: "custom",
        message: "Add an event date before publishing.",
        path: ["event_at"],
      });
    if (
      v.kind !== "event" &&
      v.link &&
      new URL(v.link).hostname !== "orajewellery.com" &&
      new URL(v.link).hostname !== "www.orajewellery.com"
    )
      ctx.addIssue({
        code: "custom",
        message: "Offers and releases must link to ORA Shopify.",
        path: ["link"],
      });
    if (v.id && !v.version)
      ctx.addIssue({
        code: "custom",
        message: "Reload this entry before editing.",
        path: ["version"],
      });
  });
export type EntryInput = z.infer<typeof entrySchema>;
export type PrivateEntry = Omit<EntryInput, "id" | "version"> & { id: string; version: number };
export const memberStatusSchema = z
  .object({ userId: z.string().min(1).max(200), status: z.enum(["active", "paused"]) })
  .strict();
