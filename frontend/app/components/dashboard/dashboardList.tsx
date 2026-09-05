"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

export default function CheckboxList() {
  const [checked, setChecked] = React.useState([0]);

  const habits = ["Exercise", "Read 20 minutes", "Drink water", "Study"];

  const progressValues = [60, 80, 25, 90];

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

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
          {habits.map((habit, value) => {
            const progress = progressValues[value];

            return (
              <ListItem key={value} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={handleToggle(value)}
                  sx={{
                    borderRadius: "10px",
                    px: 1,
                    py: 1,

                    "&:hover": {
                      backgroundColor: "#f0fafa",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "32px",
                    }}
                  >
                    <Checkbox
                      edge="start"
                      checked={checked.includes(value)}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      sx={{
                        p: 0.5,
                        color: "#1B8585",

                        "&.Mui-checked": {
                          color: "#1B8585",
                        },
                      }}
                    />
                  </ListItemIcon>

                  <Box sx={{ width: "100%", minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#374151",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {habit}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          flex: 1,
                          height: 5,
                          borderRadius: 5,
                          backgroundColor: "#e5e7eb",

                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#1B8585",
                            borderRadius: 5,
                          },
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#1B8585",
                        }}
                      >
                        {progress}%
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
