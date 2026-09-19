"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import { apiFetch } from "../../../lib/API";

import type { Habit } from "../../../forms/HabitForm";
import type { RecordForm } from "../../../forms/RecordForm";

type CheckboxListProps = {
  habits: Habit[];
  records: RecordForm[];
};

export default function ActiveList({ habits, records }: CheckboxListProps) {
  const [savingId, setSavingId] = React.useState<string | null>(null);

  const getProgress = (habit: Habit) => {
    return records
      .filter((record) => record.habitId === habit._id)
      .reduce((total, record) => {
        return total + (record.amount ?? 0);
      }, 0);
  };

  const activeHabits = habits.filter((habit) => habit.active);

  const pendingHabits = activeHabits.filter((habit) => {
    const progress = getProgress(habit);

    return progress < habit.repeticiones;
  });

  const handleToggle = async (habit: Habit) => {
    const progress = getProgress(habit);

    if (progress >= habit.repeticiones) {
      return;
    }

    try {
      setSavingId(habit._id);

      await apiFetch(`/records/${habit._id}/complete`, {
        method: "POST",

        body: JSON.stringify({
          amount: habit.repeticiones - progress,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("No se pudo completar el hábito:", error);
    } finally {
      setSavingId(null);
    }
  };

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
          Hábitos por completar
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

              const progressPercentage = Math.min(
                (progress / habit.repeticiones) * 100,
                100,
              );

              const saving = savingId === habit._id;

              return (
                <ListItem key={habit._id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleToggle(habit)}
                    disabled={saving}
                    sx={{
                      borderRadius: "10px",
                      px: 1,
                      py: 1,

                      "&:hover": {
                        backgroundColor: "#f0fafa",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "32px",
                      }}
                    >
                      <Checkbox
                        edge="start"
                        checked={false}
                        tabIndex={-1}
                        disableRipple
                        size="small"
                        sx={{
                          p: 0.5,
                          color: "#1B8585",

                          "&.Mui-checked": {
                            color: "#1B8585",
                          },
                        }}
                      />
                    </ListItemIcon>

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
