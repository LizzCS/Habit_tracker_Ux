"use client";

import * as React from "react";

import { PieChart, pieClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

interface TitanicPieProps {
  percentage: number;
}

const StyledText = styled("text")(({ theme }: { theme: Theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
  fontWeight: 700,
}));

interface PieCenterLabelProps {
  children: React.ReactNode;
}

function PieCenterLabel({ children }: PieCenterLabelProps): React.ReactElement {
  const { width, height, left, top } = useDrawingArea();

  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function TitanicPie({
  percentage,
}: TitanicPieProps): React.ReactElement {
  // Make sure percentage stays between 0 and 100
  const completed = Math.min(100, Math.max(0, percentage));

  const remaining = 100 - completed;

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#374151",
        }}
      >
        Porcentaje Cumplido
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: 260,
        }}
      >
        <PieChart
          series={[
            {
              innerRadius: 65,
              outerRadius: 100,

              data: [
                {
                  id: "completed",
                  label: "Completado",
                  value: completed,
                  color: "#1B8585",
                },
                {
                  id: "remaining",
                  label: "Pendiente",
                  value: remaining,
                  color: "#e5e7eb",
                },
              ],

              highlightScope: {
                fade: "global",
                highlight: "item",
              },

              highlighted: {
                additionalRadius: 2,
              },

              cornerRadius: 4,
            },
          ]}
          sx={{
            [`& .${pieClasses.arcLabel}`]: {
              fontSize: "12px",
            },
          }}
          hideLegend
        >
          <PieCenterLabel>{completed.toFixed(0)}%</PieCenterLabel>
        </PieChart>
      </Box>
    </Box>
  );
}
