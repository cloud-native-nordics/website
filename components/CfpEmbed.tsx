"use client";

import { useSearchParams } from "next/navigation";

export function CfpEmbed() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "";
  const src = location
    ? `https://cfp.cloudnativenordics.com?location=${encodeURIComponent(location)}`
    : "https://cfp.cloudnativenordics.com";

  return (
    <iframe
      src={src}
      className="w-full rounded-[10px] bg-white dark:bg-navy-card"
      style={{ minHeight: "1400px" }}
      title="CFP Submission Form"
    />
  );
}
