"use client";

import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

import type { Habit } from "../../../forms/HabitForm";
import { getRecords } from "../../../services/records.services";

type Record = {
  _id: string;
  habitId: string;
  date: string;
  completed: boolean;
};

type Props = {
  habits: Habit[];
};

export function Charts({ habits }: Props) {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    async function loadRecords() {
      try {
        const data = await getRecords();
        setRecords(data);
      } catch (error) {
        console.error("No se pudieron cargar los registros:", error);
      }
    }

    loadRecords();
  }, []);

  const today = useMemo(() => new Date(), []);

  /*
   * =========================
   * GRÁFICO SEMANAL
   * =========================
   *
   * Cuenta HÁBITOS, no registros.
   *
   * Si el mismo hábito tiene 3 records
   * completados el mismo día, cuenta como 1.
   */

  const weeklyData = useMemo(() => {
    const currentDay = today.getDay();

    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);

    monday.setDate(today.getDate() + mondayOffset);

    monday.setHours(0, 0, 0, 0);

    const days = [
      { name: "Lun", offset: 0 },
      { name: "Mar", offset: 1 },
      { name: "Mié", offset: 2 },
      { name: "Jue", offset: 3 },
      { name: "Vie", offset: 4 },
      { name: "Sáb", offset: 5 },
      { name: "Dom", offset: 6 },
    ];

    return days.map((day) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + day.offset);

      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      /*
       * Set evita contar el mismo hábito
       * más de una vez.
       */
      const completedHabitIds = new Set(
        records
          .filter((record) => {
            if (!record.completed) {
              return false;
            }

            return record.date.slice(0, 10) === dateString;
          })
          .map((record) => record.habitId),
      );

      return {
        day: day.name,
        completed: completedHabitIds.size,
      };
    });
  }, [records, today]);

  /*
   * =========================
   * GRÁFICO MENSUAL
   * =========================
   *
   * Cuenta HÁBITOS por mes.
   *
   * Un mismo hábito solo cuenta una vez
   * dentro de cada mes.
   */

  const monthlyData = useMemo(() => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const currentYear = today.getFullYear();

    return months.map((month, index) => {
      const completedHabitIds = new Set(
        records
          .filter((record) => {
            if (!record.completed) {
              return false;
            }

            const recordDate = new Date(record.date);

            return (
              recordDate.getFullYear() === currentYear &&
              recordDate.getMonth() === index
            );
          })
          .map((record) => record.habitId),
      );

      return {
        month,
        completed: completedHabitIds.size,
      };
    });
  }, [records, today]);

  const weeklyXAxis = useMemo(
    () => [
      {
        dataKey: "day",
        scaleType: "band" as const,
      },
    ],
    [],
  );

  const monthlyXAxis = useMemo(
    () => [
      {
        dataKey: "month",
        scaleType: "band" as const,
        tickLabelInterval: () => true,
      },
    ],
    [],
  );

  const weeklySeries = useMemo(
    () => [
      {
        dataKey: "completed",
        label: "Hábitos completados",
        color: "#1B8585",
      },
    ],
    [],
  );

  const monthlySeries = useMemo(
    () => [
      {
        dataKey: "completed",
        label: "Hábitos completados",
        color: "#1B8585",
      },
    ],
    [],
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(420px, 1fr) minmax(420px, 1fr)",
        },
        gap: 2,
      }}
    >
      {/* =========================
          GRÁFICO SEMANAL
      ========================= */}

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#E8F5F5",
            padding: "14px 20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#1B8585",
            }}
          >
            Gráfico semanal
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            padding: {
              xs: "12px",
              sm: "16px",
            },
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <BarChart
            dataset={weeklyData}
            xAxis={weeklyXAxis}
            yAxis={[
              {
                tickMinStep: 1,
              },
            ]}
            series={weeklySeries}
            height={300}
            margin={{
              left: 50,
              right: 20,
              top: 20,
              bottom: 35,
            }}
            slotProps={{
              tooltip: {
                trigger: "none",
              },
            }}
          />
        </Box>
      </Box>

      {/* =========================
          GRÁFICO MENSUAL
      ========================= */}

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#E8F5F5",
            padding: "14px 20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#1B8585",
            }}
          >
            Gráfico mensual
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            padding: {
              xs: "12px",
              sm: "16px",
            },
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <BarChart
            dataset={monthlyData}
            xAxis={monthlyXAxis}
            series={monthlySeries}
            height={300}
            margin={{
              left: 50,
              right: 20,
              top: 20,
              bottom: 35,
            }}
            slotProps={{
              tooltip: {
                trigger: "none",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
