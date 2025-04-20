import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../components/context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Derek Gagnon",
  description: "Derek Gagnon's Portfolio",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  const fontClasses = `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html lang="en">
      <body className={`${fontClasses} antialiased bg-amber-50 text-gray-900 dark:bg-gray-900 dark:text-amber-50`}>
        <ThemeProvider>
          <ThemeToggle />
          <div className="p-4 bg-green-200 dark:bg-red-900 text-black dark:text-white">Tailwind dark mode test: this box should turn red/white in dark mode, green/black in light mode.</div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}