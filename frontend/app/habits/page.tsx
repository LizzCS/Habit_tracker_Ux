"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import { apiFetch } from "../../lib/API";
import Sidebar from "../components/sidebar";

type Habit = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  frequency: "diaria" | "semanal" | "anual";
  priority: "baja" | "media" | "alta";
  startDate?: string;
  endDate?: string;
  active: boolean;
  userId: string;
};

type HabitForm = {
  name: string;
  description: string;
  category: string;
  frequency: "diaria" | "semanal" | "anual";
  priority: "baja" | "media" | "alta";
  startDate: string;
  endDate: string;
  active: boolean;
};

const emptyForm: HabitForm = {
  name: "",
  description: "",
  category: "",
  frequency: "diaria",
  priority: "media",
  startDate: "",
  endDate: "",
  active: true,
};

export default function Habits() {
  const router = useRouter();

  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [openDialog, setOpenDialog] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState<HabitForm>(emptyForm);

  // null = crear
  // habit = editar
  const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null);

  /*
   * --------------------------------------------------
   * LOAD HABITS
   * --------------------------------------------------
   */

  const loadHabits = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/habits");

      setHabits(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los hábitos");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadHabits();
  }, [router, loadHabits]);

  /*
   * --------------------------------------------------
   * CALENDAR
   * --------------------------------------------------
   */

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  // Make Monday the first day
  const startingDay = firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    const date = new Date(year, month, day);

    return isSameDay(date, selectedDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(year, month, day);

    return isSameDay(date, today);
  };

  const selectDay = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  /*
   * --------------------------------------------------
   * HABITS FOR SELECTED DAY
   * --------------------------------------------------
   */

  const selectedHabits = habits.filter((habit) => {
    if (!habit.active) {
      return false;
    }

    if (!habit.startDate) {
      return true;
    }

    const startDate = new Date(habit.startDate);
    const selected = new Date(selectedDate);

    startDate.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < startDate) {
      return false;
    }

    if (habit.endDate) {
      const endDate = new Date(habit.endDate);

      endDate.setHours(0, 0, 0, 0);

      if (selected > endDate) {
        return false;
      }
    }

    return true;
  });

  /*
   * --------------------------------------------------
   * FORM
   * --------------------------------------------------
   */

  const handleChange = (field: keyof HabitForm, value: string | boolean) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * --------------------------------------------------
   * CREATE
   * --------------------------------------------------
   */

  const handleOpenCreate = () => {
    setEditingHabit(null);

    setForm({
      ...emptyForm,
      startDate: formatDateForInput(selectedDate),
    });

    setError("");
    setOpenDialog(true);
  };

  /*
   * --------------------------------------------------
   * EDIT
   * --------------------------------------------------
   */

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);

    setForm({
      name: habit.name,
      description: habit.description || "",
      category: habit.category || "",
      frequency: habit.frequency,
      priority: habit.priority,

      startDate: habit.startDate
        ? formatDateForInput(new Date(habit.startDate))
        : "",

      endDate: habit.endDate ? formatDateForInput(new Date(habit.endDate)) : "",

      active: habit.active,
    });

    setError("");
    setOpenDialog(true);
  };

  /*
   * --------------------------------------------------
   * CLOSE DIALOG
   * --------------------------------------------------
   */

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setOpenDialog(false);
    setEditingHabit(null);
    setForm(emptyForm);
  };

  /*
   * --------------------------------------------------
   * CREATE / UPDATE
   * --------------------------------------------------
   */

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("El nombre del hábito es obligatorio");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        frequency: form.frequency,
        priority: form.priority,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        active: form.active,
      };

      if (editingHabit) {
        // EDIT
        await apiFetch(`/habits/${editingHabit._id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        // CREATE
        await apiFetch("/habits", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      setOpenDialog(false);
      setEditingHabit(null);
      setForm(emptyForm);

      await loadHabits();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          editingHabit
            ? "No se pudo actualizar el hábito"
            : "No se pudo crear el hábito",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------------------------
   * DELETE
   * --------------------------------------------------
   */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("¿Quieres eliminar este hábito?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiFetch(`/habits/${id}`, {
        method: "DELETE",
      });

      await loadHabits();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("No se pudo eliminar el hábito");
      }
    }
  };

  /*
   * --------------------------------------------------
   * HELPERS
   * --------------------------------------------------
   */

  const monthName = currentMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const selectedDateText = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f7f9f9",

          marginLeft: {
            xs: 0,
            md: "240px",
          },

          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* PAGE TITLE */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "26px",
                  md: "32px",
                },
                fontWeight: 700,
                color: "#1f2937",
              }}
            >
              Mis hábitos
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                mt: 0.5,
              }}
            >
              Selecciona un día para ver tus hábitos.
            </Typography>
          </Box>

          {/* ERROR */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* CALENDAR */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 3px 15px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* CALENDAR HEADER */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <IconButton onClick={previousMonth}>
                  <ChevronLeft />
                </IconButton>

                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    textTransform: "capitalize",
                    color: "#1f2937",
                  }}
                >
                  {monthName}
                </Typography>

                <IconButton onClick={nextMonth}>
                  <ChevronRight />
                </IconButton>
              </Box>

              {/* WEEK DAYS */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1,
                  mb: 1,
                }}
              >
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (day) => (
                    <Typography
                      key={day}
                      sx={{
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#9ca3af",
                      }}
                    >
                      {day}
                    </Typography>
                  ),
                )}
              </Box>

              {/* DAYS */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1,
                }}
              >
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return (
                      <Box
                        key={`empty-${index}`}
                        sx={{
                          height: {
                            xs: 42,
                            md: 52,
                          },
                        }}
                      />
                    );
                  }

                  const selected = isSelected(day);

                  const today = isToday(day);

                  return (
                    <Button
                      key={day}
                      onClick={() => selectDay(day)}
                      sx={{
                        minWidth: 0,
                        height: {
                          xs: 42,
                          md: 52,
                        },
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: selected || today ? 700 : 500,

                        color: selected ? "#ffffff" : "#374151",

                        backgroundColor: selected ? "#1B8585" : "transparent",

                        border:
                          today && !selected
                            ? "2px solid #1B8585"
                            : "2px solid transparent",

                        "&:hover": {
                          backgroundColor: selected ? "#176f6f" : "#e6f7f7",
                        },
                      }}
                    >
                      {day}
                    </Button>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          {/* LIST HEADER */}
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1f2937",
                  textTransform: "capitalize",
                }}
              >
                {selectedDateText}
              </Typography>

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#6b7280",
                  mt: 0.5,
                }}
              >
                {selectedHabits.length}{" "}
                {selectedHabits.length === 1 ? "hábito" : "hábitos"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreate}
              sx={{
                backgroundColor: "#1B8585",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                px: 2,

                "&:hover": {
                  backgroundColor: "#176f6f",
                },
              }}
            >
              Nuevo hábito
            </Button>
          </Box>

          {/* HABITS LIST */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress
                sx={{
                  color: "#1B8585",
                }}
              />
            </Box>
          ) : selectedHabits.length === 0 ? (
            <Card
              sx={{
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: 7,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#374151",
                    mb: 1,
                  }}
                >
                  No hay hábitos para este día
                </Typography>

                <Typography
                  sx={{
                    color: "#9ca3af",
                    fontSize: "14px",
                    mb: 3,
                  }}
                >
                  Crea un hábito para comenzar.
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleOpenCreate}
                  sx={{
                    color: "#1B8585",
                    borderColor: "#1B8585",
                    textTransform: "none",
                  }}
                >
                  Crear hábito
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {selectedHabits.map((habit) => (
                <Card
                  key={habit._id}
                  sx={{
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,

                      "&:last-child": {
                        pb: 2,
                      },
                    }}
                  >
                    {/* CHECKBOX */}
                    <Checkbox
                      sx={{
                        color: "#1B8585",

                        "&.Mui-checked": {
                          color: "#1B8585",
                        },
                      }}
                    />

                    {/* HABIT INFO */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1f2937",
                        }}
                      >
                        {habit.name}
                      </Typography>

                      {habit.description && (
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#6b7280",
                            mt: 0.3,
                          }}
                        >
                          {habit.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.75,
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <Chip
                          label={habit.frequency}
                          size="small"
                          sx={{
                            fontSize: "11px",
                          }}
                        />

                        <Chip
                          label={habit.priority}
                          size="small"
                          sx={{
                            fontSize: "11px",
                          }}
                        />

                        {habit.category && (
                          <Chip
                            label={habit.category}
                            size="small"
                            sx={{
                              fontSize: "11px",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* EDIT */}
                    <IconButton
                      onClick={() => handleOpenEdit(habit)}
                      sx={{
                        color: "#6b7280",
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>

                    {/* DELETE */}
                    <IconButton
                      onClick={() => handleDelete(habit._id)}
                      sx={{
                        color: "#ef4444",
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* CREATE / EDIT DIALOG */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1f2937",
          }}
        >
          {editingHabit ? "Editar hábito" : "Crear nuevo hábito"}
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
            {/* NAME */}
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
            />

            {/* DESCRIPTION */}
            <TextField
              label="Descripción"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            {/* CATEGORY */}
            <TextField
              label="Categoría"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              fullWidth
            />

            {/* FREQUENCY + PRIORITY */}
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
                onChange={(e) => handleChange("frequency", e.target.value)}
              >
                <MenuItem value="diaria">Diaria</MenuItem>

                <MenuItem value="semanal">Semanal</MenuItem>

                <MenuItem value="anual">Anual</MenuItem>
              </TextField>

              <TextField
                select
                label="Prioridad"
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <MenuItem value="baja">Baja</MenuItem>

                <MenuItem value="media">Media</MenuItem>

                <MenuItem value="alta">Alta</MenuItem>
              </TextField>
            </Box>

            {/* DATES */}
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
                onChange={(e) => handleChange("startDate", e.target.value)}
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
                onChange={(e) => handleChange("endDate", e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            {/* ACTIVE */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
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
            onClick={handleCloseDialog}
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
            onClick={handleSave}
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
            ) : editingHabit ? (
              "Guardar cambios"
            ) : (
              "Crear hábito"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/*
 * --------------------------------------------------
 * DATE HELPER
 * --------------------------------------------------
 */

function formatDateForInput(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
