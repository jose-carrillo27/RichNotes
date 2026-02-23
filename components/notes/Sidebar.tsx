"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  StickyNote,
  Pin,
  Archive,
  Trash2,
  Tag as TagIcon,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types";
import { createTag } from "@/actions/tags";

interface SidebarProps {
  tags: Tag[];
  counts: {
    all: number;
    pinned: number;
    archived: number;
    trashed: number;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  tags,
  counts,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const currentFilter = searchParams.get("filter");

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#7c6af7");

  const TAG_COLORS = [
    "#7c6af7",
    "#f7946a",
    "#4ade80",
    "#38bdf8",
    "#f472b6",
    "#fb923c",
  ];

  async function handleCreateTag() {
    if (!newTagName.trim()) return;
    await createTag(newTagName, newTagColor);
    setNewTagName("");
    setIsAddingTag(false);
  }

  const navItems = [
    {
      href: "/",
      icon: <StickyNote className="w-4 h-4" />,
      label: "Todas las notas",
      count: counts.all,
      filter: null,
    },
    {
      href: "/?filter=pinned",
      icon: <Pin className="w-4 h-4" />,
      label: "Ancladas",
      count: counts.pinned,
      filter: "pinned",
    },
    {
      href: "/?filter=archived",
      icon: <Archive className="w-4 h-4" />,
      label: "Archivo",
      count: counts.archived,
      filter: "archived",
    },
    {
      href: "/?filter=trashed",
      icon: <Trash2 className="w-4 h-4" />,
      label: "Papelera",
      count: counts.trashed,
      filter: "trashed",
    },
  ];

  const sidebarContent = (
    <aside className="w-56 flex-shrink-0 bg-[#0e0d18] border-r border-white/5 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-tight">
              Rich
            </span>
            <span className="text-violet-400 font-bold text-sm tracking-tight">
              Notes
            </span>
          </div>
        </div>
        {/* Botón cerrar — solo visible en móvil */}
        {onClose && (
          <button
            className="md:hidden text-white/30 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = !activeTag && currentFilter === item.filter;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-600/20 text-violet-300 shadow-inner"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5",
              )}
            >
              <span className={isActive ? "text-violet-400" : "text-white/30"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.count > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                    isActive
                      ? "bg-violet-500/30 text-violet-300"
                      : "bg-white/5 text-white/30",
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tags section */}
      <div className="px-2 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex-1">
            Etiquetas
          </span>
          <button
            className="text-white/20 hover:text-violet-400 transition-colors"
            onClick={() => setIsAddingTag((v) => !v)}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAddingTag && (
          <div className="px-2 mb-2 space-y-2 animate-slide-up">
            <input
              autoFocus
              type="text"
              placeholder="Nombre de etiqueta"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTag();
                if (e.key === "Escape") setIsAddingTag(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-violet-500/40"
            />
            <div className="flex gap-1">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
                    newTagColor === c
                      ? "border-white/60 scale-110"
                      : "border-transparent",
                  )}
                  style={{ background: c }}
                  onClick={() => setNewTagColor(c)}
                />
              ))}
              <button
                className="ml-auto text-[10px] font-medium text-violet-400 hover:text-violet-300"
                onClick={handleCreateTag}
              >
                Crear
              </button>
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          {tags.map((tag) => {
            const isActive = activeTag === tag.id;
            return (
              <Link
                key={tag.id}
                href={`/?tag=${tag.id}`}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5",
                )}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: tag.color }}
                />
                <span className="flex-1 truncate text-xs">{tag.name}</span>
              </Link>
            );
          })}
          {tags.length === 0 && !isAddingTag && (
            <p className="px-3 text-[11px] text-white/15 py-1">
              Sin etiquetas aún
            </p>
          )}
        </div>
      </div>

      <div className="flex-1" />
      <div className="px-4 pb-5">
        <div className="rounded-xl bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/10 p-3">
          <p className="text-[10px] text-white/30 leading-relaxed">
            <span className="text-violet-400 font-semibold">
              Server Actions
            </span>{" "}
            — Los cambios se sincronizan sin endpoints REST.
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Overlay oscuro — solo en móvil cuando está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer en móvil / estático en desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
