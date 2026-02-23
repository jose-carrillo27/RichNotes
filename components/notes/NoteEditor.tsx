"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { X, Plus, Trash2, CheckSquare, AlignLeft, Palette, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NOTE_COLORS, cn } from "@/lib/utils";
import type { NoteWithRelations, Tag, NoteFormData } from "@/lib/types";
import { createNote, updateNote } from "@/actions/notes";

type Mode = "text" | "checklist";

interface NoteEditorProps {
  note?: NoteWithRelations | null;
  tags: Tag[];
  onClose: () => void;
}

export function NoteEditor({ note, tags, onClose }: NoteEditorProps) {
  const isEditing = !!note;
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>(
    note && note.checkItems.length > 0 ? "checklist" : "text"
  );

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [color, setColor] = useState(note?.color ?? "default");
  const [isPinned, setIsPinned] = useState(note?.isPinned ?? false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    note?.tags.map((t) => t.tagId) ?? []
  );
  const [checkItems, setCheckItems] = useState<
    { id?: string; text: string; isDone: boolean; order: number }[]
  >(
    note?.checkItems.length
      ? [...note.checkItems].sort((a, b) => a.order - b.order)
      : [{ text: "", isDone: false, order: 0 }]
  );
  const [showColors, setShowColors] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [newCheckText, setNewCheckText] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) handleSave();
  }

  function handleSave() {
    const data: NoteFormData = {
      title,
      content,
      color,
      isPinned,
      checkItems: checkItems
        .filter((i) => i.text.trim())
        .map((i, idx) => ({ text: i.text, isDone: i.isDone, order: idx })),
      tagIds: selectedTagIds,
    };

    startTransition(async () => {
      if (isEditing) await updateNote(note.id, data);
      else await createNote(data);
      onClose();
    });
  }

  function addCheckItem() {
    if (!newCheckText.trim()) return;
    setCheckItems((prev) => [
      ...prev,
      { text: newCheckText, isDone: false, order: prev.length },
    ]);
    setNewCheckText("");
  }

  function removeCheckItem(idx: number) {
    setCheckItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateCheckItem(idx: number, text: string) {
    setCheckItems((prev) => prev.map((item, i) => (i === idx ? { ...item, text } : item)));
  }

  function toggleCheckItemDone(idx: number) {
    setCheckItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, isDone: !item.isDone } : item))
    );
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  const colors = NOTE_COLORS[color as keyof typeof NOTE_COLORS] ?? NOTE_COLORS.default;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl border shadow-2xl shadow-black/60 flex flex-col max-h-[85vh] animate-slide-up overflow-hidden",
          colors.bg,
          colors.border
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Editor Header */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-2">
          <input
            ref={titleRef}
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white font-bold text-lg placeholder:text-white/20"
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white/40 hover:text-white flex-shrink-0"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-1 px-5 pb-3">
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              mode === "text"
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/60"
            )}
            onClick={() => setMode("text")}
          >
            <AlignLeft className="w-3 h-3" />
            Texto
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              mode === "checklist"
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/60"
            )}
            onClick={() => setMode("checklist")}
          >
            <CheckSquare className="w-3 h-3" />
            Lista
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">
          {mode === "text" ? (
            <textarea
              placeholder="Escribe algo..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent outline-none text-white/70 text-sm placeholder:text-white/20 resize-none min-h-[140px] leading-relaxed"
            />
          ) : (
            <div className="space-y-1.5">
              {checkItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 group/item">
                  <button
                    className={cn(
                      "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                      item.isDone
                        ? "bg-emerald-500/80 border-emerald-500"
                        : "border-white/20 hover:border-white/40"
                    )}
                    onClick={() => toggleCheckItemDone(idx)}
                  >
                    {item.isDone && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateCheckItem(idx, e.target.value)}
                    className={cn(
                      "flex-1 bg-transparent outline-none text-sm transition-colors",
                      item.isDone ? "line-through text-white/25" : "text-white/70"
                    )}
                    placeholder="Elemento..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCheckItem();
                      }
                    }}
                  />
                  <button
                    className="opacity-0 group-hover/item:opacity-100 text-white/20 hover:text-red-400 transition-all"
                    onClick={() => removeCheckItem(idx)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add new check item */}
              <div className="flex items-center gap-2.5 mt-2">
                <div className="w-4 h-4 rounded border border-dashed border-white/15 flex-shrink-0" />
                <input
                  type="text"
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  placeholder="+ Agregar elemento"
                  className="flex-1 bg-transparent outline-none text-sm text-white/30 placeholder:text-white/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCheckItem();
                    }
                  }}
                />
                {newCheckText && (
                  <Button variant="ghost" size="icon-sm" onClick={addCheckItem}>
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTagIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-5 pb-3">
            {selectedTagIds.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <Badge
                  key={tag.id}
                  color={tag.color}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name} ×
                </Badge>
              );
            })}
          </div>
        )}

        {/* Footer toolbar */}
        <div className="flex items-center gap-1 px-4 py-3 border-t border-white/5">
          {/* Color picker */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg"
              title="Color"
              onClick={() => {
                setShowColors((v) => !v);
                setShowTags(false);
              }}
            >
              <Palette className="w-3.5 h-3.5" />
            </Button>
            {showColors && (
              <div className="absolute bottom-10 left-0 bg-[#1a1828]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 w-48 shadow-2xl z-10 animate-slide-up">
                {Object.entries(NOTE_COLORS).map(([key, val]) => (
                  <button
                    key={key}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                      val.bg,
                      color === key ? "border-white/60 scale-110" : "border-white/10"
                    )}
                    title={val.label}
                    onClick={() => {
                      setColor(key);
                      setShowColors(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tag picker */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg"
              title="Etiquetas"
              onClick={() => {
                setShowTags((v) => !v);
                setShowColors(false);
              }}
            >
              <TagIcon className="w-3.5 h-3.5" />
            </Button>
            {showTags && (
              <div className="absolute bottom-10 left-0 bg-[#1a1828]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 w-44 shadow-2xl z-10 animate-slide-up">
                {tags.length === 0 ? (
                  <p className="text-white/30 text-xs px-2 py-1.5">No hay etiquetas</p>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag.id}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors",
                        selectedTagIds.includes(tag.id)
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => toggleTag(tag.id)}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: tag.color }}
                      />
                      {tag.name}
                      {selectedTagIds.includes(tag.id) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="text-white/40"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isPending}
            className="min-w-[80px]"
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando
              </span>
            ) : isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
