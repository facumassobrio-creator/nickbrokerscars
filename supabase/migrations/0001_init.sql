-- Supabase SQL migration: initial vehicle catalog schema

-- Extensiones necesarias
create extension if not exists "pgcrypto";

-- Tabla principal: vehicles
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  variant text,
  year smallint not null check (year >= 1900 and year <= 2100),
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'ARS',
  mileage int not null check (mileage >= 0),
  fuel_type text not null,
  transmission text not null,
  color text not null,
  description text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehicles_is_published on vehicles (is_published);
create index if not exists idx_vehicles_is_featured on vehicles (is_featured);
create index if not exists idx_vehicles_created_at on vehicles (created_at desc);

-- Tabla de imágenes de vehículos
create table if not exists vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  constraint vehicle_images_unique_primary_per_vehicle unique (vehicle_id, is_primary) where (is_primary)
);

create index if not exists idx_vehicle_images_vehicle_id on vehicle_images (vehicle_id);
create index if not exists idx_vehicle_images_position on vehicle_images (vehicle_id, position);

-- RLS y políticas base (usar en Supabase en el dashboard).
-- Nota: revise y ajuste las políticas de admin según su claim de JWT y roles.

alter table vehicles enable row level security;

create policy if not exists "public_select_published" on vehicles
  for select using (is_published = true);

create policy if not exists "admin_full_access" on vehicles
  for all using (
    auth.role() = 'authenticated' AND current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
  );

alter table vehicle_images enable row level security;

create policy if not exists "public_select_images_for_published" on vehicle_images
  for select using (
    exists (
      select 1 from vehicles v where v.id = vehicle_images.vehicle_id and v.is_published = true
    )
  );

create policy if not exists "admin_full_access_images" on vehicle_images
  for all using (
    auth.role() = 'authenticated' AND current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
  );

-- Trigger de actualización automática "updated_at" para vehicles
create function if not exists set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger if not exists vehicles_set_updated_at
  before update on vehicles
  for each row
  execute function set_updated_at();
