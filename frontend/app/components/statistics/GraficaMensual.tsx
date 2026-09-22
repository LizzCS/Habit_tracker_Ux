"use client";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import { getMonthlyProgress } from "../../../services/statistics.services";

type MonthlyProgress = {
  totalCompleted: number;
  totalAmount: number;
};

type ProgresoMensualProps = {
  month?: {
    label: string;
  };
};

const TEAL_SOFT = "#e3f5f5";
const TEAL = "#1a8a8a";

const cardSx = {
  boxShadow: "0 4px 18px rgba(20,110,110,0.10)",
  overflow: "hidden",
  height: "100%",
};

export default function ProgresoMensual({ month }: ProgresoMensualProps) {
  const [monthly, setMonthly] = useState<MonthlyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(">>> PROGRESO MENSUAL MOUNTED");

    async function loadProgress() {
      console.log(">>> ABOUT TO CALL MONTHLY");

      try {
        const data = await getMonthlyProgress();

        console.log(">>> GOT MONTHLY:", data);

        setMonthly(data);
      } catch (error) {
        console.error(">>> MONTHLY ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  const totalCompleted = monthly?.totalCompleted ?? 0;
  const totalAmount = monthly?.totalAmount ?? 0;

  const monthLabel =
    month?.label ??
    new Date().toLocaleDateString("es-ES", {
      month: "long",
    });

  /*
   * Progress based on repetitions.
   *
   * Since we are not calculating an expected goal,
   * the bar represents the amount of activity completed.
   *
   * For now, 100 repetitions = 100%.
   */
  const progress = Math.min(totalAmount, 100);

  if (loading) {
    return (
      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <Typography color="text.secondary">Cargando...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={cardSx}>
      <CardHeader
        title="Progreso mensual"
        action={
          <Typography
            variant="body2"
            color="primary.dark"
            sx={{
              mt: 0.5,
              mr: 1,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {monthLabel}
          </Typography>
        }
        slotProps={{
          title: {
            variant: "h6",
            color: "primary.dark",
            fontWeight: 600,
          },
        }}
        sx={{
          bgcolor: TEAL_SOFT,
          py: 2,
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Actividades completadas
            </Typography>

            <Typography variant="body2" color="primary.dark">
              {totalAmount}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: TEAL_SOFT,
              "& .MuiLinearProgress-bar": {
                bgcolor: TEAL,
                borderRadius: 6,
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1,
            }}
          >
            {totalCompleted} actividades completadas · {totalAmount}{" "}
            repeticiones realizadas
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
