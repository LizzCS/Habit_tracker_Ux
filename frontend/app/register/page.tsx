"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function register() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <h1 id="logintitle" className="logintitle">
            <strong>SIGN UP</strong>
          </h1>

          <hr color="#000000" className="my-4" />

          <Stack spacing={2}>
            <TextField id="nombre" label="Name" variant="outlined" fullWidth />

            <TextField id="email" label="Email" variant="outlined" fullWidth />

            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
            />

            <TextField
              id="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
            />
          </Stack>

          <hr color="#000000" className="my-4" />

          <Stack direction="row" spacing={2}>
            <Button className="notWantButton" variant="outlined">
              Cancel
            </Button>

            <Button className="wantButton" variant="contained">
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#1b8585",
        }}
      />
    </Box>
  );
}
