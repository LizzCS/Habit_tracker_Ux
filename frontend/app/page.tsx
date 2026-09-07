"use client";

import Grid from "@mui/material/Grid";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>
          <strong>Habit Tracker</strong>
        </h1>

        <p>
          Lleva un registro de tus hábitos diarios y mantente al día con tus
          objetivos. Marca tus hábitos a medida que los completes y observa cómo
          aumenta tu progreso. Elige entre hábitos como beber agua, hacer
          ejercicio, leer, estudiar, dormir lo suficiente y mucho más.
        </p>

        <div>
          <Grid container spacing={8} size={6}>
            <Button
              variant="outlined"
              onClick={() => router.push("/login")}
              sx={{
                width: "150px",

                color: "#1B8585",
                borderColor: "#1B8585",
                "&:hover": {
                  borderColor: "#176f6f",
                },
              }}
            >
              Log in
            </Button>

            <Button
              variant="contained"
              onClick={() => router.push("/register")}
              sx={{
                width: "150px",

                backgroundColor: "#1B8585",
              }}
            >
              Sign up
            </Button>
          </Grid>
        </div>
      </main>
    </div>
  );
}
