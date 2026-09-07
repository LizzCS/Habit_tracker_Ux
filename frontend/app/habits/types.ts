export type Habit = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  frequency: "diaria" | "semanal" | "anual";
  priority: "baja" | "media" | "alta";
  startDate?: string;
  endDate?: string;
  active: boolean;
  userId: string;
};

export type HabitForm = {
  name: string;
  description: string;
  category: string;
  frequency: "diaria" | "semanal" | "anual";
  priority: "baja" | "media" | "alta";
  startDate: string;
  endDate: string;
  active: boolean;
};
