"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import { Check } from "@mui/icons-material";

import { apiFetch } from "../../../lib/API";

import type { Habit } from "../../../forms/HabitForm";
import type { RecordForm } from "../../../forms/RecordForm";
import { updateRecord } from "../../../services/records.services";

type CheckboxListProps = {
  habits: Habit[];
  records: RecordForm[];
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

export default function ActiveList({ habits, records }: CheckboxListProps) {
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
      .reduce((total, record) => {
        return total + (record.amount ?? 0);
      }, 0);
  };

  /* =========================
     HÁBITOS DISPONIBLES HOY
  ========================= */

  const availableHabits = habits.filter(isAvailableToday);

  /* =========================
     HÁBITOS PENDIENTES
  ========================= */

  const pendingHabits = availableHabits.filter((habit) => {
    const progress = getProgress(habit);

    return progress < habit.repeticiones;
  });

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
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            color: "#1B8585",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {pendingHabits.length}
        </Box>

        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#1B8585",
          }}
        >
          Hábitos por completar hoy
        </Typography>
      </Box>

      <Box
        sx={{
          height: "calc(100% - 52px)",
          overflowY: "auto",
          px: 1.5,
          py: 1,
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1B8585",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <List sx={{ p: 0 }}>
          {pendingHabits.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "13px",
                py: 3,
              }}
            >
              No tienes hábitos pendientes
            </Typography>
          ) : (
            pendingHabits.map((habit) => {
              const progress = getProgress(habit);

              const remaining = Math.max(habit.repeticiones - progress, 0);

              const progressPercentage = Math.min(
                (progress / habit.repeticiones) * 100,
                100,
              );

              const amount = amounts[habit._id] ?? 0;

              const saving = savingId === habit._id;

              return (
                <ListItem key={habit._id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    sx={{
                      borderRadius: "10px",
                      px: 1,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#f0fafa",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#374151",
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {habit.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "10px",
                          color: "#6b7280",
                          mb: 0.5,
                          textTransform: "capitalize",
                        }}
                      >
                        {habit.frequency}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          sx={{
                            flex: 1,
                            height: 5,
                            borderRadius: 5,
                            backgroundColor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#1B8585",
                              borderRadius: 5,
                            },
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#1B8585",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {saving
                            ? "..."
                            : `${progress} / ${habit.repeticiones}`}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}
