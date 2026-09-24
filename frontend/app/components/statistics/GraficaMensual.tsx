"use client";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { getMonthlyProgress } from "../../../services/statistics.services";

type DailyTrend = {
  day: number;
  completed: number;
};

type MonthlyProgress = {
  totalCompleted: number;
  totalAmount: number;
  trend: DailyTrend[];
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
    async function loadProgress() {
      try {
        const data = await getMonthlyProgress();
        setMonthly(data);
      } catch (error) {
        console.error("Error al cargar progreso mensual:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  const totalCompleted = monthly?.totalCompleted ?? 0;
  const totalAmount = monthly?.totalAmount ?? 0;
  const trend = monthly?.trend ?? [];

  const monthLabel =
    month?.label ??
    new Date().toLocaleDateString("es-ES", {
      month: "long",
    });

  const maxCompleted = Math.max(...trend.map((item) => item.completed), 1);

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
            sx={{
              mt: 0.5,
              mr: 1,
              color: "#146e6e",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {monthLabel}
          </Typography>
        }
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
        sx={{
          bgcolor: TEAL_SOFT,
          py: 2,
        }}
      />

      <CardContent sx={{ p: 3 }}>
        {/* Resumen */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Actividades completadas
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#146e6e",
                fontWeight: 700,
              }}
            >
              {totalCompleted}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Repeticiones realizadas
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#146e6e",
                fontWeight: 700,
              }}
            >
              {totalAmount}
            </Typography>
          </Box>
        </Box>

        {/* Gráfica */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 0.5,
              height: 180,
              width: "100%",
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: 1,
            }}
          >
            {trend.map((item) => {
              const height =
                item.completed === 0
                  ? 3
                  : Math.max((item.completed / maxCompleted) * 130, 8);

              return (
                <Box
                  key={item.day}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {/* Número */}
                  {item.completed > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: {
                          xs: "8px",
                          sm: "10px",
                        },
                        color: "#146e6e",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {item.completed}
                    </Typography>
                  )}

                  {/* Barra */}
                  <Box
                    sx={{
                      width: "70%",
                      maxWidth: 24,
                      minWidth: 4,
                      height: `${height}px`,
                      borderRadius: "4px 4px 1px 1px",
                      bgcolor: item.completed > 0 ? TEAL : TEAL_SOFT,
                      transition: "height 0.3s ease",
                    }}
                    title={`Día ${item.day}: ${item.completed} repeticiones`}
                  />

                  {/* Día */}
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    {item.day}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1.5,
              textAlign: "center",
            }}
          >
            Días del mes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
