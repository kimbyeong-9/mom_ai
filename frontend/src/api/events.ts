import { api } from "./axios";

export async function logEvent(name: string, payload?: Record<string, unknown>): Promise<void> {
  await api.post("/events", { name, payload });
}
