"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Profile from "../components/profile/profile";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setUserName(user.name || "");
    } catch {
      setUserName("");
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    router.push("/login");
    setMobileOpen(false);
  };

  const drawerContent = (
    <>
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
          {userName ? userName.charAt(0).toUpperCase() : "N"}
        </Avatar>

        <p
          style={{
            color: "white",
            fontWeight: "bold",
            marginLeft: "24px",
          }}
        >
          {userName || "Usuario"}
        </p>
      </Box>

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
          startIcon={<AnalyticsIcon />}
          onClick={() => navigateTo("/dashboard")}
        >
          Dashboard
        </Button>

        <Button
          variant="outlined"
          className="dashboardButton"
          startIcon={<AccountBoxIcon />}
          onClick={() => setProfileOpen(true)}
        >
          Profile
        </Button>

        <Button
          variant="outlined"
          className="dashboardButton"
          startIcon={<PlaylistAddIcon />}
          onClick={() => navigateTo("/habits")}
        >
          Lista
        </Button>

        <Button
          variant="outlined"
          className="dashboardButton"
          startIcon={<AnalyticsIcon />}
          onClick={() => navigateTo("/evaluacion")}
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
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </>
  );

  return (
    <>
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

      <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
