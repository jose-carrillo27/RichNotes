"use client";

import { useState, useTransition } from "react";
import { Plus, LayoutGrid, List, Search, Trash2 } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { Button } from "@/components/ui/button";
import { emptyTrash, restoreNote, deleteNote } from "@/actions/notes";
import { cn } from "@/lib/utils";
import type { NoteWithRelations, Tag } from "@/lib/types";

interface NotesGridProps {
  notes: NoteWithRelations[];
  tags: Tag[];
  filter: string | null;
  tagFilter: string | null;
}

export function NotesGrid({ notes, tags, filter, tagFilter }: NotesGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteWithRelations | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = notes.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.checkItems.some((i) => i.text.toLowerCase().includes(q)) ||
      n.tags.some((t) => t.tag.name.toLowerCase().includes(q))
    );
  });

  const pinned = filtered.filter(
    (n) => n.isPinned && !n.isArchived && !n.isTrashed,
  );
  const others = filtered.filter(
    (n) => !n.isPinned && !n.isArchived && !n.isTrashed,
  );

  function openEditor(note?: NoteWithRelations) {
    setEditingNote(note ?? null);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingNote(null);
  }

  const isTrashed = filter === "trashed";
  const isEmpty = filtered.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-4 border-b border-white/5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-500/40 transition-all"
          />
        </div>

        <div className="flex-1" />

        {/* View toggle — oculto en móvil */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1">
          <button
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
              view === "grid"
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/60",
            )}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
              view === "list"
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/60",
            )}
            onClick={() => setView("list")}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nueva nota */}
        {!isTrashed && (
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
            onClick={() => openEditor()}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva nota</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        )}

        {/* Vaciar papelera */}
        {isTrashed && filtered.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => emptyTrash())}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vaciar papelera</span>
          </Button>
        )}
      </div>

      {/* Notes area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
        {isEmpty ? (
          <EmptyState filter={filter} tagFilter={tagFilter} search={search} />
        ) : (
          <>
            {isTrashed && <TrashedList notes={filtered} />}

            {!isTrashed && (
              <>
                {pinned.length > 0 && (
                  <section className="mb-6">
                    <SectionLabel>Ancladas</SectionLabel>
                    <NotesLayout
                      notes={pinned}
                      view={view}
                      onEdit={openEditor}
                    />
                  </section>
                )}
                {others.length > 0 && (
                  <section>
                    {pinned.length > 0 && <SectionLabel>Otras</SectionLabel>}
                    <NotesLayout
                      notes={others}
                      view={view}
                      onEdit={openEditor}
                    />
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Quick create bar */}
      {!isTrashed && !editorOpen && (
        <div
          className="mx-4 md:mx-6 mb-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 cursor-text"
          onClick={() => openEditor()}
        >
          <p className="text-white/20 text-sm">Toma una nota...</p>
        </div>
      )}

      {editorOpen && (
        <NoteEditor note={editingNote} tags={tags} onClose={closeEditor} />
      )}
    </div>
  );
}

function NotesLayout({
  notes,
  view,
  onEdit,
}: {
  notes: NoteWithRelations[];
  view: "grid" | "list";
  onEdit: (note: NoteWithRelations) => void;
}) {
  return (
    <div
      className={cn(
        // En móvil siempre lista; en desktop respeta el toggle
        "flex flex-col gap-2",
        view === "grid" &&
          "md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-3 md:flex-none",
      )}
    >
      {notes.map((note) => (
        // En móvil forzamos view="list", en desktop usamos el estado real
        <NoteCard key={note.id} note={note} onEdit={onEdit} view={view} />
      ))}
    </div>
  );
}

function TrashedList({ notes }: { notes: NoteWithRelations[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/30 mb-4">
        Las notas en la papelera se eliminan permanentemente.
      </p>
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/60 truncate">
              {note.title || "Sin título"}
            </p>
            {note.content && (
              <p className="text-xs text-white/30 truncate mt-0.5">
                {note.content}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => startTransition(() => restoreNote(note.id))}
            >
              Restaurar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => startTransition(() => deleteNote(note.id))}
            >
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-3">
      {children}
    </p>
  );
}

function EmptyState({
  filter,
  tagFilter,
  search,
}: {
  filter: string | null;
  tagFilter: string | null;
  search: string;
}) {
  const messages: Record<string, { title: string; desc: string }> = {
    pinned: {
      title: "Sin notas ancladas",
      desc: "Ancla las notas importantes para verlas aquí",
    },
    archived: {
      title: "Sin notas archivadas",
      desc: "Las notas archivadas aparecerán aquí",
    },
    trashed: {
      title: "Papelera vacía",
      desc: "Las notas eliminadas aparecerán aquí",
    },
  };

  const msg = search
    ? {
        title: "Sin resultados",
        desc: `No hay notas que coincidan con "${search}"`,
      }
    : filter
      ? messages[filter]
      : tagFilter
        ? {
            title: "Sin notas con esta etiqueta",
            desc: "Agrega esta etiqueta a una nota",
          }
        : { title: "Sin notas aún", desc: "Crea tu primera nota arriba" };

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
        <Plus className="w-6 h-6 text-white/15" />
      </div>
      <h3 className="text-sm font-semibold text-white/30 mb-1">{msg?.title}</h3>
      <p className="text-xs text-white/15">{msg?.desc}</p>
    </div>
  );
}
