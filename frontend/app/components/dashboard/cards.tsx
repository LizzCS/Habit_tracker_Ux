import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export function StreakCard() {
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: "14px 0 0 14px",
        overflow: "hidden",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* TITLE */}
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

      {/* CONTENT */}
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
          12
        </Typography>

        <Typography variant="body2" color="text.secondary">
          days
        </Typography>
      </CardContent>
    </Card>
  );
}

export function BestStreak() {
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: "0 14px 14px 0",
        overflow: "hidden",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* TITLE */}
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

      {/* CONTENT */}
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
          24
        </Typography>

        <Typography variant="body2" color="text.secondary">
          days
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function StreaksTittle() {
  return (
    <Box sx={{ textAlign: "center" }}>
      {/* TITLE */}
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 700,
        }}
      >
        Streaks
      </Typography>

      {/* CARDS */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <StreakCard />
        <BestStreak />
      </Box>
    </Box>
  );
}
