"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

type ProfileProps = {
  open: boolean;
  onClose: () => void;
};

type User = {
  name: string;
  email: string;
  createdAt?: string;
};

export default function Profile({ open, onClose }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                backgroundColor: "#1B8585",
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>

            <Typography variant="h5">
              <strong>Mi Perfil</strong>
            </Typography>

            <Typography color="text.secondary">
              Información de tu cuenta
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Nombre
            </Typography>

            <Typography>{user?.name || "Cargando..."}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Correo electrónico
            </Typography>

            <Typography>{user?.email || "Cargando..."}</Typography>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
