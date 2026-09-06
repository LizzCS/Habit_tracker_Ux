"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { BarChart } from "@mui/x-charts/BarChart";

import type { Habit } from "../../dashboard/page";

type Props = {
  habits: Habit[];
};

export function Charts({ habits }: Props) {
  const data = [
    {
      day: "Lun",
      completed: habits.length,
    },
    {
      day: "Mar",
      completed: habits.length,
    },
    {
      day: "Mié",
      completed: habits.length,
    },
    {
      day: "Jue",
      completed: habits.length,
    },
    {
      day: "Vie",
      completed: habits.length,
    },
    {
      day: "Sáb",
      completed: habits.length,
    },
    {
      day: "Dom",
      completed: habits.length,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
        padding: {
          xs: "16px",
          sm: "20px",
        },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#1f2937",
          mb: 2,
        }}
      >
        Gráfico semanal
      </Typography>

      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <BarChart
          dataset={data}
          xAxis={[
            {
              dataKey: "day",
              scaleType: "band",
            },
          ]}
          series={[
            {
              dataKey: "completed",
              label: "Hábitos",
              color: "#1B8585",
            },
          ]}
          yAxis={[
            {
              label: "Hábitos",
            },
          ]}
          height={280}
          margin={{
            left: 50,
            right: 20,
            top: 20,
            bottom: 30,
          }}
        />
      </Box>
    </Box>
  );
}
