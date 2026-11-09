import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/components/experience.css";

export const metadata: Metadata = {
  title: "Six lamps for the darkest night",
  description:
    "Six stories of Diwali, each drawn after the art of the place that tells it. Light a lamp to open one.",
  openGraph: {
    title: "Six lamps for the darkest night",
    description:
      "Six stories of Diwali, each drawn after the art of the place that tells it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0907",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#lamps">
          Skip to the lamps
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
