import type { Metadata, Viewport } from "next";
import "@fontsource/crimson-pro/500.css";
import "@fontsource/crimson-pro/500-italic.css";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Robot Mammoth",
  description: "One day watching one mountain. There is a mammoth on it.",
};

export const viewport: Viewport = {
  themeColor: "#E9EEF5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
