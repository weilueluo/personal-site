create extension if not exists "pgcrypto";

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_filename_idx on public.comments (filename);

alter table public.comments enable row level security;

drop policy if exists "comments_read" on public.comments;
drop policy if exists "comments_insert" on public.comments;

create policy "comments_read"
on public.comments
for select
using (true);

create policy "comments_insert"
on public.comments
for insert
with check (
  filename is not null
  and length(filename) > 0
  and length(content) > 0
  and length(content) <= 2000
);
