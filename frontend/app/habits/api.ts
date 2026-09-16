import { apiFetch } from "../../lib/API";
import { HabitRecord } from "../dashboard/types";
import type { Habit, HabitForm } from "./types";

export async function getHabits(): Promise<Habit[]> {
  return await apiFetch("/habits");
}

export async function createHabit(form: HabitForm) {
  return await apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      frequency: form.frequency,
      priority: form.priority,
      repeticiones: form.repeticiones,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      active: form.active,
    }),
  });
}

export async function updateHabit(id: string, form: HabitForm) {
  return await apiFetch(`/habits/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      frequency: form.frequency,
      priority: form.priority,
      repeticiones: form.repeticiones,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      active: form.active,
    }),
  });
}

export async function deleteHabit(id: string) {
  return await apiFetch(`/habits/${id}`, {
    method: "DELETE",
  });
}

export async function updateRecord(
  id: string,
  data: { completed: boolean },
): Promise<HabitRecord> {
  return await apiFetch(`/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
