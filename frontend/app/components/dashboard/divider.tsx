"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { StreakCard, BestStreak } from "../dashboard/cards";

type HabitRecord = {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
};

type Props = {
  records: HabitRecord[];
};

export default function Streaks({ records }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "stretch",
        marginTop: "12px",
      }}
    >
      <StreakCard records={records} />

      <Divider orientation="vertical" flexItem />

      <BestStreak records={records} />
    </Box>
  );
}
