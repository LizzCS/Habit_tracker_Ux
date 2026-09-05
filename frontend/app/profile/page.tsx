"use client";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 px-4">
      <main className="w-full max-w-md bg-white px-6 py-10 sm:px-10 sm:py-14">
        {/* Title */}
        <h1 className="logintitle">
          <strong>LOG IN</strong>
        </h1>

        {/* Divider */}
        <Divider
          sx={{
            width: "150px",
            margin: "20px auto",
            borderWidth: "1px",
            borderColor: "black",
          }}
        />

        {/* Text fields */}
        <Stack spacing={2} className="w-full">
          <TextField fullWidth id="email" label="Email" variant="outlined" />

          <TextField
            fullWidth
            id="password"
            label="Password"
            variant="outlined"
            type="password"
          />
        </Stack>

        {/* Divider */}
        <Divider
          sx={{
            width: "150px",
            margin: "20px auto",
            borderWidth: "1px",
            borderColor: "black",
          }}
        />

        {/* Buttons */}
        <div className="w-full grid grid-cols-2 gap-2">
          <Button className="notWantButton" variant="outlined" fullWidth>
            Cancel
          </Button>

          <Button className="wantButton" variant="contained" fullWidth>
            Log In
          </Button>
        </div>
      </main>
    </div>
  );
}
