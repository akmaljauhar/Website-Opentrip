-- Citravel Website Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Events table
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  poster_url text,
  thumbnail_url text,
  banner_url text,
  google_form_url text,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed', 'previous')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Event Dates table
create table if not exists event_dates (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  event_date date not null,
  created_at timestamptz not null default now()
);

-- Event Routes table
create table if not exists event_routes (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  route_name text not null,
  price numeric not null default 0,
  meeting_point text not null default '',
  created_at timestamptz not null default now()
);

-- Site Settings table (for logo, site name, etc.)
create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Event Documentation table
create table if not exists event_documentation (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  image_url text not null,
  caption text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_events_status on events(status);
create index if not exists idx_events_slug on events(slug);
create index if not exists idx_event_dates_event_id on event_dates(event_id);
create index if not exists idx_event_routes_event_id on event_routes(event_id);
create index if not exists idx_event_documentation_event_id on event_documentation(event_id);

-- Row Level Security (RLS)
alter table events enable row level security;
alter table event_dates enable row level security;
alter table event_routes enable row level security;
alter table event_documentation enable row level security;
alter table site_settings enable row level security;

-- Public can read events that are open or previous
create policy "Public can view open and previous events"
  on events for select
  using (status in ('open', 'previous'));

-- Public can view dates for open and previous events
create policy "Public can view dates for open events"
  on event_dates for select
  using (
    event_id in (
      select id from events where status in ('open', 'previous')
    )
  );

-- Public can view routes for open and previous events
create policy "Public can view routes for open events"
  on event_routes for select
  using (
    event_id in (
      select id from events where status in ('open', 'previous')
    )
  );

-- Public can view documentation for previous events
create policy "Public can view documentation for previous events"
  on event_documentation for select
  using (
    event_id in (
      select id from events where status = 'previous'
    )
  );

-- Public can read site settings
create policy "Public can view site settings"
  on site_settings for select
  using (true);

-- Authenticated users (admins) can manage site settings
create policy "Authenticated users can manage site settings"
  on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Authenticated users (admins) can do everything
create policy "Authenticated users can manage events"
  on events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage event_dates"
  on event_dates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage event_routes"
  on event_routes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage event_documentation"
  on event_documentation for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket (run via Supabase Dashboard or API)
-- Create a bucket named 'events' with public access

-- Storage RLS policies
create policy "Public can view event images"
  on storage.objects for select
  using (bucket_id = 'events');

create policy "Authenticated users can upload event images"
  on storage.objects for insert
  with check (bucket_id = 'events' and auth.role() = 'authenticated');

create policy "Authenticated users can update event images"
  on storage.objects for update
  using (bucket_id = 'events' and auth.role() = 'authenticated');

create policy "Authenticated users can delete event images"
  on storage.objects for delete
  using (bucket_id = 'events' and auth.role() = 'authenticated');
