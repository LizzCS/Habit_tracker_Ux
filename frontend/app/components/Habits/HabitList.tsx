"use client";

import * as React from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import type { Habit } from "../../habits/types";

type HabitListProps = {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitList({
  habits,
  onEdit,
  onDelete,
}: HabitListProps) {
  const [sortBy, setSortBy] = React.useState("priority");

  const priorityOrder = {
    alta: 1,
    media: 2,
    baja: 3,
  };

  const sortedHabits = [...habits].sort((a, b) => {
    if (sortBy === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* SORT */}
      <FormControl size="small" sx={{ width: 200 }}>
        <InputLabel id="sort-label">Ordenar por</InputLabel>

        <Select
          labelId="sort-label"
          value={sortBy}
          label="Ordenar por"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <MenuItem value="priority">Prioridad</MenuItem>
          <MenuItem value="name">Nombre</MenuItem>
          <MenuItem value="none">Sin ordenar</MenuItem>
        </Select>
      </FormControl>

      {/* HABITS */}
      {sortedHabits.map((habit) => (
        <Card
          key={habit._id}
          sx={{
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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
            <Checkbox
              sx={{
                color: "#1B8585",
                "&.Mui-checked": {
                  color: "#1B8585",
                },
              }}
            />

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1f2937",
                }}
              >
                {habit.name}
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

              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  flexWrap: "wrap",
                  mt: 1,
                }}
              >
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
                  }}
                />

                {habit.category && (
                  <Chip
                    label={habit.category}
                    size="small"
                    sx={{
                      fontSize: "11px",
                    }}
                  />
                )}
              </Box>
            </Box>

            <IconButton
              onClick={() => onEdit(habit)}
              sx={{
                color: "#6b7280",
              }}
            >
              <Edit fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => onDelete(habit._id)}
              sx={{
                color: "#ef4444",
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
