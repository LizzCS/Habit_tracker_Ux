"use client";

import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50">
      <main className="w-full max-w-3xl bg-white flex flex-col items-center py-20 px-8">
        <div>
          <h1 id="logintitle" className="logintitle">
            <strong>LOG IN</strong>
          </h1>

          <hr color="#000000" className="my-4" />

          <Stack spacing={2}>
            <TextField id="email" label="Email" variant="outlined" />

            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
            />
          </Stack>

          <hr color="#000000" className="my-4" />

          <Grid container spacing={8} size={6}>
            <Button className="notWantButton" variant="outlined">
              Cancel
            </Button>
            <Button className="wantButton" variant="contained">
              Log In
            </Button>
          </Grid>
        </div>
      </main>
    </div>
  );
}
