import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>
          <strong>Habit Tracker</strong>
        </h1>
        <p>
          Track your daily habits and stay on top of your goals. Check off
          habits as you complete them and watch your progress grow. Choose from
          habits like drinking water, exercising, reading, studying, getting
          enough sleep, and more.
        </p>

        <div>
          <Grid container spacing={8} size={6}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Log In
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4">
              Sign Up
            </button>
          </Grid>
        </div>
      </main>
    </div>
  );
}
