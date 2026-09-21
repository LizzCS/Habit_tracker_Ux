"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import type { Habit } from "../../../forms/HabitForm";

type RecordForm = {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
  amount?: number;
};

type Props = {
  habits: Habit[];
  records: RecordForm[];
};

export default function CompleteList({ habits, records }: Props) {
  const getStartOfPeriod = (frequency: string) => {
    const today = new Date();

    // Diario
    if (frequency === "diaria") {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    // Semanal → lunes
    if (frequency === "semanal") {
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1;

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - diff,
      );
    }

    // Mensual → primer día del mes
    if (frequency === "mensual") {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const getEndOfPeriod = (frequency: string) => {
    const today = new Date();

    // Diario
    if (frequency === "diaria") {
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      );
    }

    // Semanal → siguiente lunes
    if (frequency === "semanal") {
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1;

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - diff + 7,
      );
    }

    // Mensual → primer día del siguiente mes
    if (frequency === "mensual") {
      return new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }

    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  };

  const getProgress = (habit: Habit) => {
    const startOfPeriod = getStartOfPeriod(habit.frequency);

    const endOfPeriod = getEndOfPeriod(habit.frequency);

    return records
      .filter((record) => {
        if (record.habitId !== habit._id) {
          return false;
        }

        const recordDate = new Date(record.date);

        return recordDate >= startOfPeriod && recordDate < endOfPeriod;
      })
      .reduce((total, record) => {
        return total + (record.amount ?? 0);
      }, 0);
  };

  const completedHabits = habits.filter((habit) => {
    const progress = getProgress(habit);

    return progress >= habit.repeticiones;
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
      {/* HEADER */}
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
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {completedHabits.length}
        </Box>

        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#1B8585",
          }}
        >
          Hábitos completados hoy
        </Typography>
      </Box>

      {/* LIST */}
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
        {completedHabits.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "13px",
              mt: 5,
            }}
          >
            No has completado ningún hábito.
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {completedHabits.map((habit) => {
              const progress = getProgress(habit);

              return (
                <ListItem
                  key={habit._id}
                  sx={{
                    mb: 0.5,
                    borderRadius: "10px",
                  }}
                >
                  {/* CHECK ICON */}
                  <ListItemAvatar
                    sx={{
                      minWidth: "42px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        backgroundColor: "#e0f7f7",
                        color: "#1B8585",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />
                    </Avatar>
                  </ListItemAvatar>

                  {/* HABIT INFO */}
                  <ListItemText
                    primary={habit.name}
                    secondary={`${progress} / ${habit.repeticiones} • ${habit.frequency} • ${habit.priority}`}
                    sx={{
                      minWidth: 0,
                      mr: 3,
                    }}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#374151",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      },

                      secondary: {
                        sx: {
                          color: "#9ca3af",
                          fontSize: "11px",
                        },
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
}
