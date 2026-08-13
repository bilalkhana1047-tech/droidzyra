alter table public.versions
add column if not exists custom_download_url text;
