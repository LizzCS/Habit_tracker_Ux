"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { registerSchema } from "../../lib/validaciones";

import { registerUser } from "../../services/user.services";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmpassword: confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await registerUser(name, email, password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
      }}
    >
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
          <Typography
            component="h1"
            sx={{
              fontFamily: "Arial, sans-serif",
              fontSize: "30px",
              textAlign: "center",
              color: "#1f2937",
            }}
          >
            <strong>SIGN UP</strong>
          </Typography>

          <Divider
            sx={{
              margin: "20px auto",
              width: "150px",
              borderColor: "black",
            }}
          />

          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                id="nombre"
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Stack>

            {error && (
              <Typography
                sx={{
                  color: "red",
                  mt: 2,
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                {error}
              </Typography>
            )}

            <Divider
              sx={{
                margin: "20px auto",
                width: "150px",
                borderColor: "black",
              }}
            />

            <Stack direction="row" spacing={2}>
              <Button
                className="notWantButton"
                variant="outlined"
                fullWidth
                type="button"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>

              <Button
                className="wantButton"
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>

      <Box
        sx={{
          width: "50%",
          backgroundColor: "#1b8585",
        }}
      />
    </Box>
  );
}
