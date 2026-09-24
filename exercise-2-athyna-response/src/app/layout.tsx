import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/shell/header";
import { Footer } from "@/components/shell/footer";
import { TelemetryProvider } from "@/lib/telemetry";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Athyna | Find Remote Jobs in AI & Tech",
  description:
    "A frontier talent ecosystem matching world-class technical minds with visionary companies building the AI-first future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} antialiased min-h-screen bg-surface text-on-surface font-sans flex flex-col`}
      >
        <TelemetryProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </TelemetryProvider>
      </body>
    </html>
  );
}
