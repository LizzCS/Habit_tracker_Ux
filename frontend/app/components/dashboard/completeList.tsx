"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function InteractiveList() {
  const habits = [
    "Exercise",
    "Read 20 minutes",
    "Drink water",
    "Study",
    "Meditate",
    "Walk 30 minutes",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "260px",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          backgroundColor: "#e6f7f7",
          py: 1.25,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid #d5eeee",
        }}
      >
        {/* NUMBER */}
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            color: "#1B8585",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {habits.length}
        </Box>

        {/* TITLE */}
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#1B8585",
          }}
        >
          Hábitos por completar
        </Typography>
      </Box>

      {/* LIST */}
      <Box
        sx={{
          height: "calc(100% - 52px)",
          overflowY: "auto",
          px: 1.5,
          py: 1,

          "&::-webkit-scrollbar": {
            width: "5px",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1B8585",
            borderRadius: "10px",
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <List sx={{ p: 0 }}>
          {habits.map((habit, value) => (
            <ListItem
              key={value}
              sx={{
                mb: 0.5,
                borderRadius: "10px",
                px: 1,
                py: 0.75,

                transition: "0.2s",

                "&:hover": {
                  backgroundColor: "#f0fafa",
                },
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  size="small"
                  sx={{
                    color: "#9ca3af",
                    mr: 0.5,

                    "&:hover": {
                      color: "#dc2626",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemAvatar
                sx={{
                  minWidth: "42px",
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    backgroundColor: "#e0f7f7",
                    color: "#1B8585",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={habit}
                secondary="Completado hoy"
                sx={{
                  minWidth: 0,
                  mr: 3,
                }}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#374151",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  },

                  secondary: {
                    sx: {
                      color: "#9ca3af",
                      fontSize: "11px",
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
