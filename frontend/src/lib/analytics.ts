import { logEvent } from "@/api/events";

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  void logEvent(name, payload).catch(() => {
    // analytics failures shouldn't surface to the user
  });
}
