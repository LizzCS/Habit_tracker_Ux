"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import TendenciaCumplimiento from "../components/statistics/TendenciaGrafico";
import Sidebar from "../components/sidebar";
import StreaksTittle from "../components/dashboard/cards";
import ProgresoMensual from "../components/statistics/GraficaMensual";

import { getHabits } from "../../services/habit.services";
import { getRecords } from "../../services/records.services";

import type { Habit } from "../../forms/HabitForm";
import type { RecordForm } from "../../forms/RecordForm";

export default function EvaluacionPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<RecordForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const [habitsData, recordsData] = await Promise.all([
          getHabits(),
          getRecords(),
        ]);

        setHabits(habitsData);
        setRecords(recordsData);
      } catch (error) {
        console.error(error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
          Evaluación
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <StreaksTittle mode="summary" habits={habits} records={records} />

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              xl: "1fr 1fr",
            },
          }}
        >
          <ProgresoMensual />
          <TendenciaCumplimiento />
        </Box>
      </Box>
    </Box>
  );
}
