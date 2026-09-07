import { apiFetch } from "../../lib/API";
import type { Habit, HabitRecord } from "./types";

export async function loadHabits(): Promise<Habit[]> {
  return await apiFetch("/habits");
}

export async function loadRecords(): Promise<HabitRecord[]> {
  return await apiFetch("/records");
}

export async function loadDashboard() {
  const [habits, records] = await Promise.all([loadHabits(), loadRecords()]);

  return {
    habits,
    records,
  };
}

export function isToday(date: string) {
  const recordDate = new Date(date);
  const today = new Date();

  return (
    recordDate.getFullYear() === today.getFullYear() &&
    recordDate.getMonth() === today.getMonth() &&
    recordDate.getDate() === today.getDate()
  );
}

export function getActiveHabits(habits: Habit[]) {
  return habits.filter((habit) => habit.active);
}

export function getCompletedTodayRecords(records: HabitRecord[]) {
  return records.filter((record) => record.completed && isToday(record.date));
}

export function getCompletedHabitIds(records: HabitRecord[]) {
  return records.map((record) => record.habitId);
}

export function getCompletionPercentage(completed: number, active: number) {
  if (active === 0) {
    return 0;
  }

  return Math.round((completed / active) * 100);
}
