"use client";

import { useState, useTransition } from "react";
import {
  Pin,
  Archive,
  Trash2,
  Copy,
  MoreVertical,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NOTE_COLORS, formatDate, cn } from "@/lib/utils";
import type { NoteWithRelations } from "@/lib/types";
import {
  togglePin,
  toggleArchive,
  trashNote,
  duplicateNote,
  toggleCheckItem,
} from "@/actions/notes";

interface NoteCardProps {
  note: NoteWithRelations;
  onEdit: (note: NoteWithRelations) => void;
  view: "grid" | "list";
}

export function NoteCard({ note, onEdit, view }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const colors =
    NOTE_COLORS[note.color as keyof typeof NOTE_COLORS] ?? NOTE_COLORS.default;

  const doneCount = note.checkItems.filter((i) => i.isDone).length;
  const totalCount = note.checkItems.length;

  function handleTogglePin(e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(() => togglePin(note.id));
  }

  function handleAction(e: React.MouseEvent, action: () => void) {
    e.stopPropagation();
    setMenuOpen(false);
    startTransition(action);
  }

  function handleCheckItem(e: React.MouseEvent, itemId: string) {
    e.stopPropagation();
    startTransition(() => toggleCheckItem(itemId));
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
        colors.bg,
        colors.border,
        "hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-0.5",
        isPending && "opacity-70 pointer-events-none",
        view === "list"
          ? "flex gap-4 items-start"
          : "md:block flex gap-4 items-start",
      )}
      onClick={() => onEdit(note)}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className={cn("p-4 relative", view === "list" && "flex-1 min-w-0")}>
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {note.title && (
              <h3 className="font-semibold text-white/90 text-sm leading-snug truncate pr-6">
                {note.title}
              </h3>
            )}
          </div>
        </div>

        {/* Content */}
        {note.content && (
          <p
            className={cn(
              "text-white/50 text-xs leading-relaxed",
              view === "grid" ? "line-clamp-4" : "line-clamp-2",
            )}
          >
            {note.content}
          </p>
        )}

        {/* Checklist preview */}
        {note.checkItems.length > 0 && (
          <ul className="mt-2 space-y-1">
            {note.checkItems.slice(0, view === "list" ? 2 : 4).map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 text-xs"
                onClick={(e) => handleCheckItem(e, item.id)}
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                    item.isDone
                      ? "bg-emerald-500/80 border-emerald-500"
                      : "border-white/20 hover:border-white/40",
                  )}
                >
                  {item.isDone && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={cn(
                    "truncate",
                    item.isDone
                      ? "line-through text-white/25"
                      : "text-white/60",
                  )}
                >
                  {item.text}
                </span>
              </li>
            ))}
            {note.checkItems.length > (view === "list" ? 2 : 4) && (
              <li className="text-white/30 text-[10px] pl-5">
                +{note.checkItems.length - (view === "list" ? 2 : 4)} más
              </li>
            )}
          </ul>
        )}

        {/* Progress bar for checklist */}
        {totalCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500/70 rounded-full transition-all duration-300"
                style={{ width: `${(doneCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-white/30 font-mono">
              {doneCount}/{totalCount}
            </span>
          </div>
        )}

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {note.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.id} color={tag.color}>
                {tag.name}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <span className="text-white/20 text-[10px] flex items-center">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-[10px] text-white/25 font-mono">
            {formatDate(note.updatedAt)}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Pin */}
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                "rounded-lg",
                note.isPinned && "text-amber-400 bg-amber-400/10",
              )}
              onClick={handleTogglePin}
              title={note.isPinned ? "Desanclar" : "Anclar"}
            >
              <Pin className="w-3 h-3" />
            </Button>

            {/* More menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>

              {menuOpen && (
                <div
                  className="absolute right-0 bottom-8 w-44 rounded-xl border border-white/10 bg-[#1a1828]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem
                    icon={<Archive className="w-3.5 h-3.5" />}
                    label={note.isArchived ? "Desarchivar" : "Archivar"}
                    onClick={(e) =>
                      handleAction(e, () => toggleArchive(note.id))
                    }
                  />
                  <MenuItem
                    icon={<Copy className="w-3.5 h-3.5" />}
                    label="Duplicar"
                    onClick={(e) =>
                      handleAction(e, () => duplicateNote(note.id))
                    }
                  />
                  <div className="h-px bg-white/5 mx-2" />
                  <MenuItem
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    label="Mover a papelera"
                    danger
                    onClick={(e) => handleAction(e, () => trashNote(note.id))}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-2 right-2 text-amber-400/80">
          <Pin className="w-3 h-3 fill-current" />
        </div>
      )}

      {/* Close menu on outside click */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-colors text-left",
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-white/60 hover:text-white hover:bg-white/5",
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
