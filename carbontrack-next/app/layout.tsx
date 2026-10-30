import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code2Carbon — Carbon Footprint Emission Assessment Platform",
  description:
    "An advanced data-driven assessment platform to measure, analyze, and optimize carbon footprint emissions. Clean environmental themes, interactive calculator, and sustainability reports.",
  keywords:
    "carbon footprint, carbon emission, sustainability, greenhouse gases, climate change calculator, eco tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Load original Code2Carbon styles.css from public */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
