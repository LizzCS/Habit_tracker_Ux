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

import { apiFetch } from "../../lib/API";

export type Habit = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  frequency: "diaria" | "semanal" | "anual";
  priority: "baja" | "media" | "alta";
  startDate?: string;
  endDate?: string;
  active: boolean;
  userId: string;
};

export type HabitRecord = {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
};

export default function Dashboard() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Comprueba si un record pertenece al día de hoy.
   */
  const isToday = (date: string) => {
    const recordDate = new Date(date);
    const today = new Date();

    return (
      recordDate.getFullYear() === today.getFullYear() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getDate() === today.getDate()
    );
  };

  /*
   * Cargar hábitos.
   */
  const loadHabits = async () => {
    const data = await apiFetch("/habits");
    setHabits(data);
  };

  /*
   * Cargar records.
   */
  const loadRecords = async () => {
    const data = await apiFetch("/records");
    setRecords(data);
  };

  /*
   * Cargar todo el dashboard.
   */
  const loadDashboard = async () => {
    try {
      setError("");

      await Promise.all([loadHabits(), loadRecords()]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los datos del dashboard");
      }
    }
  };

  /*
   * Comprobar autenticación y cargar datos.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const initializeDashboard = async () => {
      try {
        setLoading(true);
        await loadDashboard();
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  /*
   * Solo hábitos activos.
   */
  const activeHabits = useMemo(
    () => habits.filter((habit) => habit.active),
    [habits],
  );

  /*
   * Records completados HOY.
   */
  const completedTodayRecords = useMemo(
    () => records.filter((record) => record.completed && isToday(record.date)),
    [records],
  );

  /*
   * IDs de los hábitos completados hoy.
   *
   * Esto se utiliza para que CheckBoxList
   * sepa qué checkboxes deben aparecer marcados.
   */
  const completedHabitIds = useMemo(
    () => completedTodayRecords.map((record) => record.habitId),
    [completedTodayRecords],
  );

  /*
   * Cantidad de hábitos completados hoy.
   */
  const completedToday = completedTodayRecords.length;

  /*
   * Porcentaje de cumplimiento.
   */
  const completionPercentage =
    activeHabits.length > 0
      ? Math.round((completedToday / activeHabits.length) * 100)
      : 0;

  /*
   * Loading inicial.
   */
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
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

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

          <Typography
            sx={{
              color: "#6b7280",
              mt: 0.5,
              fontSize: "14px",
            }}
          >
            Gestiona tus hábitos y revisa tu progreso.
          </Typography>
        </Box>

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* ================================= */}
        {/* SUMMARY */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },

            gap: "16px",
          }}
        >
          {/* ACTIVOS */}

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Hábitos activos
            </Typography>

            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#1B8585",
                mt: 1,
              }}
            >
              {activeHabits.length}
            </Typography>
          </Box>

          {/* TOTAL */}

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Total de hábitos
            </Typography>

            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#1B8585",
                mt: 1,
              }}
            >
              {habits.length}
            </Typography>
          </Box>

          {/* COMPLETADOS */}

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Completados hoy
            </Typography>

            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#1B8585",
                mt: 1,
              }}
            >
              {completedToday}
            </Typography>
          </Box>

          {/* PORCENTAJE */}

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              Cumplimiento
            </Typography>

            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#1B8585",
                mt: 1,
              }}
            >
              {completionPercentage}%
            </Typography>
          </Box>
        </Box>

        {/* ================================= */}
        {/* LISTS */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            },

            gap: "24px",
            width: "100%",
          }}
        >
          {/* HÁBITOS PENDIENTES */}

          <CheckBoxList
            habits={activeHabits}
            completedHabitIds={completedHabitIds}
            onHabitCompleted={loadDashboard}
          />

          {/* HÁBITOS COMPLETADOS */}

          <InteractiveList
            habits={activeHabits}
            records={records}
            onHabitDeleted={loadDashboard}
          />
        </Box>

        {/* ================================= */}
        {/* STREAKS + PERCENTAGE */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },

            gap: "24px",
            alignItems: "center",
          }}
        >
          <StreaksTittle records={records} />
          <TitanicPie percentage={completionPercentage} />
        </Box>

        {/* ================================= */}
        {/* GRAPHS */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },

            gap: "24px",
          }}
        >
          <Charts habits={habits} />

          <Charts habits={habits} />
        </Box>
      </Box>
    </Box>
  );
}
