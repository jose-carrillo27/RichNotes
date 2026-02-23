# 🛠️ Guía de configuración Supabase paso a paso

## Paso 1 — Crear cuenta y proyecto

1. Ve a **https://supabase.com** → "Start your project"
2. Regístrate con GitHub o email
3. Haz clic en **"New project"**
4. Elige un nombre, región y **guarda la contraseña** (la necesitarás)
5. Espera ~2 minutos mientras Supabase provisiona tu base de datos

---

## Paso 2 — Obtener las Connection Strings

Una vez creado el proyecto:

1. Panel lateral → **Settings** → **Database**
2. Baja hasta la sección **"Connection string"**
3. Selecciona la pestaña **"URI"**

Necesitas copiar dos URLs distintas:

### DATABASE_URL (Transaction pooler — puerto 6543)
```
Mode: Transaction  →  puerto 6543  →  con ?pgbouncer=true
```
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### DIRECT_URL (Session — puerto 5432)
```
Mode: Session  →  puerto 5432  →  conexión directa
```
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> 💡 **¿Por qué dos URLs?**
> - `DATABASE_URL` usa PgBouncer (Transaction mode) → optimizado para serverless/edge
> - `DIRECT_URL` es conexión directa → necesario para que `prisma migrate` funcione

---

## Paso 3 — Configurar el .env local

```bash
cp .env.example .env
```

Edita `.env` con tus valores reales:

```env
DATABASE_URL="postgresql://postgres.abcdefgh:[TU_PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

DIRECT_URL="postgresql://postgres.abcdefgh:[TU_PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```

---

## Paso 4 — Crear las tablas

```bash
# Desarrollo rápido (sin historial de migraciones)
npm run db:push

# ✅ Recomendado: con historial de versiones
npm run db:migrate
# Cuando pregunte el nombre: "init"
```

Verifica en Supabase: **Table Editor** → deberías ver las tablas `Note`, `Tag`, `CheckItem`, etc.

---

## Paso 5 — (Opcional) Cargar datos de ejemplo

```bash
npm run db:seed
```

---

## Paso 6 — Variables en Vercel (producción)

En tu proyecto de Vercel:
**Settings → Environment Variables**

| Key | Value |
|---|---|
| `DATABASE_URL` | Tu pooler URL (puerto 6543) |
| `DIRECT_URL` | Tu direct URL (puerto 5432) |

---

## ❓ Troubleshooting frecuente

### Error: "Can't reach database server"
→ Verifica que copiaste la URL correcta. El puerto 6543 es para `DATABASE_URL`, el 5432 para `DIRECT_URL`.

### Error: "prepared statement already exists"
→ Estás usando PgBouncer en modo Session en vez de Transaction. Asegúrate de usar el puerto **6543** con `?pgbouncer=true` en `DATABASE_URL`.

### Error en `prisma migrate`: "Direct URL needed"
→ Confirma que tienes `DIRECT_URL` definida en tu `.env` y que el schema tiene `directUrl = env("DIRECT_URL")`.

### Las migraciones no se aplican en Vercel
→ Agrega `prisma migrate deploy` al build command:
```
prisma generate && prisma migrate deploy && next build
```
