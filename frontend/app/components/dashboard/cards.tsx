"use client";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

import type { Habit } from "../../../forms/HabitForm";
import type { RecordForm } from "../../../forms/RecordForm";
import CardHeader from "@mui/material/CardHeader";

import { getDailyStreak } from "../../../services/statistics.services";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStreaks() {
      try {
        const [dailyData] = await Promise.all([getDailyStreak()]);

        setDaily(dailyData);
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

  const mejorRacha = Math.max(daily?.bestStreak ?? 0);

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
          borderRadius: "14px",

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
      label: "Racha Actual",
      unit: "días",
      streak: daily?.currentStreak ?? 0,
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
              días
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
export function ProgresoDeHoy({
  habits = [],
  records = [],
}: {
  habits?: Habit[];
  records?: RecordForm[];
}) {
  const now = new Date();

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

  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const difference = day === 0 ? 6 : day - 1;

    result.setDate(result.getDate() - difference);
    result.setHours(0, 0, 0, 0);

    return result;
  };

  const getWeekKey = (date: string | Date) => {
    const d = new Date(date);
    return getLocalDateString(getStartOfWeek(d));
  };

  const today = getLocalDateString();
  const currentWeek = getWeekKey(now);
  const currentMonth = today.slice(0, 7);

  // Progreso del hábito en su período actual
  const getProgress = (habit: Habit) => {
    return records
      .filter((record) => {
        if (record.habitId !== habit._id || !record.date) {
          return false;
        }

        const recordDay = getDateString(record.date);

        switch (habit.frequency) {
          case "diaria":
            return recordDay === today;

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

  // Progreso específicamente de HOY
  const getProgressToday = (habit: Habit) => {
    return records
      .filter((record) => {
        if (record.habitId !== habit._id || !record.date) {
          return false;
        }

        return getDateString(record.date) === today;
      })
      .reduce((total, record) => {
        return total + (record.amount ?? 0);
      }, 0);
  };

  // Hábitos activos y disponibles hoy
  const availableHabits = habits.filter((habit) => {
    if (!habit.active) {
      return false;
    }

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
  });

  // Hábitos completados específicamente HOY
  const completedHabits = availableHabits.filter((habit) => {
    return getProgressToday(habit) >= habit.repeticiones;
  });

  // Hábitos que todavía NO han completado su período
  const pendingHabits = availableHabits.filter((habit) => {
    return getProgress(habit) < habit.repeticiones;
  });

  // Total = completados + no completados
  const totalHabits = completedHabits.length + pendingHabits.length;

  const progress =
    totalHabits > 0 ? (completedHabits.length / totalHabits) * 100 : 0;

  return (
    <Card
      elevation={0}
      sx={{
        boxShadow: "0 4px 18px rgba(20,110,110,0.10)",
        overflow: "hidden",
        borderRadius: "14px",

        height: "100%",
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
          Progreso de Hoy
        </Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Hábitos completados
            </Typography>
            <Typography variant="body2" color="primary.dark">
              {completedHabits.length}/{totalHabits}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: "#e3f5f5",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#1a8a8a",
                borderRadius: 6,
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1,
            }}
          >
            {completedHabits.length} de {totalHabits} hábitos completados ·{" "}
            {Math.round(progress)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
