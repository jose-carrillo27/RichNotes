"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { NoteFormData } from "@/lib/types";

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
export async function createNote(data: NoteFormData) {
  const note = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      color: data.color,
      isPinned: data.isPinned,
      checkItems: {
        create: data.checkItems.map((item, idx) => ({
          text: item.text,
          isDone: item.isDone,
          order: idx,
        })),
      },
      tags: {
        create: data.tagIds.map((tagId) => ({ tagId })),
      },
    },
    include: { checkItems: true, tags: { include: { tag: true } }, images: true },
  });

  revalidatePath("/");
  return { success: true, note };
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export async function updateNote(id: string, data: NoteFormData) {
  // Delete and recreate check items and tags for simplicity
  await prisma.checkItem.deleteMany({ where: { noteId: id } });
  await prisma.noteTag.deleteMany({ where: { noteId: id } });

  const note = await prisma.note.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      color: data.color,
      isPinned: data.isPinned,
      checkItems: {
        create: data.checkItems.map((item, idx) => ({
          text: item.text,
          isDone: item.isDone,
          order: idx,
        })),
      },
      tags: {
        create: data.tagIds.map((tagId) => ({ tagId })),
      },
    },
    include: { checkItems: true, tags: { include: { tag: true } }, images: true },
  });

  revalidatePath("/");
  return { success: true, note };
}

// ─────────────────────────────────────────────
// TOGGLE PIN
// ─────────────────────────────────────────────
export async function togglePin(id: string) {
  const note = await prisma.note.findUnique({ where: { id }, select: { isPinned: true } });
  if (!note) return { success: false };

  await prisma.note.update({
    where: { id },
    data: { isPinned: !note.isPinned },
  });

  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────
// TOGGLE CHECK ITEM
// ─────────────────────────────────────────────
export async function toggleCheckItem(id: string) {
  const item = await prisma.checkItem.findUnique({ where: { id }, select: { isDone: true } });
  if (!item) return { success: false };

  await prisma.checkItem.update({
    where: { id },
    data: { isDone: !item.isDone },
  });

  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────
// ARCHIVE / UNARCHIVE
// ─────────────────────────────────────────────
export async function toggleArchive(id: string) {
  const note = await prisma.note.findUnique({ where: { id }, select: { isArchived: true } });
  if (!note) return { success: false };

  await prisma.note.update({
    where: { id },
    data: { isArchived: !note.isArchived },
  });

  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────
// TRASH / RESTORE
// ─────────────────────────────────────────────
export async function trashNote(id: string) {
  await prisma.note.update({
    where: { id },
    data: { isTrashed: true, isPinned: false },
  });

  revalidatePath("/");
  return { success: true };
}

export async function restoreNote(id: string) {
  await prisma.note.update({
    where: { id },
    data: { isTrashed: false },
  });

  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────
// PERMANENT DELETE
// ─────────────────────────────────────────────
export async function deleteNote(id: string) {
  await prisma.note.delete({ where: { id } });

  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────
// EMPTY TRASH
// ─────────────────────────────────────────────
export async function emptyTrash() {
  await prisma.note.deleteMany({ where: { isTrashed: true } });

  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────
// DUPLICATE
// ─────────────────────────────────────────────
export async function duplicateNote(id: string) {
  const original = await prisma.note.findUnique({
    where: { id },
    include: { checkItems: true, tags: true },
  });

  if (!original) return { success: false };

  await prisma.note.create({
    data: {
      title: original.title ? `${original.title} (copia)` : "",
      content: original.content,
      color: original.color,
      checkItems: {
        create: original.checkItems.map((item) => ({
          text: item.text,
          isDone: item.isDone,
          order: item.order,
        })),
      },
      tags: {
        create: original.tags.map((t) => ({ tagId: t.tagId })),
      },
    },
  });

  revalidatePath("/");
  return { success: true };
}
