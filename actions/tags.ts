"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createTag(name: string, color: string) {
  const tag = await prisma.tag.create({ data: { name: name.toLowerCase().trim(), color } });
  revalidatePath("/");
  return { success: true, tag };
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function getTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}
