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

export async function loadDashboard() {
  const [habits, records] = await Promise.all([loadHabits(), loadRecords()]);

  return {
    habits,
    records,
  };
}

// =========================
// DATE HELPERS
// =========================

export function isToday(date: string | Date) {
  return isSameDay(new Date(date), new Date());
}

// =========================
// HABIT HELPERS
// =========================

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

// =========================
// DAILY STREAK
// =========================

export function getDailyStreak(records: HabitRecord[]) {
  const completedRecords = records
    .filter((record) => record.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let currentDate = new Date();

  for (const record of completedRecords) {
    if (isSameDay(record.date, currentDate)) {
      streak++;

      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

// =========================
// WEEKLY STREAK
// =========================

export function getWeeklyStreak(records: HabitRecord[], goal: number) {
  const completedRecords = records.filter((record) => record.completed);

  const weeks = new Map<string, number>();

  for (const record of completedRecords) {
    const weekStart = startOfWeek(new Date(record.date), {
      weekStartsOn: 1,
    });

    const key = format(weekStart, "yyyy-MM-dd");

    weeks.set(key, (weeks.get(key) ?? 0) + 1);
  }

  let streak = 0;
  let currentWeek = startOfWeek(new Date(), {
    weekStartsOn: 1,
  });

  while (true) {
    const key = format(currentWeek, "yyyy-MM-dd");

    const completed = weeks.get(key) ?? 0;

    if (completed >= goal) {
      streak++;

      currentWeek = subWeeks(currentWeek, 1);
    } else {
      break;
    }
  }

  return streak;
}

// =========================
// MONTHLY STREAK
// =========================

export function getMonthlyStreak(records: HabitRecord[], goal: number) {
  const completedRecords = records.filter((record) => record.completed);

  const months = new Map<string, number>();

  for (const record of completedRecords) {
    const monthStart = startOfMonth(new Date(record.date));

    const key = format(monthStart, "yyyy-MM");

    months.set(key, (months.get(key) ?? 0) + 1);
  }

  let streak = 0;
  let currentMonth = startOfMonth(new Date());

  while (true) {
    const key = format(currentMonth, "yyyy-MM");

    const completed = months.get(key) ?? 0;

    if (completed >= goal) {
      streak++;

      currentMonth = subMonths(currentMonth, 1);
    } else {
      break;
    }
  }

  return streak;
}

// =========================
// GENERAL STREAK
// =========================

export function getHabitStreak(habit: Habit, records: HabitRecord[]) {
  const habitRecords = records.filter((record) => record.habitId === habit._id);

  switch (habit.frequency) {
    case "diaria":
      return getDailyStreak(habitRecords);

    case "semanal":
      return getWeeklyStreak(habitRecords, habit.repeticiones);

    case "mensual":
      return getMonthlyStreak(habitRecords, habit.repeticiones);

    default:
      return 0;
  }
}
