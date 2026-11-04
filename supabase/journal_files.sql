-- Faqat fayl biriktirish uchun (supabase-setup.sql dagi 5e bo'limi bilan bir xil).
-- Supabase -> SQL Editor'da bir marta ishga tushiring. Qayta ishga tushirish xavfsiz.

-- 5e) Vaqt jurnali "Natija"siga biriktiriladigan fayllar (PDF, Word, Excel, rasm) ---
-- Fayllar Storage'dagi XUSUSIY "journal-files" bucket'ida saqlanadi (10 MB gacha).
-- Yo'l: <xodim_id>/<yozuv>/<fayl>. Xodim faqat o'z papkasiga yozadi/o'chiradi;
-- admin hammasini faqat ko'ra oladi (ochish uchun 5 daqiqalik vaqtinchalik havola).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('journal-files', 'journal-files', false, 10485760, array[
  'application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv','text/plain','image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists jf_select on storage.objects;
drop policy if exists jf_insert on storage.objects;
drop policy if exists jf_delete on storage.objects;
create policy jf_select on storage.objects for select to authenticated
  using (bucket_id = 'journal-files' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy jf_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'journal-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy jf_delete on storage.objects for delete to authenticated
  using (bucket_id = 'journal-files' and (storage.foldername(name))[1] = auth.uid()::text);

