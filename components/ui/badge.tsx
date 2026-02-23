import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, color, className, onClick }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        className,
      )}
      style={
        color
          ? {
              backgroundColor: `${color}22`,
              color: color,
              border: `1px solid ${color}44`,
            }
          : {}
      }
      onClick={onClick}
    >
      {children}
    </span>
  );
}
