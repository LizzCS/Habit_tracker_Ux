"use client";

import { useState } from "react";

import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import InteractiveList from "../components/dashboard/completeList";
import CheckBoxList from "../components/dashboard/dashboardList";
import StreaksTittle from "../components/dashboard/cards";
import { Charts } from "../components/dashboard/Graphs";
import TitanicPie from "../components/dashboard/porcentageChart";

// icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      {/* MOBILE CLOSE BUTTON */}
      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
          justifyContent: "flex-end",
          padding: "10px",
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* PROFILE */}
      <Box
        sx={{
          marginTop: {
            xs: "20px",
            md: "90px",
          },
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#51d5d5",
            width: 110,
            height: 110,
            fontSize: 40,
            marginLeft: "24px",
          }}
        >
          N
        </Avatar>

        <p
          style={{
            color: "white",
            fontWeight: "bold",
            marginLeft: "24px",
          }}
        >
          John Doe
        </p>
      </Box>

      {/* NAVIGATION */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "0 30px",
        }}
      >
        <Button
          variant="outlined"
          className="dashboardButton"
          startIcon={<AccountBoxIcon />}
          onClick={() => setMobileOpen(false)}
        >
          Profile
        </Button>

        <Button
          variant="outlined"
          className="dashboardButton"
          startIcon={<PlaylistAddIcon />}
          onClick={() => setMobileOpen(false)}
        >
          Lista
        </Button>

        <Button
          variant="outlined"
          className="dashboardButton"
          startIcon={<AnalyticsIcon />}
          onClick={() => setMobileOpen(false)}
        >
          Evaluacion
        </Button>

        <Divider
          sx={{
            width: "150px",
            maxWidth: "100%",
            margin: "20px auto 0",
            borderWidth: "1px",
            borderColor: "white",
            marginLeft: "24px",
          }}
        />

        <Button
          variant="outlined"
          className="logOutButton"
          startIcon={<ExitToAppIcon />}
          onClick={() => setMobileOpen(false)}
        >
          Logout
        </Button>
      </Box>
    </>
  );

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
      {/* ================================= */}
      {/* DESKTOP DRAWER */}
      {/* ================================= */}

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {
            backgroundColor: "#1B8585",
            width: "240px",
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ================================= */}
      {/* MOBILE DRAWER */}
      {/* ================================= */}

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            backgroundColor: "#1B8585",
            width: {
              xs: "80vw",
              sm: "300px",
            },
            maxWidth: "300px",
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ================================= */}
      {/* MOBILE MENU BUTTON */}
      {/* ================================= */}

      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },

          position: "fixed",
          top: "16px",
          left: "16px",

          zIndex: 1200,

          backgroundColor: "#1B8585",
          color: "white",

          "&:hover": {
            backgroundColor: "#156f6f",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

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
