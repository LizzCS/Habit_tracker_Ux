"use client";

import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { LineChart } from "@mui/x-charts/LineChart";

import { getMonthlyProgress } from "../../../services/statistics.services";

type TrendPoint = {
  label: string;
  value: number;
};

const cardSx = {
  boxShadow: "0 4px 18px rgba(20,110,110,0.10)",
  overflow: "hidden",
  height: "100%",
};

const TEAL_SOFT = "#e3f5f5";

export default function TendenciaCumplimiento() {
  const [points, setPoints] = useState<TrendPoint[]>([]);

  useEffect(() => {
    async function loadTrend() {
      try {
        const data = await getMonthlyProgress();

        const trend = data.trend.map(
          (point: { date: string; completed: number }) => ({
            label: point.date,
            value: point.completed,
          }),
        );

        setPoints(trend);
      } catch (error) {
        console.error("Error loading compliance trend:", error);
      }
    }

    loadTrend();
  }, []);

  return (
    <Card elevation={0} sx={cardSx}>
      <CardHeader
        title="Tendencia de cumplimiento"
        sx={{
          bgcolor: TEAL_SOFT,
          py: 2,
        }}
        slotProps={{
          title: {
            variant: "h6",
            color: "primary.dark",
            fontWeight: 600,
          },
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: points.map((point) => point.label),
            },
          ]}
          yAxis={[
            {
              min: 0,
            },
          ]}
          series={[
            {
              data: points.map((point) => point.value),
              label: "Cumplimiento",
              color: "#2bb3b3",
              valueFormatter: (value) => `${value}`,
            },
          ]}
          height={300}
          grid={{
            horizontal: true,
          }}
          margin={{
            top: 10,
            right: 10,
            bottom: 30,
            left: 45,
          }}
        />
      </CardContent>
    </Card>
  );
}
