//crud paste here
import { apiFetch } from "../lib/API";
import type { Habit, HabitForm } from "../forms/HabitForm";

export async function getHabits(): Promise<Habit[]> {
  return apiFetch("/habits");
}

export async function createHabit(form: HabitForm) {
  return apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export async function updateHabit(id: string, form: HabitForm) {
  return apiFetch(`/habits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(form),
  });
}

export async function deleteHabit(id: string) {
  return apiFetch(`/habits/${id}`, {
    method: "DELETE",
  });
}
