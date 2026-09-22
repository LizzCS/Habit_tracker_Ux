"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

import { Check } from "@mui/icons-material";

import type { Habit } from "../../../forms/HabitForm";
import type { RecordForm } from "../../../forms/RecordForm";
import { updateRecord } from "../../../services/records.services";

type CheckboxListProps = {
  habits: Habit[];
  records: RecordForm[];
  selectedDate: Date;
  onRefresh?: () => Promise<void>;

  onComplete: (id: string, amount: number, date: Date) => Promise<RecordForm>;
};

/* =========================
   FECHA LOCAL
========================= */

const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateString = (value: string | Date) => {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return getLocalDateString(value);
};

/* =========================
   SEMANA
========================= */

const getWeekStart = (date: Date) => {
  const result = new Date(date);

  const day = result.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
};

const getWeekKey = (date: string | Date) => {
  const d = new Date(date);
  const weekStart = getWeekStart(d);

  return getLocalDateString(weekStart);
};

/* =========================
   DISPONIBILIDAD DEL HÁBITO
========================= */

const isAvailableToday = (habit: Habit) => {
  if (!habit.active) {
    return false;
  }

  const today = getLocalDateString();

  const startDate = getDateString(habit.startDate);

  if (today < startDate) {
    return false;
  }

  if (habit.endDate) {
    const endDate = getDateString(habit.endDate);

    if (today > endDate) {
      return false;
    }
  }

  return true;
};

/* =========================
   FILA DE HÁBITO
========================= */

type HabitRowProps = {
  habit: Habit;
  progress: number;
  amount: number;
  saving: boolean;
  selectedDate: Date;
  onAmountChange: (habitId: string, value: string) => void;
  onComplete: (habit: Habit, progress: number, amount: number) => void;
};

function HabitRow({
  habit,
  progress,
  amount,
  saving,
  onAmountChange,
  onComplete,
}: HabitRowProps) {
  const remaining = habit.repeticiones - progress;
  const progressPercentage = Math.min(
    (progress / habit.repeticiones) * 100,
    100,
  );
  const canConfirm = amount > 0 && amount <= remaining && !saving;

  return (
    <ListItem
      disablePadding
      sx={{
        display: "block",
        px: 1.5,
        py: 1.25,
        borderBottom: "1px solid #f0f2f4",
        "&:last-of-type": { borderBottom: "none" },
      }}
    >
      {/* Título + frecuencia */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontSize: "13.5px",
            fontWeight: 600,
            color: "#1f2937",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {habit.name}
        </Typography>

        <Chip
          label={habit.frequency}
          size="small"
          sx={{
            height: "18px",
            fontSize: "9.5px",
            fontWeight: 600,
            textTransform: "capitalize",
            color: "#1B8585",
            backgroundColor: "#e6f7f7",
            flexShrink: 0,
            "& .MuiChip-label": { px: 0.9 },
          }}
        />
      </Box>

      {/* Progreso + controles */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            flex: 1,
            height: 6,
            borderRadius: 5,
            backgroundColor: "#eef0f2",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#1B8585",
              borderRadius: 5,
            },
          }}
        />

        <Typography
          sx={{
            fontSize: "10.5px",
            fontWeight: 700,
            color: "#1B8585",
            whiteSpace: "nowrap",
            minWidth: "34px",
            textAlign: "right",
          }}
        >
          {progress}/{habit.repeticiones}
        </Typography>
      </Box>

      {/* Cantidad + Check */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.75,
          mt: 0.75,
        }}
      >
        <TextField
          type="number"
          size="small"
          value={amount || ""}
          disabled={saving}
          onChange={(e) => onAmountChange(habit._id, e.target.value)}
          placeholder="0"
          slotProps={{
            htmlInput: {
              min: 1,
              max: remaining,
              style: { textAlign: "center", padding: "5px 6px" },
            },
          }}
          sx={{
            width: "56px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "12px",
              backgroundColor: "#fafafa",
            },
          }}
        />

        <IconButton
          size="small"
          onClick={() => onComplete(habit, progress, amount)}
          disabled={!canConfirm}
          sx={{
            color: "#ffffff",
            backgroundColor: canConfirm ? "#1B8585" : "#d1d5db",
            width: 30,
            height: 30,
            "&:hover": {
              backgroundColor: canConfirm ? "#166f6f" : "#d1d5db",
            },
          }}
        >
          {saving ? (
            <CircularProgress size={14} sx={{ color: "#ffffff" }} />
          ) : (
            <Check sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>
    </ListItem>
  );
}

