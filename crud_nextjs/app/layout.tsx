import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
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
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className={"grid h-full grid-cols-[20%_80%] overflow-hidden"}>
            <aside className="h-full overflow-hidden border-r border-border">
              <Sidebar />
            </aside>
            <section className="flex h-full min-h-0 flex-col overflow-hidden">
              <Navbar />
              <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
