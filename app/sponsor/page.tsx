import type { Metadata } from "next";
import { Suspense } from "react";
import { SponsorForm } from "@/components/SponsorForm";

export const metadata: Metadata = {
  title: "Sponsor a Meetup — Cloud Native Nordics",
  description: "Host a venue, sponsor food & drinks, or support Cloud Native Nordics meetups",
};

export default function SponsorPage() {
  return (
    <>
      <section className="relative bg-night py-16 sm:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-ember/15 blur-[100px]" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] rounded-full bg-amber/15 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-3">
            Sponsor a Meetup
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Help the cloud native community grow. Host a meetup at your venue, sponsor food and drinks, or support us in other ways.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense><SponsorForm /></Suspense>
      </div>
    </>
  );
}
