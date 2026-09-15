"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import type { Habit, HabitRecord } from "../../dashboard/types";
import { getHabitStreak } from "../../dashboard/logic";

type Props = {
  habits: Habit[];
  records: HabitRecord[];
};

export default function StreaksTitle({ habits, records }: Props) {
  const dailyStreaks = habits
    .filter((habit) => habit.frequency === "diaria")
    .map((habit) => getHabitStreak(habit, records));

  const weeklyStreaks = habits
    .filter((habit) => habit.frequency === "semanal")
    .map((habit) => getHabitStreak(habit, records));

  const monthlyStreaks = habits
    .filter((habit) => habit.frequency === "mensual")
    .map((habit) => getHabitStreak(habit, records));

  const dailyStreak = Math.max(0, ...dailyStreaks);
  const weeklyStreak = Math.max(0, ...weeklyStreaks);
  const monthlyStreak = Math.max(0, ...monthlyStreaks);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Card
        sx={{
          width: "100%",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#e6f7f7",
            py: 1.5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "#1B8585",
            }}
          >
            Rachas
          </Typography>
        </Box>

        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            py: 3,
          }}
        >
          {/* DIARIA */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Diaria
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                my: 0.5,
              }}
            >
              {dailyStreak}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              días
            </Typography>
          </Box>

          {/* SEMANAL */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Semanal
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                my: 0.5,
              }}
            >
              {weeklyStreak}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              semanas
            </Typography>
          </Box>

          {/* MENSUAL */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Mensual
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                my: 0.5,
              }}
            >
              {monthlyStreak}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              meses
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
