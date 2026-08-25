import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

//icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function dashboard() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white">
        {/* DRAWER */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#1B8585",
            },
          }}
        >
          <Box
            sx={{
              marginTop: "90px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "100px",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#51d5d5",
                width: 110,
                height: 110,
                fontSize: 40,
              }}
            >
              N
            </Avatar>
            <p style={{ color: "white", fontWeight: "bold" }}>John Doe</p>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "40px",
            }}
          >
            <Button
              variant="outlined"
              className="dashboardButton"
              startIcon={<AccountBoxIcon />}
            >
              Profile
            </Button>

            <Button
              variant="outlined"
              className="dashboardButton"
              startIcon={<PlaylistAddIcon />}
            >
              Lista
            </Button>

            <Button
              variant="outlined"
              className="dashboardButton"
              startIcon={<AnalyticsIcon />}
            >
              Evaluacion
            </Button>

            <Divider
              sx={{
                width: "150px",
                margin: "0 auto",
                borderWidth: "1px",
                borderColor: "rgb(255, 255, 255)",
                marginTop: "20px",
              }}
            />

            <Button
              variant="outlined"
              className="logOutButton"
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        {/* CONTENT */}
      </main>
    </div>
  );
}
