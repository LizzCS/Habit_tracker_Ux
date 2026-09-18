import { apiFetch } from "../../lib/API";

import type { Habit } from "../../forms/HabitForm";

import type { RecordForm } from "../../forms/RecordForm";

import { getHabits } from "../../services/habit.services";
import { getRecords } from "../../services/records.services";

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

//API TECNICALLY
export async function completeHabit(
  habitId: string,
  amount: number,
  date: Date,
): Promise<RecordForm> {
  return await apiFetch(`/records/${habitId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      date: date.toISOString(),
    }),
  });
}

export async function loadDashboard() {
  const [habits, records] = await Promise.all([getHabits(), getRecords()]);

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

export function getCompletedTodayRecords(records: RecordForm[]) {
  return records.filter((record) => record.completed && isToday(record.date));
}

export function getCompletedHabitIds(records: RecordForm[]) {
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

export function getDailyStreak(records: RecordForm[]) {
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

export function getWeeklyStreak(records: RecordForm[]) {
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

export function getMonthlyStreak(records: RecordForm[]) {
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

export function getHabitStreak(habit: Habit, records: RecordForm[]) {
  const RecordForms = records.filter((record) => record.habitId === habit._id);

  switch (habit.frequency) {
    case "diaria":
      return getDailyStreak(RecordForms);

    case "semanal":
      return getWeeklyStreak(RecordForms);

    case "mensual":
      return getMonthlyStreak(RecordForms);

    default:
      return 0;
  }
}
