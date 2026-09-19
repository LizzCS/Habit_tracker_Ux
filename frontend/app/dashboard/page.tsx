"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import Sidebar from "../components/sidebar";
import ActiveList from "../components/dashboard/ActiveList";
import StreaksTittle from "../components/dashboard/cards";
import { Charts } from "../components/dashboard/Graphs";

import { getHabits } from "../../services/habit.services";
import { getRecords } from "../../services/records.services";

import type { Habit } from "../../forms/HabitForm";
import type { RecordForm } from "../../forms/RecordForm";
import CompleteList from "../components/dashboard/CompleteList";

export async function loadDashboard() {
  const [habits, records] = await Promise.all([getHabits(), getRecords()]);

  return {
    habits,
    records,
  };
}

export default function Dashboard() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<RecordForm[]>([]);

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
        setError("No se pudieron cargar los datos dezl dashboard");
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

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
        <StreaksTittle />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: "100%",
          }}
        >
          <ActiveList habits={habits} records={records} />

          <CompleteList habits={habits} records={records} />
        </Box>
        <Charts habits={habits} />
      </Box>
    </Box>
  );
}
