"use client";

import * as React from "react";
import { PieChart, pieClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

interface TitanicDatum {
  Class: "1st" | "2nd";
  Survived: "Yes" | "No";
  Count: number;
}

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

type ClassType = "1st" | "2nd";

// Convert hex color to rgba with opacity
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const titanicData: TitanicDatum[] = [
  { Class: "1st", Survived: "No", Count: 123 },
  { Class: "1st", Survived: "Yes", Count: 202 },
  { Class: "2nd", Survived: "No", Count: 167 },
  { Class: "2nd", Survived: "Yes", Count: 118 },
];

const classes: ClassType[] = ["1st", "2nd"];

const totalCount = titanicData.reduce(
  (acc: number, item: TitanicDatum) => acc + item.Count,
  0,
);

// Define colors for each class
const classColors: Record<ClassType, string> = {
  "1st": "#1B8585",
  "2nd": "#28D9D9",
};

// Different opacity based on class
const opacityMap: Record<ClassType, number> = {
  "1st": 0.9,
  "2nd": 0.7,
};

const classData: ChartDatum[] = classes.map((pClass: ClassType) => {
  const classTotal = titanicData
    .filter((item: TitanicDatum) => item.Class === pClass)
    .reduce((acc: number, item: TitanicDatum) => acc + item.Count, 0);
  return {
    id: pClass,
    label: `${pClass} Class:`,
    value: classTotal,
    percentage: (classTotal / totalCount) * 100,
    color: classColors[pClass],
  };
});

const classSurvivalData: ChartDatum[] = classes.flatMap((pClass: ClassType) => {
  const classTotal =
    classData.find((d: ChartDatum) => d.id === pClass)!.value ?? 0;
  const baseColor = classColors[pClass];
  return titanicData
    .filter((item: TitanicDatum) => item.Class === pClass)
    .sort((a: TitanicDatum, b: TitanicDatum) =>
      a.Survived > b.Survived ? 1 : -1,
    )
    .map((item: TitanicDatum) => ({
      id: `${pClass}-${item.Survived}`,
      label: item.Survived,
      value: item.Count,
      percentage: (item.Count / classTotal) * 100,
      color: item.Survived === "Yes" ? baseColor : `${baseColor}80`, // 80 is 50% opacity for 'No'
    }));
});

const StyledText = styled("text")(({ theme }: { theme: Theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
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

export default function TitanicPie(): React.ReactElement {
  const innerRadius = 30;
  const middleRadius = 90;

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Typography variant="h5">Porcentaje Cumplido</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: 300,
        }}
      >
        <PieChart
          series={[
            {
              innerRadius,
              outerRadius: middleRadius,
              data: classData,
              arcLabel: (item) =>
                `${item.id} (${(item as any).percentage.toFixed(0)}%)`,
              valueFormatter: ({ value }) =>
                `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
              highlightScope: { fade: "global", highlight: "item" },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
            {
              innerRadius: middleRadius,
              outerRadius: middleRadius + 20,
              data: classSurvivalData,
              arcLabel: (item) =>
                `${item.label} (${(item as any).percentage.toFixed(0)}%)`,
              valueFormatter: ({ value }) =>
                `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
              arcLabelRadius: 160,
              highlightScope: { fade: "global", highlight: "item" },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
          ]}
          sx={{
            [`& .${pieClasses.arcLabel}`]: {
              fontSize: "12px",
            },
          }}
          hideLegend
        >
          <PieCenterLabel>Class</PieCenterLabel>
        </PieChart>
      </Box>
    </Box>
  );
}
