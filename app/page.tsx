import { prisma } from "@/lib/prisma";
import { MobileLayout } from "@/components/notes/MobileLayout";
import type { NoteWithRelations } from "@/lib/types";

interface HomeProps {
  searchParams: {
    filter?: string;
    tag?: string;
  };
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { filter, tag } = searchParams;

  const [tags, notes] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.note.findMany({
      where: buildWhere(filter, tag),
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      include: {
        checkItems: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
        images: true,
      },
    }),
  ]);

  const [pinnedCount, archivedCount, trashedCount, allCount] =
    await Promise.all([
      prisma.note.count({
        where: { isPinned: true, isArchived: false, isTrashed: false },
      }),
      prisma.note.count({ where: { isArchived: true, isTrashed: false } }),
      prisma.note.count({ where: { isTrashed: true } }),
      prisma.note.count({ where: { isArchived: false, isTrashed: false } }),
    ]);

  const pageTitle = getPageTitle(filter, tag, tags);

  return (
    <MobileLayout
      tags={tags}
      counts={{
        all: allCount,
        pinned: pinnedCount,
        archived: archivedCount,
        trashed: trashedCount,
      }}
      pageTitle={pageTitle}
      notesCount={notes.length}
      notes={notes as NoteWithRelations[]}
      filter={filter ?? null}
      tagFilter={tag ?? null}
    />
  );
}

function buildWhere(filter?: string, tag?: string) {
  if (filter === "pinned")
    return { isPinned: true, isArchived: false, isTrashed: false };
  if (filter === "archived") return { isArchived: true, isTrashed: false };
  if (filter === "trashed") return { isTrashed: true };
  if (tag) return { isTrashed: false, tags: { some: { tagId: tag } } };
  return { isArchived: false, isTrashed: false };
}

function getPageTitle(
  filter?: string,
  tagId?: string,
  tags?: { id: string; name: string }[],
) {
  if (filter === "pinned") return "Ancladas";
  if (filter === "archived") return "Archivo";
  if (filter === "trashed") return "Papelera";
  if (tagId && tags) {
    const tag = tags.find((t) => t.id === tagId);
    return tag ? `# ${tag.name}` : "Etiqueta";
  }
  return "Todas las notas";
}
