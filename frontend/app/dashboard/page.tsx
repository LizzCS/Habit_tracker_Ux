"use client";

import Box from "@mui/material/Box";

import Sidebar from "../components/sidebar";

import InteractiveList from "../components/dashboard/completeList";
import CheckBoxList from "../components/dashboard/dashboardList";
import StreaksTittle from "../components/dashboard/cards";
import { Charts } from "../components/dashboard/Graphs";
import TitanicPie from "../components/dashboard/porcentageChart";

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          marginLeft: {
            xs: 0,
            md: "240px",
          },

          width: {
            xs: "100%",
            md: "calc(100% - 240px)",
          },

          maxWidth: "100vw",
          minWidth: 0,
          minHeight: "100vh",
          boxSizing: "border-box",

          padding: {
            xs: "70px 16px 20px",
            sm: "70px 24px 24px",
            md: "40px",
          },

          display: "flex",
          flexDirection: "column",

          gap: {
            xs: "20px",
            md: "24px",
          },
        }}
      >
        {/* ================================= */}
        {/* LISTS */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },

            gap: {
              xs: "20px",
              md: "24px",
            },

            width: "100%",
            minWidth: 0,
          }}
        >
          {/* LEFT LIST */}

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <CheckBoxList />
          </Box>

          {/* RIGHT LIST */}

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <InteractiveList />
          </Box>
        </Box>

        {/* ================================= */}
        {/* STREAKS + PERCENTAGE */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },

            gap: {
              xs: "20px",
              md: "24px",
            },

            width: "100%",
            minWidth: 0,

            alignItems: "center",
          }}
        >
          {/* STREAKS */}

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <StreaksTittle />
          </Box>

          {/* PERCENTAGE */}

          <Box
            sx={{
              width: "100%",
              minWidth: 0,

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                width: "100%",

                maxWidth: {
                  xs: "280px",
                  sm: "320px",
                  md: "350px",
                },

                minWidth: 0,
              }}
            >
              <TitanicPie />
            </Box>
          </Box>
        </Box>

        {/* ================================= */}
        {/* GRAPHS */}
        {/* ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },

            gap: {
              xs: "20px",
              md: "24px",
            },

            width: "100%",
            minWidth: 0,
          }}
        >
          {/* GRAPH 1 */}

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <Charts />
          </Box>

          {/* GRAPH 2 */}

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <Charts />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
