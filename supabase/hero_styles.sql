-- 5d) "Xush kelibsiz" bloki fonini sozlash (rang, rasm, effektlar) ----------
-- Har xodim faqat o'z fonini saqlaydi. Admin ko'rish rejimida xodim fonini ko'ra oladi.
-- Rasm brauzerda kichraytirilib (taxminan 100-300 KB) shu jadvalga yoziladi.
create table if not exists public.hero_styles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  style      jsonb not null check (length(style::text) < 450000),
  updated_at timestamptz not null default now()
);
alter table public.hero_styles enable row level security;
drop policy if exists hs_select on public.hero_styles;
drop policy if exists hs_insert on public.hero_styles;
drop policy if exists hs_update on public.hero_styles;
drop policy if exists hs_delete on public.hero_styles;
create policy hs_select on public.hero_styles for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy hs_insert on public.hero_styles for insert to authenticated
  with check (user_id = auth.uid());
create policy hs_update on public.hero_styles for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy hs_delete on public.hero_styles for delete to authenticated
  using (user_id = auth.uid());
revoke all on public.hero_styles from anon;
grant select, insert, update, delete on public.hero_styles to authenticated;

