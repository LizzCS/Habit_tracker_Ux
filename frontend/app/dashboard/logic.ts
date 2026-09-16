import { apiFetch } from "../../lib/API";

import type { Habit, HabitRecord } from "./types";

import {
  isSameDay,
  startOfWeek,
  startOfMonth,
  subDays,
  subWeeks,
  subMonths,
  format,
} from "date-fns";

// =========================
// API
// =========================

export async function loadHabits(): Promise<Habit[]> {
  return await apiFetch("/habits");
}

export async function loadRecords(): Promise<HabitRecord[]> {
  return await apiFetch("/records");
}
export async function completeHabit(
  habitId: string,
  amount: number,
): Promise<HabitRecord> {
  return await apiFetch(`/records/${habitId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function loadDashboard() {
  const [habits, records] = await Promise.all([loadHabits(), loadRecords()]);

  return {
    habits,
    records,
  };
}

export function isToday(date: string | Date) {
  return isSameDay(new Date(date), new Date());
}

export function getActiveHabits(habits: Habit[]) {
  return habits.filter((habit) => habit.active);
}

export function getCompletedTodayRecords(records: HabitRecord[]) {
  return records.filter((record) => record.completed && isToday(record.date));
}

export function getCompletedHabitIds(records: HabitRecord[]) {
  return records
    .filter((record) => record.completed)
    .map((record) => record.habitId);
}

export function getCompletionPercentage(completed: number, active: number) {
  if (active === 0) {
    return 0;
  }

  return Math.round((completed / active) * 100);
}

export function getDailyStreak(records: HabitRecord[]) {
  const completedDates = new Set(
    records
      .filter((record) => record.completed)
      .map((record) => format(new Date(record.date), "yyyy-MM-dd")),
  );

  let streak = 0;
  let currentDate = new Date();

  while (completedDates.has(format(currentDate, "yyyy-MM-dd"))) {
    streak++;
    currentDate = subDays(currentDate, 1);
  }

  return streak;
}

export function getWeeklyStreak(records: HabitRecord[]) {
  const completedWeeks = new Set(
    records
      .filter((record) => record.completed)
      .map((record) => {
        const weekStart = startOfWeek(new Date(record.date), {
          weekStartsOn: 1,
        });

        return format(weekStart, "yyyy-MM-dd");
      }),
  );

  let streak = 0;
  let currentWeek = startOfWeek(new Date(), {
    weekStartsOn: 1,
  });

  while (completedWeeks.has(format(currentWeek, "yyyy-MM-dd"))) {
    streak++;
    currentWeek = subWeeks(currentWeek, 1);
  }

  return streak;
}

export function getMonthlyStreak(records: HabitRecord[]) {
  const completedMonths = new Set(
    records
      .filter((record) => record.completed)
      .map((record) => {
        const monthStart = startOfMonth(new Date(record.date));

        return format(monthStart, "yyyy-MM");
      }),
  );

  let streak = 0;
  let currentMonth = startOfMonth(new Date());

  while (completedMonths.has(format(currentMonth, "yyyy-MM"))) {
    streak++;
    currentMonth = subMonths(currentMonth, 1);
  }

  return streak;
}

export function getHabitStreak(habit: Habit, records: HabitRecord[]) {
  const habitRecords = records.filter((record) => record.habitId === habit._id);

  switch (habit.frequency) {
    case "diaria":
      return getDailyStreak(habitRecords);

    case "semanal":
      return getWeeklyStreak(habitRecords);

    case "mensual":
      return getMonthlyStreak(habitRecords);

    default:
      return 0;
  }
}
