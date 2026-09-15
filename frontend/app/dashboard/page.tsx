"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import Sidebar from "../components/sidebar";
import InteractiveList from "../components/dashboard/completeList";
import CheckBoxList from "../components/dashboard/dashboardList";
import StreaksTittle from "../components/dashboard/cards";
import { Charts } from "../components/dashboard/Graphs";
import TitanicPie from "../components/dashboard/porcentageChart";

import {
  loadDashboard,
  getActiveHabits,
  getCompletedTodayRecords,
  getCompletedHabitIds,
  getCompletionPercentage,
} from "./logic";

import type { Habit, HabitRecord } from "./types";

export default function Dashboard() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshDashboard = async () => {
    try {
      setError("");

      const data = await loadDashboard();

      setHabits(data.habits);
      setRecords(data.records);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los datos del dashboard");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const initializeDashboard = async () => {
      try {
        setLoading(true);
        await refreshDashboard();
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  const activeHabits = useMemo(() => getActiveHabits(habits), [habits]);

  const completedTodayRecords = useMemo(
    () => getCompletedTodayRecords(records),
    [records],
  );

  const completedHabitIds = useMemo(
    () => getCompletedHabitIds(completedTodayRecords),
    [completedTodayRecords],
  );

  const completedToday = completedTodayRecords.length;

  const completionPercentage = getCompletionPercentage(
    completedToday,
    activeHabits.length,
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#f9fafb",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          marginLeft: {
            xs: 0,
            md: "240px",
          },
          width: {
            xs: "100%",
            md: "calc(100% - 240px)",
          },
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: {
            xs: "70px 16px 20px",
            sm: "70px 24px 24px",
            md: "40px",
          },
          display: "flex",
          flexDirection: "column",
          gap: {
            xs: "20px",
            md: "28px",
          },
        }}
      >
        {/* HEADER */}

        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              fontSize: {
                xs: "26px",
                sm: "30px",
                md: "34px",
              },
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* ERROR */}

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* STREAKS */}
        <StreaksTittle habits={habits} records={records} />

        <Charts habits={habits} />
      </Box>
    </Box>
  );
}
