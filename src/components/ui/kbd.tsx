import { cn } from "@/lib/utils";

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center rounded-[5px] border border-border bg-surface px-1 font-mono text-[11px] font-medium text-faint-foreground",
        className,
      )}
      {...props}
    />
  );
}
