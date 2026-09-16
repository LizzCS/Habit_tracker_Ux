"use client";

import * as React from "react";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material";

import Sidebar from "../components/sidebar";

import { useHabits } from "./logic";

import HabitList from "../components/Habits/HabitList";

import HabitDialog from "../components/Habits/HabitDialog";

import type { HabitRecord } from "../dashboard/types";

import type { Habit } from "./types";

import { getCalendarDays } from "./utils";

import { loadRecords, completeHabit } from "../dashboard/logic";

export default function Habits() {
  const {
    selectedDate,
    currentMonth,
    selectedHabits,
    loading,
    error,
    openDialog,
    saving,
    form,
    editingHabit,
    monthName,
    selectedDateText,
    setError,
    isSelected,
    isToday,
    selectDay,
    previousMonth,
    nextMonth,
    handleChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSave,
    handleDelete,
  } = useHabits();

  // =========================
  // RECORDS
  // =========================

  const [records, setRecords] = React.useState<HabitRecord[]>([]);

  const loadAllRecords = async () => {
    try {
      const data = await loadRecords();

      setRecords(data);
    } catch (error) {
      console.error("Error cargando registros:", error);
    }
  };

  // =========================
  // COMPLETE HABIT
  // =========================

  const handleComplete = async (habitId: string, amount: number) => {
    try {
      const record = await completeHabit(habitId, amount);

      await loadAllRecords();

      return record;
    } catch (error) {
      console.error("Error completando hábito:", error);
      setError("No se pudo completar el hábito");
      throw error;
    }
  };
  // =========================
  // LOAD RECORDS
  // =========================

  React.useEffect(() => {
    loadAllRecords();
  }, []);

  const calendarDays = getCalendarDays(currentMonth);

  return (
    <>
      <Sidebar />

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
            <CardContent sx={{ p: 0.5 }}>
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
            <HabitList
              habits={selectedHabits}
              records={records}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          )}
        </Box>
      </Box>

      {/* CREATE / EDIT DIALOG */}

      <HabitDialog
        open={openDialog}
        mode={editingHabit ? "edit" : "create"}
        form={form}
        saving={saving}
        onChange={handleChange}
        onSave={handleSave}
        onClose={handleCloseDialog}
      />
    </>
  );
}
