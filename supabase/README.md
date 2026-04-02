# Supabase setup para autoeliteriachuelo

## 1) Crear el proyecto en Supabase
1. Ir a Supabase y crear el proyecto.
2. Copiar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en tu `.env` local.
3. Copiar `SUPABASE_SERVICE_ROLE_KEY` (service_role) en tu `.env` local para operaciones server-side protegidas.
4. Configurar `NEXT_PUBLIC_SITE_URL` con el dominio real del deploy para metadata, canonical y sitemap.

## 2) Ejecutar migración SQL
1. En Supabase Dashboard, ir a "SQL Editor".
2. Copiar y ejecutar el contenido de `supabase/migrations/0001_init.sql`.
3. Confirmar que se crean las tablas `vehicles` y `vehicle_images`.

## 3) Crear bucket de Storage
- Nombre recomendado: `vehicle-images`
- Public URL: opcional. Recomendado: privado y usar URLs firmadas.

## 4) Estrategia de naming de imágenes
- `vehicles/{vehicle_id}/{uuid}-{filename}`

## 5) Reglas RLS preparadas
- `vehicles`: lectura pública solo `is_published=true`.
- `vehicle_images`: lectura pública solo si el vehículo correspondiente está publicado.
- CRUD administrativo requiere claim JWT `role=admin`.

## 6) Uso en backend (futura fase)
- Importar y usar `supabase` desde `lib/supabaseClient.ts`.
- Para operaciones admin desde server use la `SUPABASE_SERVICE_ROLE_KEY` en funciones protegidas.