/* =========================
   LISTA PRINCIPAL
========================= */

export default function ActiveList({
  habits,
  records,
  selectedDate,
  onRefresh,
  onComplete,
}: CheckboxListProps) {
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [amounts, setAmounts] = React.useState<Record<string, number>>({});

  const getProgress = (habit: Habit) => {
    const now = new Date();

    const currentDay = getLocalDateString(now);
    const currentWeek = getWeekKey(now);
    const currentMonth = currentDay.slice(0, 7);

    return records
      .filter((record) => record.habitId === habit._id)
      .filter((record) => {
        if (!record.date) {
          return false;
        }

        const recordDay = getDateString(record.date);

        switch (habit.frequency) {
          case "diaria":
            return recordDay === currentDay;

          case "semanal":
            return getWeekKey(record.date) === currentWeek;

          case "mensual":
            return recordDay.slice(0, 7) === currentMonth;

          default:
            return false;
        }
      })
      .reduce((total, record) => total + (record.amount ?? 0), 0);
  };

  const availableHabits = habits.filter(isAvailableToday);

  const pendingHabits = availableHabits.filter((habit) => {
    const progress = getProgress(habit);
    return progress < habit.repeticiones;
  });

  const handleAmountChange = React.useCallback(
    (habitId: string, value: string) => {
      const number = Number(value);

      setAmounts((prev) => ({
        ...prev,
        [habitId]: Number.isNaN(number) ? 0 : number,
      }));
    },
    [],
  );

  const handleComplete = React.useCallback(
    async (habit: Habit, progress: number, amount: number) => {
      const remaining = habit.repeticiones - progress;

      if (amount <= 0 || amount > remaining || savingId) {
        return;
      }

      setSavingId(habit._id);

      try {
        const record = await onComplete(habit._id, amount, selectedDate);

        const newProgress = progress + amount;

        if (newProgress >= habit.repeticiones) {
          await updateRecord(record._id, { completed: true });
        }

        setAmounts((prev) => ({
          ...prev,
          [habit._id]: 0,
        }));

        // Refresh parent data (records/habits) so the list updates
        await onRefresh?.();
      } catch (error) {
        console.error("Error completing habit:", error);
      } finally {
        setSavingId(null);
      }
    },
    [onComplete, onRefresh, selectedDate, savingId],
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "260px",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#e6f7f7",
          py: 1.25,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid #d5eeee",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            color: "#1B8585",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "12.5px",
            fontWeight: 700,
          }}
        >
          {pendingHabits.length}
        </Box>

        <Typography
          sx={{
            fontSize: "14.5px",
            fontWeight: 700,
            color: "#1B8585",
          }}
        >
          Hábitos por completar hoy
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1B8585",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
        }}
      >
        <List sx={{ p: 0 }}>
          {pendingHabits.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "13px",
                py: 4,
              }}
            >
              No tienes hábitos pendientes 🎉
            </Typography>
          ) : (
            pendingHabits.map((habit) => (
              <HabitRow
                key={habit._id}
                habit={habit}
                progress={getProgress(habit)}
                amount={amounts[habit._id] ?? 0}
                saving={savingId === habit._id}
                selectedDate={selectedDate}
                onAmountChange={handleAmountChange}
                onComplete={handleComplete}
              />
            ))
          )}
        </List>
      </Box>
    </Box>
  );
}
