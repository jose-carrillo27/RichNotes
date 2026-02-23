# 🗒️ RichNotes — Notas Enriquecidas con Supabase

Plataforma de notas tipo Google Keep construida con **Next.js 14 App Router**,
**Server Actions** y **Supabase** (PostgreSQL) como base de datos.

---

## 🚀 Configuración con Supabase

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Anota tu contraseña de base de datos al crearla

### 2. Obtener las URLs de conexión

En tu panel de Supabase:
**Settings → Database → Connection string**

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear las tablas en Supabase

```bash
# Opción A: Push directo del schema (desarrollo)
npm run db:push

# Opción B: Migración versionada (recomendado para producción)
npm run db:migrate
```

### 5. Cargar datos de ejemplo (opcional)

```bash
npm run db:seed
```

### 6. Ejecutar el proyecto

```bash
npm run dev
# → http://localhost:3000
```

---

**Flujo completo:**

```
Client Component
     ↓ llama Server Action directamente
Server Action ("use server")
     ↓ Prisma ORM
Supabase PostgreSQL
     ↓ revalidatePath()
Page (Server Component) se re-renderiza con datos frescos
```

---
