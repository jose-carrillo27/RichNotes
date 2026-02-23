import { PrismaClient } from "@prisma/client";

// Ejecutar: npm run db:seed
// Requiere que DATABASE_URL esté configurado con Supabase

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed en Supabase...");

  // Limpia datos previos (útil para re-seedear)
  await prisma.noteTag.deleteMany();
  await prisma.checkItem.deleteMany();
  await prisma.noteImage.deleteMany();
  await prisma.note.deleteMany();
  await prisma.tag.deleteMany();

  // Tags de ejemplo
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "trabajo",  color: "#7c6af7" } }),
    prisma.tag.create({ data: { name: "personal", color: "#f7946a" } }),
    prisma.tag.create({ data: { name: "ideas",    color: "#4ade80" } }),
    prisma.tag.create({ data: { name: "lectura",  color: "#38bdf8" } }),
    prisma.tag.create({ data: { name: "urgente",  color: "#f472b6" } }),
  ]);

  const [trabajo, personal, ideas, lectura] = tags;

  // Notas de ejemplo
  await prisma.note.create({
    data: {
      title: "Bienvenido a RichNotes ✦",
      content:
        "Plataforma de notas con Next.js 14 + Server Actions + Supabase. " +
        "Todas las mutaciones usan Server Actions — sin endpoints REST. " +
        "revalidatePath() sincroniza la UI automáticamente tras cada cambio.",
      color: "violet",
      isPinned: true,
      tags: { create: [{ tagId: ideas.id }] },
    },
  });

  await prisma.note.create({
    data: {
      title: "Lista de compras",
      content: "",
      color: "sage",
      checkItems: {
        create: [
          { text: "Leche oat",             isDone: true,  order: 0 },
          { text: "Pan de masa madre",     isDone: false, order: 1 },
          { text: "Aguacate (x4)",          isDone: false, order: 2 },
          { text: "Café de especialidad",  isDone: false, order: 3 },
          { text: "Chocolate 85%",         isDone: false, order: 4 },
        ],
      },
      tags: { create: [{ tagId: personal.id }] },
    },
  });

  await prisma.note.create({
    data: {
      title: "Stack técnico del proyecto",
      content:
        "Next.js 14 App Router · Prisma ORM · Supabase (PostgreSQL) · " +
        "Server Actions · TypeScript · Tailwind CSS · Radix UI · Lucide React",
      color: "ocean",
      tags: { create: [{ tagId: trabajo.id }] },
    },
  });

  await prisma.note.create({
    data: {
      title: "Libros pendientes 📚",
      content: "",
      color: "amber",
      checkItems: {
        create: [
          { text: "Thinking in Systems — Donella Meadows",        isDone: false, order: 0 },
          { text: "The Pragmatic Programmer",                      isDone: true,  order: 1 },
          { text: "Designing Data-Intensive Applications",         isDone: false, order: 2 },
          { text: "A Philosophy of Software Design — John Ousterhout", isDone: false, order: 3 },
        ],
      },
      tags: { create: [{ tagId: lectura.id }] },
    },
  });

  await prisma.note.create({
    data: {
      title: "Ideas para el sprint",
      content:
        "• Modo oscuro / claro con next-themes\n" +
        "• Drag & drop para reordenar notas\n" +
        "• Colaboración en tiempo real con Supabase Realtime\n" +
        "• Exportar notas a Markdown\n" +
        "• Autenticación con Supabase Auth",
      color: "coral",
      tags: { create: [{ tagId: trabajo.id }, { tagId: ideas.id }] },
    },
  });

  console.log(`✅ Seed completado — ${await prisma.note.count()} notas creadas en Supabase`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
