"use client";

import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { LineChart } from "@mui/x-charts/LineChart";

import { getMonthlyProgress } from "../../../services/statistics.services";

type TrendPoint = {
  day: number;
  completed: number;
};

const cardSx = {
  boxShadow: "0 4px 18px rgba(20,110,110,0.10)",
  overflow: "hidden",
  height: "100%",
};

const TEAL_SOFT = "#e3f5f5";
const TEAL = "#2bb3b3";

export default function TendenciaCumplimiento() {
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function loadTrend() {
      try {
        const data = await getMonthlyProgress();

        setPoints(data.trend);
        setTotalAmount(data.totalAmount);
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
            sx: {
              color: "#146e6e",
              fontWeight: 600,
              textTransform: "capitalize",
            },
          },
        }}
      />
      <CardContent sx={{ p: 3 }}>
        {/* Total */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total del mes:{" "}
            <strong style={{ color: "#146e6e" }}>{totalAmount}</strong>{" "}
            repeticiones
          </Typography>
        </Box>

        {/* Gráfica */}
        <Box sx={{ width: "100%" }}>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: points.map((point) => point.day),
                label: "Día del mes",
              },
            ]}
            yAxis={[
              {
                min: 0,
                label: "Repeticiones completadas",
              },
            ]}
            series={[
              {
                data: points.map((point) => point.completed),
                label: "Repeticiones",
                color: TEAL,
                valueFormatter: (value) => `${value} repeticiones`,
              },
            ]}
            height={300}
            grid={{
              horizontal: true,
            }}
            margin={{
              top: 20,
              right: 20,
              bottom: 55,
              left: 70,
            }}
            slotProps={{
              legend: {
                direction: "horizontal",
                position: {
                  vertical: "bottom",
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
