export function trackEvent(name: string, payload?: Record<string, unknown>) {
  console.info(`[event] ${name}`, payload);
}
