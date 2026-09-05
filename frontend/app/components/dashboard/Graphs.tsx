"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const data = [
  { day: "Lun", completed: 4 },
  { day: "Mar", completed: 6 },
  { day: "Mié", completed: 3 },
  { day: "Jue", completed: 7 },
  { day: "Vie", completed: 5 },
  { day: "Sáb", completed: 8 },
  { day: "Dom", completed: 6 },
];

export function SimpleBarChart() {
  return (
    <div style={{ width: "100%" }}>
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
            label: "Hábitos completados",
            color: "#1B8585",
          },
        ]}
        yAxis={[
          {
            label: "Hábitos",
          },
        ]}
        height={300}
      />
    </div>
  );
}

export function Charts() {
  return (
    <Box>
      {/* TITLE OUTSIDE THE CARDS */}
      <strong>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Grafico Semanal
        </Typography>
      </strong>

      {/* CARDS */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <SimpleBarChart />
      </Box>
    </Box>
  );
}
