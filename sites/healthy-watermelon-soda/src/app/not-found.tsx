import "../components/hero.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wm-404">
      <p className="wm-404n" aria-hidden="true">404</p>
      <h1 className="wm-404h">That slice is gone.</h1>
      <Link className="wm-cta" href="/">
        <span>Back to the cut</span>
        <span className="wm-arrow" aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
