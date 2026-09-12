create table if not exists member_profiles (
  user_id text primary key references "user" ("id") on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'paused')),
  role text not null default 'member' check (role in ('member', 'admin')),
  joined_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text references "user" ("id") on delete set null
);

create index if not exists member_profiles_status_idx on member_profiles (status);
