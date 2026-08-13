alter table public.apps
add column if not exists is_trending boolean not null default false;
