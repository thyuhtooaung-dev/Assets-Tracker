import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assets Tracker",
  description: "A directory of assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        oswald.variable,
        "font-mono",
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="h-screen overflow-hidden">
        <ThemeProvider
          defaultTheme="light"
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
