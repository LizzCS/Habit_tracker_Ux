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
import { ProgresoDeHoy } from "../components/dashboard/cards";
import { apiFetch } from "../../lib/API";

export async function loadDashboard() {
  const [habits, records] = await Promise.all([getHabits(), getRecords()]);

  return {
    habits,
    records,
  };
}

const completeHabit = async (
  habitId: string,
  amount: number,
  date: Date,
): Promise<RecordForm> => {
  const response = await apiFetch(`/records/${habitId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      amount,
      date,
    }),
  });

  return response;
};

export default function Dashboard() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<RecordForm[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = async () => {
    try {
      setError("");

      const data = await loadDashboard();

      setHabits(data.habits);
      setRecords(data.records);
      setRefreshKey((key) => key + 1);
    } catch (err) {}
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
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StreaksTittle refreshKey={refreshKey} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ProgresoDeHoy habits={habits} records={records} />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            width: "100%",
            mt: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ActiveList
              habits={habits}
              records={records}
              selectedDate={new Date()}
              onRefresh={refreshDashboard}
              onComplete={completeHabit}
            />{" "}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CompleteList habits={habits} records={records} />
          </Box>
        </Box>

        {/* CHARTS */}
        <Box sx={{ mt: 2 }}>
          <Charts habits={habits} refreshKey={refreshKey} />{" "}
        </Box>
      </Box>
    </Box>
  );
}
