import type { Sql } from "./db";
import { entrySchema, memberStatusSchema, type PrivateEntry } from "./private-list-schema.ts";

export type Member = {
  user_id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "paused";
  role: "member" | "admin";
  joined_at: string;
};
export function privateListService(sql: Sql, ownerId: string | undefined) {
  // The owner must be pinned by a trusted operator; an email or stored legacy role is never enough.
  const isOwner = (id: string) => Boolean(ownerId?.trim()) && id === ownerId?.trim();
  async function profile(id: string) {
    const rows =
      await sql<Member>`select m.user_id, u.name, u.email, m.status, m.role, m.joined_at::text from member_profiles m join "user" u on u.id=m.user_id where m.user_id=${id}`;
    return rows[0]
      ? { ...rows[0], role: isOwner(id) ? ("admin" as const) : ("member" as const) }
      : null;
  }
  async function owner(id: string) {
    if (!isOwner(id) || (await profile(id))?.status !== "active")
      throw new Error("Owner access required");
  }
  async function read(id: string) {
    const membership = await profile(id);
    if (!membership || membership.status !== "active")
      return { membership, entries: [] as PrivateEntry[], people: [] as Member[] };
    const admin = isOwner(id);
    const entries =
      await sql<PrivateEntry>`select id, kind, title, description, status, availability,
      coalesce(starts_at::text,'') as starts_at, coalesce(ends_at::text,'') as ends_at, coalesce(event_at::text,'') as event_at,
      location, link,
      case when ${admin} or (availability='available' and (ends_at is null or ends_at>now())) then code else '' end as code,
      coalesce(audience_user_id,'') as audience_user_id, starter, version
      from private_entries where ${admin} or (status='published' and (starts_at is null or starts_at<=now()) and (audience_user_id is null or audience_user_id=${id}))
      order by updated_at desc`;
    const people = admin
      ? await sql<Member>`select m.user_id,u.name,u.email,m.status,m.role,m.joined_at::text from member_profiles m join "user" u on u.id=m.user_id order by m.joined_at desc`
      : [];
    return {
      membership,
      entries: entries.map((entry) => ({
        ...entry,
        starts_at: entry.starts_at ? new Date(entry.starts_at).toISOString() : "",
        ends_at: entry.ends_at ? new Date(entry.ends_at).toISOString() : "",
        event_at: entry.event_at ? new Date(entry.event_at).toISOString() : "",
      })),
      people,
    };
  }
  async function request(id: string) {
    await sql`insert into member_profiles(user_id,status,role) values(${id},${isOwner(id) ? "active" : "pending"},${isOwner(id) ? "admin" : "member"}) on conflict(user_id) do nothing`;
    return { success: true };
  }
  async function setStatus(id: string, input: unknown) {
    await owner(id);
    const data = memberStatusSchema.parse(input);
    if (isOwner(data.userId)) throw new Error("The owner membership cannot be changed here");
    const changed = await sql`with changed as (
      update member_profiles set status=${data.status}, approved_at=case when ${data.status}='active' then now() else approved_at end, approved_by=${id}
      where user_id=${data.userId} returning user_id
    ) insert into private_audit(actor_id,action,target_id) select ${id},${"membership:" + data.status},user_id from changed returning id`;
    if (!changed.length) throw new Error("Membership no longer exists");
    return { success: true };
  }
  async function save(id: string, input: unknown) {
    await owner(id);
    const d = entrySchema.parse(input);
    if (d.audience_user_id) {
      const member = await profile(d.audience_user_id);
      if (!member) throw new Error("Choose an existing member");
    }
    const entryId = d.id ?? crypto.randomUUID();
    // Atomic version check prevents overwriting changes made in another tab.
    const changed = await sql`with changed as (
      insert into private_entries(id,kind,title,description,status,availability,starts_at,ends_at,event_at,location,link,code,audience_user_id,starter,created_by)
      values(${entryId},${d.kind},${d.title},${d.description},${d.status},${d.availability},${d.starts_at || null},${d.ends_at || null},${d.event_at || null},${d.location},${d.link},${d.code},${d.audience_user_id || null},${d.starter},${id})
      on conflict(id) do update set kind=excluded.kind,title=excluded.title,description=excluded.description,status=excluded.status,availability=excluded.availability,starts_at=excluded.starts_at,ends_at=excluded.ends_at,event_at=excluded.event_at,location=excluded.location,link=excluded.link,code=excluded.code,audience_user_id=excluded.audience_user_id,starter=excluded.starter,version=private_entries.version+1,updated_at=now()
      where private_entries.version=${d.version ?? 0}
      returning id
    ) insert into private_audit(actor_id,action,target_id) select ${id},${"entry:" + d.status},id from changed returning target_id`;
    if (!changed.length)
      throw new Error("This entry changed in another tab. Reload before saving.");
    return { success: true };
  }
  return { read, request, setStatus, save };
}
