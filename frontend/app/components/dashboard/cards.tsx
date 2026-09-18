"use client";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import {
  getDailyStreak,
  getWeeklyStreak,
  getMonthlyStreak,
} from "../../../services/statistics.services";

type Streak = {
  currentStreak: number;
  bestStreak: number;
};

export default function StreaksTitle() {
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

  const mejorRacha = Math.max(
    daily?.bestStreak ?? 0,
    weekly?.bestStreak ?? 0,
    monthly?.bestStreak ?? 0,
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
