export type Habit = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  frequency: "diaria" | "semanal" | "mensual";
  priority: "baja" | "media" | "alta";
  repeticiones: number;
  startDate: string;
  endDate?: string;
  active: boolean;
  userId: string;
};

export type HabitForm = {
  name: string;
  description: string;
  category: string;
  frequency: "diaria" | "semanal" | "mensual";
  priority: "baja" | "media" | "alta";
  repeticiones: number;
  startDate: string;
  endDate: string;
  active: boolean;
};
