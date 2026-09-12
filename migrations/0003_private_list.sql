-- Additive: existing accounts and membership decisions are preserved.
create table private_entries (
  id text primary key,
  kind text not null check (kind in ('offer', 'release', 'event')),
  title text not null check (length(title) between 1 and 160),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft','published','expired','archived')),
  availability text not null default 'available' check (availability in ('available','sold_out','closed')),
  starts_at timestamptz,
  ends_at timestamptz,
  event_at timestamptz,
  location text not null default '',
  link text not null default '',
  code text not null default '',
  audience_user_id text references "user"(id) on delete cascade,
  starter boolean not null default false,
  version integer not null default 1,
  created_by text not null references "user"(id),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create index private_entries_visibility_idx on private_entries(status, audience_user_id);
create table private_audit (
  id bigint generated always as identity primary key,
  actor_id text not null references "user"(id),
  action text not null,
  target_id text not null,
  occurred_at timestamptz not null default now()
);
-- Rollback, only after backing up new content: drop table private_audit; drop table private_entries;
