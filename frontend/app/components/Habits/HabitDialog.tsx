"use client";

import * as React from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Typography,
} from "@mui/material";

import type { HabitForm } from "../../habits/types";

type HabitDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  form: HabitForm;
  saving: boolean;
  onChange: (field: keyof HabitForm, value: string | boolean) => void;
  onSave: () => void;
  onClose: () => void;
};

const nameRecommendations = [
  "Leer 20 minutos",
  "Hacer ejercicio",
  "Beber agua",
  "Estudiar",
  "Meditar",
];

const categoryRecommendations = [
  "Salud",
  "Estudios",
  "Productividad",
  "Personal",
  "Ejercicio",
  "Bienestar",
];

export default function HabitDialog({
  open,
  mode,
  form,
  saving,
  onChange,
  onSave,
  onClose,
}: HabitDialogProps) {
  const isEditing = mode === "edit";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#1f2937",
        }}
      >
        {isEditing ? "Editar hábito" : "Crear nuevo hábito"}
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          {/* NOMBRE */}

          {!isEditing && (
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#6b7280",
                  mb: 1,
                }}
              >
                Recomendaciones
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {nameRecommendations.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    variant="outlined"
                    onClick={() => onChange("name", name)}
                    sx={{
                      borderColor: "#b7dede",
                      color: "#1B8585",
                      "&:hover": {
                        backgroundColor: "#E8F5F5",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            fullWidth
            required
          />

          {/* DESCRIPCIÓN */}

          <TextField
            label="Descripción"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            fullWidth
            multiline
            rows={2}
          />

          {/* CATEGORÍA */}

          <TextField
            label="Categoría"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            fullWidth
          />

          {!isEditing && (
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#6b7280",
                  mb: 1,
                }}
              >
                Categorías sugeridas
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {categoryRecommendations.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    variant="outlined"
                    onClick={() => onChange("category", category)}
                    sx={{
                      borderColor: "#b7dede",
                      color: "#1B8585",
                      "&:hover": {
                        backgroundColor: "#E8F5F5",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* FRECUENCIA + PRIORIDAD */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              select
              label="Frecuencia"
              value={form.frequency}
              onChange={(e) => onChange("frequency", e.target.value)}
            >
              <MenuItem value="diaria">Diaria</MenuItem>
              <MenuItem value="semanal">Semanal</MenuItem>
              <MenuItem value="anual">Anual</MenuItem>
            </TextField>

            <TextField
              select
              label="Prioridad"
              value={form.priority}
              onChange={(e) => onChange("priority", e.target.value)}
            >
              <MenuItem value="baja">Baja</MenuItem>
              <MenuItem value="media">Media</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
            </TextField>
          </Box>

          {/* FECHAS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Fecha de inicio"
              type="date"
              value={form.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Fecha de finalización"
              type="date"
              value={form.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          {/* ACTIVO */}

          <FormControlLabel
            control={
              <Checkbox
                checked={form.active}
                onChange={(e) => onChange("active", e.target.checked)}
                sx={{
                  color: "#1B8585",
                  "&.Mui-checked": {
                    color: "#1B8585",
                  },
                }}
              />
            }
            label="Hábito activo"
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={saving}
          sx={{
            color: "#6b7280",
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving}
          sx={{
            backgroundColor: "#1B8585",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "9px",
            "&:hover": {
              backgroundColor: "#176f6f",
            },
          }}
        >
          {saving ? (
            <CircularProgress
              size={20}
              sx={{
                color: "#ffffff",
              }}
            />
          ) : isEditing ? (
            "Guardar cambios"
          ) : (
            "Crear hábito"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
