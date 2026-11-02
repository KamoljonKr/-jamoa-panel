Ish kuchlanishi paneli: JAMOA versiyasi, o'rnatish qo'llanmasi

Fayllar:

index.html : panelning o'zi (login oynasi, xodim paneli, admin bo'limi).
supabase-setup.sql : ma'lumotlar bazasi va xavfsizlik qoidalari (bir marta ishga tushiriladi).
README.md : shu qo'llanma.

Qanday ishlaydi: har xodim login va parol bilan kiradi. Ma'lumoti Supabase bazasida, faqat o'zining qatorida saqlanadi. Admin hammaning holatini, jurnalini va natijalarini ko'radi, lekin o'zgartira olmaydi (bu qoida bazaning o'zida, sahifada emas).

1. Supabase loyihasini yaratish (10 daqiqa)
supabase.com saytida ro'yxatdan o'ting va New project yarating (nom: istalgan, region: sizga yaqini).
Loyiha yaratilayotganda so'ralgan database password ni xavfsiz joyda saqlang. U sahifaga yozilmaydi.
2. Bazani sozlash
Supabase → SQL Editor → New query.
supabase-setup.sql faylini to'liq nusxalab qo'ying va Run bosing. Xato bo'lmasa tayyor. Qayta ishga tushirish xavfsiz.
3. O'zi ro'yxatdan o'tishni yopish

Authentication → Sign In / Providers → Email: yangi foydalanuvchilarning o'zi ro'yxatdan o'tishiga ruxsatni (Allow new users to sign up) o'chiring. Shunda faqat siz qo'shgan odamlar kira oladi. (Menyu nomlari Supabase yangilanishi bilan biroz farq qilishi mumkin.)

4. Foydalanuvchilarni qo'shish

Authentication → Users → Add user → Create new user:

Email: login@jamoa.uz ko'rinishida (masalan admin@jamoa.uz, ali@jamoa.uz). Xodim kirishda faqat ali deb yozadi.
Parol: o'zingiz belgilang va xodimga yetkazing.
Auto Confirm User belgisini yoqing (pochta tasdiqlash shart emas).

Domen (@jamoa.uz) soxta bo'lishi mumkin, unga xat yuborilmaydi. Boshqa domen xohlasangiz, index.html boshidagi loginDomain ni o'zgartiring.

5. Adminni tayinlash

Birinchi foydalanuvchini (masalan admin) yaratgach, SQL Editor'da:

sql
update public.profiles set role = 'admin' where login = 'admin';

Xodimlarning ko'rinadigan ismi:

sql
update public.profiles set full_name = 'Ali Valiyev' where login = 'ali';
6. index.html ni sozlash

Faylni oddiy matn muharririda oching. Boshidagi blokni to'ldiring:

Project Settings → API → Project URL → url
Project Settings → API → anon public key → anonKey

Muhim: service_role kalitni hech qachon bu faylga yozmang va hech kimga bermang. anon kalit ochiq bo'lishi xavfsiz, chunki ma'lumotni baza qoidalari (RLS) himoya qiladi.

7. Internetga joylash va domen

index.html bitta fayl, shuning uchun istalgan statik hosting yetadi: Cloudflare Pages, Netlify (faylni sudrab tashlash), GitHub Pages yoki o'z serveringiz (nginx). Bepul hostinglarda HTTPS tayyor beriladi. Domenni hosting sozlamalarida "Custom domain" orqali ulaysiz.

8. Foydalanish
Xodim: login va parol bilan kiradi, avvalgi paneldagi hamma imkoniyatdan foydalanadi. Menyudan parolini o'zgartira oladi va chiqadi.
Admin: menyuda va yuqorida 👥 Jamoa paydo bo'ladi.
Jadval: kim hozir ishlayapti (jonli vaqt bilan), bugungi vaqt, tanlangan davr bo'yicha o'rtacha va kuchlanish foizi. Har 30 soniyada yangilanadi.
Jurnal: xodimning davr bo'yicha yozuvlari, natija izohlari, loyihalar bo'yicha taqsimot, qidiruv, Excel.
Panel: xodimning to'liq panelini yangi oynada faqat ko'rish rejimida ochadi. Bu yerdan uning PDF hisobotini yuklab olish mumkin.
Butun jamoa Excel: davr tanlab, hamma xodim bo'yicha xulosa va jurnal.
Bilib qo'ying
Tekshirilgan: login va chiqish, xodimlar ma'lumotining aralashmasligi, admin jadvali, jurnal, Excel, faqat ko'rish rejimi, PDF. Bu soxta Supabase serveri bilan sinalgan. Xavfsizlik qoidalari (RLS) esa haqiqiy Postgres'da sinalgan: xodim boshqaning ma'lumotini ko'ra olmaydi va yoza olmaydi, admin ko'radi lekin o'zgartira olmaydi, kirmagan odam hech narsa ko'rmaydi.
Tekshirilmagan: sizning haqiqiy Supabase loyihangiz bilan ishlash. Ulangach birinchi kuni uchta narsani sinab ko'ring: xodim sifatida kirish va saqlash, admin sifatida shu xodimni ko'rish, chiqib qayta kirish.
Maxfiylik: admin xodim panelini to'liq ko'radi, jumladan "Ish jadvali va oylik" bo'limidagi qiymatlarni ham. Buni xodimlarga oldindan ayting.
Parol unutilsa: xodim o'zi tiklay olmaydi (pochta soxta). Administrator Supabase Users bo'limida parolni yangilaydi. Dashboard tugmalari versiyaga qarab farq qiladi, shuning uchun uni o'zingiz tekshirib ko'ring.
Umumiy kompyuter: xodim "Chiqish" bosganda uning ma'lumoti brauzerdan o'chadi. Chiqmasdan oynani yopsa, keyingi odam o'sha hisobda qolib ketadi.
Hajm: har saqlashda xodimning butun holati yuboriladi. Yillar o'tib jurnal kattalashsa saqlash sekinlashishi mumkin. Supabase bepul tarifining chegaralari va (uzoq faol bo'lmasa) loyiha to'xtatilishi mumkinligini supabase.com tarif sahifasida tekshiring.
Bu versiyada yo'q: Google Sheets bilan sinxronlash va Telegram bot. Avvalgi (shaxsiy) panelingiz o'z holicha ishlayveradi, ma'lumoti jamoa versiyasiga avtomatik ko'chmaydi.
