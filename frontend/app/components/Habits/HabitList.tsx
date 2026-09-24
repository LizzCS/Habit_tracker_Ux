"use client";

import * as React from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Delete, Edit, Check } from "@mui/icons-material";

import { Habit } from "../../../forms/HabitForm";

import { RecordForm } from "../../../forms/RecordForm";

import { updateRecord } from "../../../services/records.services";

type HabitListProps = {
  habits: Habit[];
  records: RecordForm[];
  selectedDate: Date;

  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, amount: number, date: Date) => Promise<RecordForm>;
};

export default function HabitList({
  habits,
  records,
  selectedDate,
  onEdit,
  onDelete,
  onComplete,
}: HabitListProps) {
  // Prioridad que se muestra primero: "alta" | "media" | "baja"
  const [sortBy, setSortBy] = React.useState("alta");
  const [amounts, setAmounts] = React.useState<Record<string, number>>({});

  const priorityOrder: Record<string, number> = {
    alta: 1,
    media: 2,
    baja: 3,
  };

  // Colores por prioridad: alta → rojo, media → amarillo, baja → verde
  const priorityColors: Record<string, { bg: string; color: string }> = {
    alta: { bg: "#fee2e2", color: "#b91c1c" }, // rojo
    media: { bg: "#fef9c3", color: "#a16207" }, // amarillo
    baja: { bg: "#dcfce7", color: "#15803d" }, // verde
  };

  // Diario
  const getStartOfPeriod = (frequency: string) => {
    const date = new Date(selectedDate);

    // Diario
    if (frequency === "diaria") {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    // Semanal → lunes
    if (frequency === "semanal") {
      const day = date.getDay();
      const diff = day === 0 ? 6 : day - 1;

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - diff,
      );
    }

    // Mensual → primer día
    if (frequency === "mensual") {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getProgress = (habit: Habit) => {
    const startOfPeriod = getStartOfPeriod(habit.frequency);

    return records
      .filter((record) => {
        if (record.habitId !== habit._id) {
          return false;
        }

        const recordDate = new Date(record.date);

        return recordDate >= startOfPeriod;
      })
      .reduce((total, record) => {
        return total + (record.amount ?? 0);
      }, 0);
  };

  // La prioridad elegida va primero; el resto sigue el orden alta → media → baja
  const getRank = (priority: string) =>
    priority === sortBy ? 0 : priorityOrder[priority];

  const sortedHabits = [...habits].sort(
    (a, b) => getRank(a.priority) - getRank(b.priority),
  );

  const handleAmountChange = (habitId: string, value: string) => {
    const number = Number(value);

    setAmounts((prev) => ({
      ...prev,
      [habitId]: Number.isNaN(number) ? 0 : number,
    }));
  };

  const handleComplete = async (habit: Habit, progress: number) => {
    const amount = amounts[habit._id] ?? 0;
    const remaining = habit.repeticiones - progress;

    if (amount <= 0 || amount > remaining) {
      return;
    }

    try {
      // Add the repetitions for the selected calendar date
      const record = await onComplete(habit._id, amount, selectedDate);

      const newProgress = progress + amount;

      if (newProgress >= habit.repeticiones) {
        console.log("Habit completed. Updating record:", record._id);

        await updateRecord(record._id, {
          completed: true,
        });

        console.log("Record marked as completed");
      }

      setAmounts((prev) => ({
        ...prev,
        [habit._id]: 0,
      }));
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Ordenar */}
      <FormControl
        size="small"
        sx={{
          width: 200,
        }}
      >
        <InputLabel id="sort-label">Ordenar por prioridad</InputLabel>

        <Select
          labelId="sort-label"
          value={sortBy}
          label="Ordenar por prioridad"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <MenuItem value="alta">Alta</MenuItem>

          <MenuItem value="media">Media</MenuItem>

          <MenuItem value="baja">Baja</MenuItem>
        </Select>
      </FormControl>

      {sortedHabits.map((habit) => {
        const progress = getProgress(habit);

        const completed = progress >= habit.repeticiones;

        const remaining = Math.max(habit.repeticiones - progress, 0);

        const amount = amounts[habit._id] ?? 0;

        return (
          <Card
            key={habit._id}
            sx={{
              background: completed ? "#32d4755a" : "#ffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                "&:last-child": {
                  pb: 2,
                },
              }}
            >
              {/* Información */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color: completed ? "#0b8a40" : "#1f2937",
                    textDecoration: completed ? "line-through" : "none",
                  }}
                >
                  <strong>{habit.name}</strong>
                </Typography>

                {habit.description && (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#6b7280",
                      mt: 0.3,
                    }}
                  >
                    {habit.description}
                  </Typography>
                )}

                {/* Chips */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.75,
                    flexWrap: "wrap",
                    mt: 1,
                  }}
                >
                  <Chip
                    label={
                      completed
                        ? `${habit.repeticiones} / ${habit.repeticiones} · Completado`
                        : `${progress} / ${habit.repeticiones} · Faltan ${remaining}`
                    }
                    size="small"
                    sx={{
                      fontSize: "11px",
                    }}
                  />

                  <Chip
                    label={habit.frequency}
                    size="small"
                    sx={{
                      fontSize: "11px",
                    }}
                  />

                  <Chip
                    label={habit.priority}
                    size="small"
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundColor: priorityColors[habit.priority]?.bg,
                      color: priorityColors[habit.priority]?.color,
                    }}
                  />
                </Box>
              </Box>

              {/* Cantidad + Check */}
              {!completed && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <TextField
                    type="number"
                    size="small"
                    value={amount || ""}
                    onChange={(e) =>
                      handleAmountChange(habit._id, e.target.value)
                    }
                    placeholder="0"
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: remaining,
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textDecoration: completed ? "line-through" : "none",
                      },
                    }}
                  />

                  <IconButton
                    onClick={() => handleComplete(habit, progress)}
                    disabled={amount <= 0 || amount > remaining}
                    sx={{
                      color: "#1B8585",
                    }}
                  >
                    <Check />
                  </IconButton>
                </Box>
              )}

              {/* Editar */}
              <IconButton
                onClick={() => onEdit(habit)}
                sx={{
                  color: "#6b7280",
                  textDecoration: completed ? "line-through" : "none",
                  opacity: completed ? 0.7 : 1,
                }}
              >
                <Edit fontSize="small" />
              </IconButton>

              {/* Eliminar */}
              <IconButton
                onClick={() => onDelete(habit._id)}
                sx={{
                  color: "#ef4444",
                  textDecoration: completed ? "line-through" : "none",
                  opacity: completed ? 0.7 : 1,
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
