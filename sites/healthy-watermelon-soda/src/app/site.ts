// Set NEXT_PUBLIC_SITE_URL to the real domain at deploy time.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://healthy-watermelon-soda.example").replace(/\/$/, "");
