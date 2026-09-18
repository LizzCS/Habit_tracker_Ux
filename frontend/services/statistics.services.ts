import { apiFetch } from "../lib/API";

export async function getDailyCompletion() {
  return apiFetch("/statistics/daily-completion");
}

export async function getWeeklyCompletion() {
  return apiFetch("/statistics/weekly-completion");
}

export async function getMonthlyCompletion() {
  return apiFetch("/statistics/monthly-completion");
}

export async function getDailyStreak() {
  return apiFetch("/statistics/daily-streak");
}

export async function getWeeklyStreak() {
  return apiFetch("/statistics/weekly-streak");
}

export async function getMonthlyStreak() {
  return apiFetch("/statistics/monthly-streak");
}
