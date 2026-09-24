"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { Habit, HabitForm } from "../../forms/HabitForm";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "../../services/habit.services";
import { formatDateForInput, isSameDay } from "./utils";

const emptyForm: HabitForm = {
  name: "",
  description: "",
  category: "",
  frequency: "diaria",
  priority: "media",
  repeticiones: 1,
  startDate: "",
  endDate: "",
  active: true,
};

export function useHabits() {
  const router = useRouter();

  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [openDialog, setOpenDialog] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<HabitForm>(emptyForm);
  const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null);

  const loadHabits = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los hábitos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadHabits();
  }, [router, loadHabits]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const isSelected = (day: number) => {
    const date = new Date(year, month, day);
    return isSameDay(date, selectedDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(year, month, day);

    return isSameDay(date, today);
  };

  const selectDay = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const selectedHabits = React.useMemo(() => {
    return habits.filter((habit) => {
      if (!habit.active) {
        return false;
      }

      if (!habit.startDate) {
        return true;
      }

      const startDate = new Date(habit.startDate);
      const selected = new Date(selectedDate);

      startDate.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);

      if (selected < startDate) {
        return false;
      }

      if (habit.endDate) {
        const endDate = new Date(habit.endDate);
        endDate.setHours(0, 0, 0, 0);

        if (selected > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [habits, selectedDate]);

  const handleChange = (field: keyof HabitForm, value: string | boolean) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleOpenCreate = () => {
    setEditingHabit(null);
    setForm({
      ...emptyForm,
      startDate: formatDateForInput(selectedDate),
    });
    setError("");
    setOpenDialog(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);

    setForm({
      name: habit.name,
      description: habit.description || "",
      category: habit.category || "",
      frequency: habit.frequency,
      priority: habit.priority,
      startDate: habit.startDate
        ? formatDateForInput(new Date(habit.startDate))
        : "",
      endDate: habit.endDate ? formatDateForInput(new Date(habit.endDate)) : "",
      repeticiones: habit.repeticiones,
      active: habit.active,
    });

    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setOpenDialog(false);
    setEditingHabit(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("El nombre del hábito es obligatorio");
      return;
    }

    console.log("FORM BEFORE SAVE:", form);

    try {
      setSaving(true);
      setError("");

      if (editingHabit) {
        await updateHabit(editingHabit._id, form);
      } else {
        await createHabit(form);
      }

      setOpenDialog(false);
      setEditingHabit(null);
      setForm(emptyForm);

      await loadHabits();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingHabit
            ? "No se pudo actualizar el hábito"
            : "No se pudo crear el hábito",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("¿Quieres eliminar este hábito?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteHabit(id);
      await loadHabits();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el hábito",
      );
    }
  };

  const monthName = currentMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const selectedDateText = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return {
    habits,
    selectedDate,
    currentMonth,
    selectedHabits,

    loading,
    error,
    openDialog,
    saving,
    form,
    editingHabit,

    year,
    month,
    monthName,
    selectedDateText,

    setSelectedDate,
    setCurrentMonth,
    setError,

    isSelected,
    isToday,
    selectDay,
    previousMonth,
    nextMonth,

    handleChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSave,
    handleDelete,

    loadHabits,
  };
}
