import type { Metadata } from "next";
import { CfpEmbed } from "@/components/CfpEmbed";

export const metadata: Metadata = {
  title: "Call for Papers — Cloud Native Nordics",
  description: "Submit a talk proposal to speak at any Cloud Native Nordics meetup",
};

export default function CfpPage() {
  return (
    <>
      <section className="relative bg-navy-deep py-16 sm:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-pink/15 blur-[100px]" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] rounded-full bg-brand-gold/15 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-3">
            Call for Papers
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Share your knowledge with the cloud native community across the Nordics.
            We welcome talks on Kubernetes, DevOps, Security, Observability, Platform Engineering, and more.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-[2px] rounded-xl bg-gradient-to-r from-brand-pink to-brand-gold">
          <CfpEmbed />
        </div>
      </div>
    </>
  );
}
