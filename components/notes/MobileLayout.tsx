"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { NotesGrid } from "./NotesGrid";
import type { NoteWithRelations, Tag } from "@/lib/types";

interface MobileLayoutProps {
  tags: Tag[];
  counts: { all: number; pinned: number; archived: number; trashed: number };
  pageTitle: string;
  notesCount: number;
  notes: NoteWithRelations[];
  filter: string | null;
  tagFilter: string | null;
}

export function MobileLayout({
  tags,
  counts,
  pageTitle,
  notesCount,
  notes,
  filter,
  tagFilter,
}: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#13111f]">
      {/* Sidebar estático en desktop */}
      <div className="hidden md:flex">
        <Sidebar tags={tags} counts={counts} />
      </div>

      {/* Sidebar drawer en móvil */}
      <div className="md:hidden">
        <Sidebar
          tags={tags}
          counts={counts}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="px-4 md:px-6 pt-5 pb-3 border-b border-white/5 flex items-center gap-3">
          {/* Botón hamburguesa — solo móvil */}
          <button
            className="md:hidden text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base font-bold text-white/90">{pageTitle}</h1>
            <p className="text-xs text-white/30 mt-0.5">
              {notesCount} {notesCount === 1 ? "nota" : "notas"}
            </p>
          </div>

          <div className="ml-auto hidden md:block">
            <span className="text-[10px] font-mono text-white/15 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              Next.js 14 · Server Actions
            </span>
          </div>
        </header>

        <NotesGrid
          notes={notes}
          tags={tags}
          filter={filter}
          tagFilter={tagFilter}
        />
      </main>
    </div>
  );
}
