import type { Metadata } from "next";
import "@fontsource/bricolage-grotesque/latin-700.css";
import "@fontsource/instrument-sans/latin-400.css";
import "@fontsource/instrument-sans/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real fruit. Real fizz. (a concept watermelon soda)",
  description:
    "A concept watermelon soda with no added sugar. A portfolio site: one cut, one scroll.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
