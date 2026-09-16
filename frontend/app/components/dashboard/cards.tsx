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
  const streakTypes = [
    {
      frequency: "diaria",
      label: "Diaria",
      unit: "días",
    },
    {
      frequency: "semanal",
      label: "Semanal",
      unit: "semanas",
    },
    {
      frequency: "mensual",
      label: "Mensual",
      unit: "meses",
    },
  ] as const;

  const streaks = streakTypes.map((type) => {
    const streaks = habits
      .filter((habit) => habit.frequency === type.frequency)
      .map((habit) => getHabitStreak(habit, records));

    return {
      ...type,
      streak: Math.max(0, ...streaks),
    };
  });

  // Mejor racha entre todos los hábitos
  const mejorRacha = Math.max(
    0,
    ...habits.map((habit) => getHabitStreak(habit, records)),
  );

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
            Rachas{" "}
          </Typography>{" "}
        </Box>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            py: 3,
          }}
        >
          {streaks.map((item) => (
            <Box
              key={item.frequency}
              sx={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  my: 0.5,
                }}
              >
                {item.streak}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.unit}
              </Typography>
            </Box>
          ))}

          {/* Mejor racha */}
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mejor racha
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                my: 0.5,
              }}
            >
              {mejorRacha}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              períodos
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
