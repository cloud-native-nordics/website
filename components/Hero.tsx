import Image from "next/image";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  totalMembers: number;
}

export function Hero({ totalMembers }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-night pt-20 pb-28 sm:pt-28 sm:pb-36">
      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full bg-ember/30 blur-[140px] animate-pulse-glow" />
        <div className="absolute -top-1/4 right-0 w-[800px] h-[800px] rounded-full bg-ember/25 blur-[130px] animate-pulse-glow [animation-delay:1.2s]" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-amber/20 blur-[100px] animate-pulse-glow [animation-delay:0.5s]" />
        <div className="absolute top-1/2 right-[10%] w-[600px] h-[600px] rounded-full bg-ember/20 blur-[110px] animate-pulse-glow [animation-delay:1.8s]" />
        <div className="absolute -bottom-1/4 left-[10%] w-[600px] h-[600px] rounded-full bg-ember/25 blur-[100px] animate-pulse-glow [animation-delay:0.8s]" />
        <div className="absolute -bottom-1/3 right-[5%] w-[700px] h-[700px] rounded-full bg-amber/20 blur-[120px] animate-pulse-glow [animation-delay:2s]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-fjord/15 blur-[80px] animate-pulse-glow [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo with gradient rings */}
        <div className="relative inline-block mb-10 animate-float">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 -m-8 sm:-m-10 rounded-full animate-spin-slow">
            <div className="w-full h-full rounded-full" style={{
              background: "linear-gradient(#0C0A09, #0C0A09) padding-box, linear-gradient(135deg, #E8A435, #D4763A, #326CE5, #E8A435) border-box",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Inner reverse-spinning ring */}
          <div className="absolute inset-0 -m-4 sm:-m-5 rounded-full animate-spin-slow-reverse">
            <div className="w-full h-full rounded-full" style={{
              background: "linear-gradient(#0C0A09, #0C0A09) padding-box, linear-gradient(135deg, #326CE5, #E8A435, #D4763A, #326CE5) border-box",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Warm glow behind icon */}
          <div className="absolute inset-0 -m-10 rounded-full bg-ember/25 blur-[50px] animate-pulse-glow" />

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

        {/* Text content */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ember via-amber to-ember mb-3">
          Cloud Native Nordics
        </h1>
        <p className="text-lg sm:text-xl font-heading font-semibold text-gray-300 mb-10 max-w-2xl mx-auto">
          Connecting cloud native communities across the Nordics
        </p>

        {/* Member counter */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-ember/30">
          <span className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-ember to-amber">
            <AnimatedCounter target={totalMembers} suffix="+" />
          </span>
          <span className="text-gray-400 text-sm">community members</span>
        </div>
      </div>

    </section>
  );
}
