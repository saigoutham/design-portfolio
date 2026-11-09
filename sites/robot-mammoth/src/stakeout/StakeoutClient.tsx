"use client";

import dynamic from "next/dynamic";

// WebGL only exists in the browser.
const Stakeout = dynamic(() => import("./Stakeout"), { ssr: false });

export default function StakeoutClient() {
  return <Stakeout />;
}
