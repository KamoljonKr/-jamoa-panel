# Foydalanish
- **Xodim:** login va parol bilan kiradi, avvalgi paneldagi hamma imkoniyatdan foydalanadi. Menyudan parolini o'zgartira oladi va chiqadi.
- **Admin:** faqat **👥 Jamoa** bo'limini ko'radi (REC paneli, jurnal, vazifalar va boshqa xodim bo'limlari admin uchun ko'rinmaydi). Jadvalda faqat xodimlar chiqadi. Xodimning to'liq paneli **Panel** tugmasi orqali, faqat ko'rish rejimida ochiladi.
  - Jadval: kim hozir ishlayapti (jonli vaqt bilan), bugungi vaqt, tanlangan davr bo'yicha o'rtacha va kuchlanish foizi. Har 30 soniyada yangilanadi.
  - **Jurnal:** xodimning davr bo'yicha yozuvlari, natija izohlari, loyihalar bo'yicha taqsimot, qidiruv, Excel.
  - **Panel:** xodimning to'liq panelini yangi oynada **faqat ko'rish** rejimida ochadi. Bu yerdan uning **PDF hisobotini** yuklab olish mumkin.
  - **Butun jamoa Excel:** davr tanlab, hamma xodim bo'yicha xulosa va jurnal.

## Bilib qo'ying
- **Tekshirilgan:** login va chiqish, xodimlar ma'lumotining aralashmasligi, admin jadvali, jurnal, Excel, faqat ko'rish rejimi, PDF. Bu soxta Supabase serveri bilan sinalgan. Xavfsizlik qoidalari (RLS) esa haqiqiy Postgres'da sinalgan: xodim boshqaning ma'lumotini ko'ra olmaydi va yoza olmaydi, admin ko'radi lekin o'zgartira olmaydi, kirmagan odam hech narsa ko'rmaydi.
- **Tekshirilmagan:** sizning haqiqiy Supabase loyihangiz bilan ishlash. Ulangach birinchi kuni uchta narsani sinab ko'ring: xodim sifatida kirish va saqlash, admin sifatida shu xodimni ko'rish, chiqib qayta kirish.
- **Maxfiylik:** admin xodim panelini to'liq ko'radi (vazifalar, jurnal, natijalar, media-reja). Buni xodimlarga oldindan ayting. Oylik va pul ko'rsatkichlari bu versiyada umuman yo'q.
- **Ish vaqti:** kuchlanish foizi hamma uchun bir xil hisoblanadi: oyiga 22 ish kuni, kuniga 9:00 dan 18:00 gacha, tushliksiz (9 soat). Boshqacha kerak bo'lsa, o'zgartirish mumkin.
- **Parol unutilsa:** xodim o'zi tiklay olmaydi (pochta soxta). Administrator Supabase Users bo'limida parolni yangilaydi. Dashboard tugmalari versiyaga qarab farq qiladi, shuning uchun uni o'zingiz tekshirib ko'ring.
- **Umumiy kompyuter:** xodim "Chiqish" bosganda uning ma'lumoti brauzerdan o'chadi. Chiqmasdan oynani yopsa, keyingi odam o'sha hisobda qolib ketadi.
- **Hajm:** har saqlashda xodimning butun holati yuboriladi. Yillar o'tib jurnal kattalashsa saqlash sekinlashishi mumkin. Supabase bepul tarifining chegaralari va (uzoq faol bo'lmasa) loyiha to'xtatilishi mumkinligini supabase.com tarif sahifasida tekshiring.
- **Bu versiyada yo'q:** Google Sheets bilan sinxronlash va Telegram bot. Avvalgi (shaxsiy) panelingiz o'z holicha ishlayveradi, ma'lumoti jamoa versiyasiga avtomatik ko'chmaydi.

# Media-reja: AI yordamchi (ixtiyoriy)
Media-reja bo'limida **✨ Ro'yxatdan** tugmasi bor. U **AI siz ham ishlaydi**: «Post - 1) ... 2) ...  Story 1) ...» ko'rinishidagi ro'yxatni tanlangan loyihaning shu oyidagi ish kunlariga o'zi tekis tarqatadi. Pastdagi «Tahrirlash buyrug'i» maydoni oddiy buyruqlarni bajaradi: «5-sanadagi postni 12-sanaga ko'chir», «Reels 2 ni o'chir», «Story 1 mavzusini "Yangi mavzu" ga o'zgartir», «Denov ni tayyor deb belgila». Har bir amaldan keyin 10 soniya bekor qilish tugmasi turadi.

Murakkab yoki tartibsiz matn va erkin buyruqlar uchun haqiqiy AI ulash mumkin. Buning uchun Anthropic API kaliti va bitta Supabase funksiyasi kerak. Kalit sahifaga **yozilmaydi**, u Supabase serverida saqlanadi:
1. console.anthropic.com saytida API kalit oling (bu pullik xizmat, sarfi odatda juda kam).
2. Kompyuteringizda Supabase CLI o'rnating va loyihaga ulang: `supabase login`, `supabase link --project-ref LOYIHA_ID`.
3. Kalitni yashirin saqlang: `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
4. Papkadagi `supabase/functions/media-ai/index.ts` fayli bilan funksiyani yuklang: `supabase functions deploy media-ai`
5. `index.html` boshidagi `TEAM_CFG` ichiga `ai:true,` qatorini qo'shing. Shundan keyin ✨ panelida «🤖 AI bilan» belgisi chiqadi.
Funksiya faqat tizimga kirgan xodimlar uchun ishlaydi. AI ishlamasa, panel o'zi oddiy usulga o'tadi.
