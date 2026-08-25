import type { Metadata } from "next";
import { Kameron } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const kameron = Kameron({
  variable: "--font-kameron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={kameron.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
