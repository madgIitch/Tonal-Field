-- Tonal Field Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Extends auth.users with app-specific data
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- PALETTES TABLE
-- ============================================
create table public.palettes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  palette jsonb not null,
  parameters jsonb not null,
  tags jsonb not null,
  is_public boolean default true,
  likes_count integer default 0,
  saves_count integer default 0,
  views_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index palettes_user_id_idx on public.palettes(user_id);
create index palettes_created_at_idx on public.palettes(created_at desc);
create index palettes_likes_count_idx on public.palettes(likes_count desc);
create index palettes_is_public_idx on public.palettes(is_public) where is_public = true;

-- Enable Row Level Security
alter table public.palettes enable row level security;

-- Policies for palettes
create policy "Public palettes are viewable by everyone"
  on public.palettes for select
  using (is_public = true or auth.uid() = user_id);

create policy "Authenticated users can create palettes"
  on public.palettes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own palettes"
  on public.palettes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own palettes"
  on public.palettes for delete
  using (auth.uid() = user_id);

-- ============================================
-- INTERACTIONS TABLE
-- ============================================
create table public.interactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  palette_id uuid references public.palettes(id) on delete cascade not null,
  liked boolean default false,
  saved boolean default false,
  viewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, palette_id)
);

-- Create indexes
create index interactions_user_id_idx on public.interactions(user_id);
create index interactions_palette_id_idx on public.interactions(palette_id);
create index interactions_liked_idx on public.interactions(user_id, palette_id) where liked = true;
create index interactions_saved_idx on public.interactions(user_id, palette_id) where saved = true;

-- Enable Row Level Security
alter table public.interactions enable row level security;

-- Policies for interactions
create policy "Users can view their own interactions"
  on public.interactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interactions"
  on public.interactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own interactions"
  on public.interactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interactions"
  on public.interactions for delete
  using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles
create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Trigger for palettes
create trigger on_palettes_updated
  before update on public.palettes
  for each row
  execute procedure public.handle_updated_at();

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update palette stats when interaction changes
create or replace function public.update_palette_stats()
returns trigger as $$
begin
  -- If liked changed
  if (TG_OP = 'INSERT' and new.liked = true) or
     (TG_OP = 'UPDATE' and old.liked = false and new.liked = true) then
    update public.palettes
    set likes_count = likes_count + 1
    where id = new.palette_id;
  elsif (TG_OP = 'UPDATE' and old.liked = true and new.liked = false) then
    update public.palettes
    set likes_count = likes_count - 1
    where id = new.palette_id;
  elsif (TG_OP = 'DELETE' and old.liked = true) then
    update public.palettes
    set likes_count = likes_count - 1
    where id = old.palette_id;
  end if;

  -- If saved changed
  if (TG_OP = 'INSERT' and new.saved = true) or
     (TG_OP = 'UPDATE' and old.saved = false and new.saved = true) then
    update public.palettes
    set saves_count = saves_count + 1
    where id = new.palette_id;
  elsif (TG_OP = 'UPDATE' and old.saved = true and new.saved = false) then
    update public.palettes
    set saves_count = saves_count - 1
    where id = new.palette_id;
  elsif (TG_OP = 'DELETE' and old.saved = true) then
    update public.palettes
    set saves_count = saves_count - 1
    where id = old.palette_id;
  end if;

  -- If viewed for first time
  if (TG_OP = 'INSERT' and new.viewed_at is not null) then
    update public.palettes
    set views_count = views_count + 1
    where id = new.palette_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update stats
create trigger on_interaction_stats
  after insert or update or delete on public.interactions
  for each row execute procedure public.update_palette_stats();

-- ============================================
-- SEED DATA (Optional demo palettes)
-- ============================================
-- Run this after you have at least one authenticated user

-- You can manually insert demo palettes here or via the app
