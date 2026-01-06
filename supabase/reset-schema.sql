-- Reset Schema - Run this first to clean up existing tables
-- This will DROP all existing tables and start fresh

-- Drop tables in reverse order (respecting foreign keys)
drop table if exists public.interactions cascade;
drop table if exists public.palettes cascade;
drop table if exists public.profiles cascade;

-- Drop triggers
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_interaction_stats on public.interactions;
drop trigger if exists on_palettes_updated on public.palettes;
drop trigger if exists on_profiles_updated on public.profiles;

-- Drop functions
drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_updated_at() cascade;
drop function if exists public.update_palette_stats() cascade;

-- Now you can run the main schema.sql file
