"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

// Convierte una fecha a YYYY-MM-DD usando la fecha local
function getDateKey(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Devuelve la fecha de hoy como YYYY-MM-DD
function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Resta un día a una fecha YYYY-MM-DD
function getPreviousDay(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);

  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Calcula el streak actual
function calculateCurrentStreak(records: HabitRecord[]) {
  const completedDates = new Set(
    records
      .filter((record) => record.completed)
      .map((record) => getDateKey(record.date)),
  );

  const today = getTodayKey();

  // Si no completó nada hoy, el streak actual es 0
  if (!completedDates.has(today)) {
    return 0;
  }

  let streak = 0;
  let currentDate = today;

  while (completedDates.has(currentDate)) {
    streak++;

    currentDate = getPreviousDay(currentDate);
  }

  return streak;
}

// Calcula el mejor streak histórico
function calculateBestStreak(records: HabitRecord[]) {
  const completedDates = new Set(
    records
      .filter((record) => record.completed)
      .map((record) => getDateKey(record.date)),
  );

  if (completedDates.size === 0) {
    return 0;
  }

  const dates = Array.from(completedDates).sort();

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const previousDate = dates[i - 1];
    const currentDate = dates[i];

    const expectedNextDate = getNextDay(previousDate);

    if (currentDate === expectedNextDate) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
  }

  return bestStreak;
}

// Obtiene el día siguiente
function getNextDay(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);

  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function StreakCard({ records }: Props) {
  const currentStreak = calculateCurrentStreak(records);

  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: "14px 0 0 14px",
        overflow: "hidden",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#e6f7f7",
          py: 1.5,
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#1B8585",
          }}
        >
          Streak
        </Typography>
      </Box>

      <CardContent
        sx={{
          textAlign: "center",
          py: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Current
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            my: 0.5,
          }}
        >
          {currentStreak}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          days
        </Typography>
      </CardContent>
    </Card>
  );
}

export function BestStreak({ records }: Props) {
  const bestStreak = calculateBestStreak(records);

  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: "0 14px 14px 0",
        overflow: "hidden",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#e6f7f7",
          py: 1.5,
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#1B8585",
          }}
        >
          Best Streak
        </Typography>
      </Box>

      <CardContent
        sx={{
          textAlign: "center",
          py: 3,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            my: 0.5,
          }}
        >
          {bestStreak}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          days
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function StreaksTittle({ records }: Props) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 700,
        }}
      >
        Streaks
      </Typography>

      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <StreakCard records={records} />
        <BestStreak records={records} />
      </Box>
    </Box>
  );
}
