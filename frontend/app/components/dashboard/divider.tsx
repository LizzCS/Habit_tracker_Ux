"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { StreakCard, BestStreak } from "../dashboard/cards";

export default function Streaks() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "stretch",
        marginTop: "12px",
      }}
    >
      <StreakCard />

      <Divider orientation="vertical" />

      <BestStreak />
    </Box>
  );
}
