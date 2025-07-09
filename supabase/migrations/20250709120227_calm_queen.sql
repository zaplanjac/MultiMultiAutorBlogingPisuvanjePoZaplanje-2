/*
  # Seed initial data

  1. Insert super admin and existing authors
  2. Insert existing blog posts
  3. Maintain existing relationships and data
*/

-- Insert super admin (this will be the main admin account)
-- Note: This user needs to be created through Supabase Auth first
-- The trigger will automatically create the profile

-- Insert existing blog posts with proper author relationships
-- We'll use UUIDs that match the auth.users table

-- First, let's create some sample posts (these will need to be updated with real author IDs after users sign up)
INSERT INTO posts (
  id,
  title,
  content,
  excerpt,
  slug,
  author_id,
  category,
  tags,
  status,
  featured_image,
  published_at,
  view_count,
  is_feature,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Дигитална трансформација српске књижевности',
  'У данашњем дигиталном добу, српска књижевност доживљава значајне промене. Писци се окрећу новим медијима и платформама за дељење својих дела.

Електронске књиге постају све популарније међу читаоцима, што омогућава ауторима да директно допру до своје публике без посредника.

Овај тренд не утиче само на дистрибуцију књига, већ и на сам процес писања и стварања књижевних дела.

## Изазови и могућности

Главни изазов који стоји пред писцима је како да се прилагоде новом окружењу, а истовремено задрже квалитет и аутентичност својих дела.

Са друге стране, дигитални медији пружају неслућене могућности за интерактивност и мултимедијалне садржаје.',
  'Анализа утицаја дигиталне револуције на српску књижевност и издаваштво.',
  'digitalna-transformacija-srpske-knjizevnosti',
  (SELECT id FROM profiles WHERE email = 'djoricnenad@gmail.com' LIMIT 1),
  'Књижевност',
  ARRAY['дигитализација', 'књижевност', 'технологија'],
  'published',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
  '2024-12-20T10:00:00Z',
  234,
  true,
  '2024-12-19T15:30:00Z',
  '2024-12-20T09:45:00Z'
),
(
  gen_random_uuid(),
  'Савремене тенденције у српској поезији',
  'Савремена српска поезија пролази кроз период интензивних промена и експериментисања.

Млади песници трагају за новим изражајним средствима и темама које одговарају духу времена.

Дигитални медији омогућавају песницима да истражују нове форме и начине представљања својих дела.

## Главне карактеристике

Савремена поезија карактерише се већом слободом у избору тема и форми, као и отворенијим приступом различитим стиловима.

Многи песници се окрећу урбаним темама и свакодневним искуствима, што чини поезију приступачнијом широј публици.',
  'Преглед актуелних токова и трендова у савременој српској поезији.',
  'savremene-tendencije-u-srpskoj-poeziji',
  (SELECT id FROM profiles WHERE email = 'marko.petrovic@example.com' LIMIT 1),
  'Књижевност',
  ARRAY['поезија', 'савремена књижевност', 'трендови'],
  'published',
  'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
  '2024-12-19T14:00:00Z',
  156,
  false,
  '2024-12-18T11:20:00Z',
  '2024-12-19T13:45:00Z'
),
(
  gen_random_uuid(),
  'Вештачка интелигенција и будућност писања',
  'Развој вештачке интелигенције поставља нова питања о будућности писања и ствараштва.

Алати за генерисање текста постају све софистициранији, што изазива дебате о улози аутора у креативном процесу.

Ипак, људски елемент остаје незаменљив када је реч о емоцијама, искуству и аутентичном стваралаштву.

## Нове могућности

AI алати могу да помогну писцима у истраживању, планирању и уређивању текстова.

Важно је да се ова технологија користи као допунско средство, а не као замена за људску креативност.',
  'Размишљање о утицају вештачке интелигенције на процес писања и стварања садржаја.',
  'vestacka-inteligencija-i-buducnost-pisanja',
  (SELECT id FROM profiles WHERE email = 'ana.jovanovic@example.com' LIMIT 1),
  'Технологија',
  ARRAY['вештачка интелигенција', 'писање', 'будућност'],
  'published',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
  '2024-12-18T16:30:00Z',
  189,
  true,
  '2024-12-17T09:15:00Z',
  '2024-12-18T16:00:00Z'
),
(
  gen_random_uuid(),
  'Културне манифестације у дигиталном добу',
  'Пандемија је убрзала дигитализацију културних манифестација и променила начин на који публика конзумира културне садржаје.

Виртуални фестивали, онлајн изложбе и стрим концерти постали су неизбежни део културног живота.

Ова трансформација отвара нове могућности за уметнике и културне институције.

## Предности дигитализације

Дигитални формат омогућава већу доступност културних садржаја и проширује публику.

Интерактивност и мултимедијалност пружају нова искуства која нису могућа у традиционалним форматима.',
  'Анализа утицаја дигиталних технологија на културне манифестације и уметност.',
  'kulturne-manifestacije-u-digitalnom-dobu',
  (SELECT id FROM profiles WHERE email = 'marko.petrovic@example.com' LIMIT 1),
  'Култура',
  ARRAY['дигитализација', 'култура', 'манифестације'],
  'published',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
  '2024-12-17T12:00:00Z',
  142,
  false,
  '2024-12-16T14:45:00Z',
  '2024-12-17T11:30:00Z'
);