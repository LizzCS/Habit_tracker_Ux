"use client";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import type { Habit } from "../../../forms/HabitForm";
import type { RecordForm } from "../../../forms/RecordForm";

import {
  getDailyStreak,
  getWeeklyStreak,
  getMonthlyStreak,
} from "../../../services/statistics.services";

type Streak = {
  currentStreak: number;
  bestStreak: number;
};

type Props = {
  mode?: "streaks" | "summary";
  habits?: Habit[];
  records?: RecordForm[];
};

export default function StreaksTitle({
  mode = "streaks",
  habits = [],
  records = [],
}: Props) {
  const [daily, setDaily] = useState<Streak | null>(null);
  const [weekly, setWeekly] = useState<Streak | null>(null);
  const [monthly, setMonthly] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStreaks() {
      try {
        const [dailyData, weeklyData, monthlyData] = await Promise.all([
          getDailyStreak(),
          getWeeklyStreak(),
          getMonthlyStreak(),
        ]);

        setDaily(dailyData);
        setWeekly(weeklyData);
        setMonthly(monthlyData);
      } catch (error) {
        console.error("Error loading streaks:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStreaks();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const mejorRacha = Math.max(
    daily?.bestStreak ?? 0,
    weekly?.bestStreak ?? 0,
    monthly?.bestStreak ?? 0,
  );

  if (mode === "summary") {
    const getProgress = (habit: Habit) => {
      return records
        .filter((record) => record.habitId === habit._id)
        .reduce((total, record) => total + (record.amount ?? 0), 0);
    };

    const totalHabits = habits.length;

    const activeHabits = habits.filter((habit) => {
      if (!habit.active) return false;

      const progress = getProgress(habit);

      return progress < habit.repeticiones;
    }).length;

    const finishedHabits = habits.filter((habit) =>
      records.some(
        (record) => record.habitId === habit._id && record.completed === true,
      ),
    ).length;

    const summaryItems = [
      {
        label: "Total de hábitos",
        value: totalHabits,
        unit: "hábitos",
      },
      {
        label: "Hábitos activos",
        value: activeHabits,
        unit: "activos",
      },
      {
        label: "Racha",
        value: daily?.currentStreak ?? 0,
        unit: daily?.currentStreak === 1 ? "día" : "días",
      },
      {
        label: "Hábitos finalizados",
        value: finishedHabits,
        unit: "finalizados",
      },
    ];

    return (
      <Card
        elevation={0}
        sx={{
          boxShadow: "0 4px 18px rgba(20,110,110,0.10)",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#e3f5f5",
            textAlign: "center",
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#146e6e",
              fontWeight: 600,
            }}
          >
            Resumen
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              m: -3,
            }}
          >
            {summaryItems.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  py: 4,
                  textAlign: "center",
                  borderLeft: {
                    xs: index % 2 ? 1 : 0,
                    lg: index ? 1 : 0,
                  },
                  borderTop: {
                    xs: index >= 2 ? 1 : 0,
                    lg: 0,
                  },
                  borderColor: "#c5e6e6",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  {item.label}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "#111827",
                    my: 0.5,
                  }}
                >
                  {item.value}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "text.secondary",
                  }}
                >
                  {item.unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  const streaks = [
    {
      label: "Diaria",
      unit: "días",
      streak: daily?.currentStreak ?? 0,
    },
    {
      label: "Semanal",
      unit: "semanas",
      streak: weekly?.currentStreak ?? 0,
    },
    {
      label: "Mensual",
      unit: "meses",
      streak: monthly?.currentStreak ?? 0,
    },
  ];

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
          {streaks.map((item) => (
            <Box
              key={item.label}
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
