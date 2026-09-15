"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { apiFetch } from "../../lib/API";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      sessionStorage.setItem("token", data.access_token);

      sessionStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f6",
        padding: {
          xs: "16px",
          sm: "24px",
          md: "40px",
        },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          backgroundColor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* LEFT SIDE - LOGIN */}
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            padding: {
              xs: "32px 20px",
              sm: "40px 32px",
              md: "50px 45px",
            },
          }}
        >
          {/* Title */}
          <Typography
            component="h1"
            sx={{
              fontFamily: "Arial, sans-serif",
              fontSize: {
                xs: "26px",
                sm: "28px",
                md: "30px",
              },
              textAlign: "center",
              color: "#1f2937",
            }}
          >
            <strong>LOG IN</strong>
          </Typography>

          {/* Divider */}
          <Divider
            sx={{
              width: {
                xs: "100px",
                sm: "150px",
              },
              margin: "20px auto",
              borderWidth: "1px",
              borderColor: "black",
            }}
          />

          {/* FORM */}
          <form onSubmit={handleLogin}>
            <Stack
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              {/* Email */}
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <TextField
                fullWidth
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>

            {/* Error message */}
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

            {/* Divider */}
            <Divider
              sx={{
                width: {
                  xs: "100px",
                  sm: "150px",
                },
                margin: "20px auto",
                borderWidth: "1px",
                borderColor: "black",
              }}
            />

            {/* Buttons */}
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: "10px",
              }}
            >
              {/* Cancel */}
              <Button
                className="notWantButton"
                variant="outlined"
                fullWidth
                type="button"
                onClick={() => router.push("/")}
                sx={{
                  minHeight: "42px",
                }}
              >
                Cancel
              </Button>

              {/* Log In */}
              <Button
                className="wantButton"
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  minHeight: "42px",
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </Box>
          </form>
        </Box>

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            backgroundColor: "#1B8585",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: {
              xs: "40px 20px",
              sm: "50px 32px",
              md: "45px",
            },
            minHeight: {
              xs: "220px",
              md: "100%",
            },
          }}
        ></Box>
      </Box>
    </Box>
  );
}
