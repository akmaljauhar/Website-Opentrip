-- Migration 004: Fix public RLS policies after 'previous' -> 'past' rename
-- Run this in Supabase SQL Editor
--
-- Background: commit fc8efe7 renamed status 'previous' to 'past' by editing
-- 001_initial_schema.sql in place. Because that file uses
-- `create table if not exists` / `create policy` (no `drop policy if exists`),
-- the live database still has the old public policies that only allow
-- status in ('open', 'previous'). Result: admins (authenticated) see past
-- events, but public visitors (anon) see none.

-- 0. Migrate any legacy status values still using old vocabulary
update events set status = 'past' where status = 'previous';

-- 1. Drop stale public SELECT policies (old 'previous' variants AND current
--    names, so recreation is idempotent). Authenticated policies are untouched.
drop policy if exists "Public can view open and previous events" on events;
drop policy if exists "Public can view open and past events" on events;

drop policy if exists "Public can view dates for open events" on event_dates;
drop policy if exists "Public can view routes for open events" on event_routes;

drop policy if exists "Public can view documentation for previous events" on event_documentation;
drop policy if exists "Public can view documentation for past events" on event_documentation;

-- 2. Recreate correct public SELECT policies
create policy "Public can view open and past events"
  on events for select
  using (status in ('open', 'past'));

create policy "Public can view dates for open events"
  on event_dates for select
  using (
    event_id in (
      select id from events where status in ('open', 'past')
    )
  );

create policy "Public can view routes for open events"
  on event_routes for select
  using (
    event_id in (
      select id from events where status in ('open', 'past')
    )
  );

create policy "Public can view documentation for past events"
  on event_documentation for select
  using (
    event_id in (
      select id from events where status = 'past'
    )
  );

-- 3. Fix CHECK constraint if it still lacks 'past' (e.g. still has 'previous')
do $$
declare
  c record;
begin
  for c in
    select conname, pg_get_constraintdef(oid) as def
    from pg_constraint
    where conrelid = 'events'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%status%'
      and pg_get_constraintdef(oid) not like '%''past''%'
  loop
    execute format('alter table events drop constraint %I', c.conname);
  end loop;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'events'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%''past''%'
  ) then
    alter table events add constraint events_status_check
      check (status in ('draft', 'open', 'past'));
  end if;
end $$;
