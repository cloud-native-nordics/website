import Image from "next/image";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  totalMembers: number;
}

export function Hero({ totalMembers }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 sm:py-32">
      {/* Aurora gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-brand-gold/25 blur-[120px]" />
        <div className="absolute top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-brand-gold/20 blur-[100px]" />
        <div className="absolute -bottom-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-pink/15 blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-hotpink/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Image
          src="/logo.svg"
          alt="Cloud Native Nordics"
          width={320}
          height={104}
          className="mx-auto mb-8"
          priority
        />
        <p className="text-lg sm:text-xl font-heading font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-pink mb-10 max-w-2xl mx-auto">
          Connecting cloud native communities across the Nordics
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-brand-gold/40">
          <span className="text-3xl font-heading font-bold text-white">
            <AnimatedCounter target={totalMembers} suffix="+" />
          </span>
          <span className="text-gray-300 text-sm">community members</span>
        </div>
      </div>
    </section>
  );
}
