import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NOTE_COLORS = {
  default: {
    bg: "bg-[#12111c]",
    border: "border-white/5",
    cardBg: "#12111c",
    label: "Predeterminado",
  },
  coral: {
    bg: "bg-[#2d1515]",
    border: "border-red-900/30",
    cardBg: "#2d1515",
    label: "Coral",
  },
  amber: {
    bg: "bg-[#261d0a]",
    border: "border-amber-900/30",
    cardBg: "#261d0a",
    label: "Ámbar",
  },
  sage: {
    bg: "bg-[#0e2218]",
    border: "border-green-900/30",
    cardBg: "#0e2218",
    label: "Salvia",
  },
  ocean: {
    bg: "bg-[#091e2e]",
    border: "border-blue-900/30",
    cardBg: "#091e2e",
    label: "Océano",
  },
  violet: {
    bg: "bg-[#180e30]",
    border: "border-violet-900/30",
    cardBg: "#180e30",
    label: "Violeta",
  },
  slate: {
    bg: "bg-[#141820]",
    border: "border-slate-700/30",
    cardBg: "#141820",
    label: "Pizarra",
  },
} as const;

export type NoteColor = keyof typeof NOTE_COLORS;

export function formatDate(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "ahora mismo";
  if (minutes < 60) return `hace ${minutes}m`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 7) return `hace ${days}d`;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}
