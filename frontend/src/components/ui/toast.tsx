import { useEffect } from "react";

import { useToastStore } from "@/store/toast.store";

export function Toast() {
  const message = useToastStore((state) => state.queue[0] ?? null);
  const shift = useToastStore((state) => state.shift);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(shift, 2500);
    return () => clearTimeout(timer);
  }, [message, shift]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg">
      {message}
    </div>
  );
}
