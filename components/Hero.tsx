import Image from "next/image";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  totalMembers: number;
}

export function Hero({ totalMembers }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep pt-20 pb-28 sm:pt-28 sm:pb-36">
      {/* Complementary amber/orange aurora on dark background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Warm amber — true complement of #326CE5 */}
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#E5A832]/30 blur-[140px] animate-pulse-glow" />
        <div className="absolute -top-1/4 right-0 w-[800px] h-[800px] rounded-full bg-[#E5A832]/25 blur-[130px] animate-pulse-glow [animation-delay:1.2s]" />
        {/* Deep orange */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#E87A20]/20 blur-[110px] animate-pulse-glow [animation-delay:0.5s]" />
        <div className="absolute top-1/2 right-[10%] w-[600px] h-[600px] rounded-full bg-[#E87A20]/20 blur-[110px] animate-pulse-glow [animation-delay:1.8s]" />
        {/* Gold */}
        <div className="absolute -bottom-1/4 left-[10%] w-[600px] h-[600px] rounded-full bg-brand-gold/30 blur-[100px] animate-pulse-glow [animation-delay:0.8s]" />
        <div className="absolute -bottom-1/3 right-[5%] w-[700px] h-[700px] rounded-full bg-brand-gold/25 blur-[120px] animate-pulse-glow [animation-delay:2s]" />
        {/* Blue accent — the logo color itself, subtle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-brand-blue/10 blur-[80px] animate-pulse-glow [animation-delay:1.5s]" />
        {/* Center warm wash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#E5A832]/15 blur-[150px] animate-pulse-glow [animation-delay:0.3s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo with complementary gradient rings */}
        <div className="relative inline-block mb-10 animate-float">
          {/* Outer spinning ring — amber to blue complement */}
          <div className="absolute inset-0 -m-8 sm:-m-10 rounded-full animate-spin-slow">
            <div className="w-full h-full rounded-full" style={{
              background: "linear-gradient(#09090b, #09090b) padding-box, linear-gradient(135deg, #E5A832, #E87A20, #326CE5, #E5A832) border-box",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Inner reverse-spinning ring */}
          <div className="absolute inset-0 -m-4 sm:-m-5 rounded-full animate-spin-slow-reverse">
            <div className="w-full h-full rounded-full" style={{
              background: "linear-gradient(#09090b, #09090b) padding-box, linear-gradient(135deg, #326CE5, #E5A832, #E87A20, #326CE5) border-box",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Amber glow behind icon */}
          <div className="absolute inset-0 -m-10 rounded-full bg-[#E5A832]/30 blur-[50px] animate-pulse-glow" />

          {/* The helm icon */}
          <Image
            src="/logo-icon.svg"
            alt="Cloud Native Nordics"
            width={120}
            height={120}
            className="relative z-10"
            priority
          />
        </div>

        {/* Text content — complementary amber to orange gradient */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E5A832] via-[#E87A20] to-[#E5A832] mb-3">
          Cloud Native Nordics
        </h1>
        <p className="text-lg sm:text-xl font-heading font-semibold text-gray-300 mb-10 max-w-2xl mx-auto">
          Connecting cloud native communities across the Nordics
        </p>

        {/* Member counter */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-[#E5A832]/30">
          <span className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E5A832] to-[#E87A20]">
            <AnimatedCounter target={totalMembers} suffix="+" />
          </span>
          <span className="text-gray-400 text-sm">community members</span>
        </div>
      </div>

    </section>
  );
}
