"use client";

import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Login() {
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

          {/* Form */}

          <Stack
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <TextField fullWidth id="email" label="Email" variant="outlined" />

            <TextField
              fullWidth
              id="password"
              label="Password"
              variant="outlined"
              type="password"
            />
          </Stack>

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
            <Button
              className="notWantButton"
              variant="outlined"
              fullWidth
              sx={{
                minHeight: "42px",
              }}
            >
              Cancel
            </Button>

            <Button
              className="wantButton"
              variant="contained"
              fullWidth
              sx={{
                minHeight: "42px",
              }}
            >
              Log In
            </Button>
          </Box>
        </Box>

        {/* RIGHT SIDE - WELCOME */}

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
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: "Arial, sans-serif",

              fontSize: {
                xs: "28px",
                sm: "32px",
                md: "36px",
              },

              color: "white",
              mb: 2,
            }}
          >
            <strong>Welcome Back</strong>
          </Typography>

          <Divider
            sx={{
              width: {
                xs: "100px",
                sm: "150px",
              },

              borderWidth: "1px",
              borderColor: "white",

              mb: 2,
            }}
          />

          <Typography
            sx={{
              fontFamily: "Arial, sans-serif",

              fontSize: {
                xs: "14px",
                sm: "15px",
              },

              lineHeight: 1.6,
              color: "white",

              maxWidth: "350px",
            }}
          >
            Log in to continue managing your habits and keep building your
            streak.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
