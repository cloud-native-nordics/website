import Image from "next/image";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  totalMembers: number;
}

export function Hero({ totalMembers }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-gold/90 via-brand-pink/80 to-brand-hotpink/90 py-20 sm:py-28">
      {/* Layered color blobs for depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full bg-brand-gold/40 blur-[140px] animate-pulse-glow" />
        <div className="absolute -top-1/4 right-0 w-[700px] h-[700px] rounded-full bg-brand-pink/30 blur-[120px] animate-pulse-glow [animation-delay:1.2s]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/10 blur-[100px] animate-pulse-glow [animation-delay:0.5s]" />
        <div className="absolute -bottom-1/4 left-[10%] w-[600px] h-[600px] rounded-full bg-brand-gold/30 blur-[100px] animate-pulse-glow [animation-delay:0.8s]" />
        <div className="absolute -bottom-1/3 right-[5%] w-[600px] h-[600px] rounded-full bg-brand-hotpink/30 blur-[120px] animate-pulse-glow [animation-delay:2s]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-brand-blue/15 blur-[80px] animate-pulse-glow [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo with gradient rings */}
        <div className="relative inline-block mb-10 animate-float">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 -m-8 sm:-m-10 rounded-full animate-spin-slow">
            <div className="w-full h-full rounded-full" style={{
              background: "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)) padding-box, linear-gradient(135deg, #FFB500, #ffffff, #326CE5, #FFB500) border-box",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Inner reverse-spinning ring */}
          <div className="absolute inset-0 -m-4 sm:-m-5 rounded-full animate-spin-slow-reverse">
            <div className="w-full h-full rounded-full" style={{
              background: "linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)) padding-box, linear-gradient(135deg, #326CE5, #FFB500, #ffffff, #326CE5) border-box",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Glow behind the icon */}
          <div className="absolute inset-0 -m-10 rounded-full bg-white/30 blur-[50px] animate-pulse-glow" />
          <div className="absolute inset-0 -m-6 rounded-full bg-brand-blue/20 blur-[35px] animate-pulse-glow [animation-delay:1s]" />

          {/* The helm icon */}
          <Image
            src="/logo-icon.svg"
            alt="Cloud Native Nordics"
            width={120}
            height={120}
            className="relative z-10 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            priority
          />
        </div>

        {/* Text content */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-3 drop-shadow-lg">
          Cloud Native Nordics
        </h1>
        <p className="text-lg sm:text-xl font-heading font-semibold text-white/80 mb-10 max-w-2xl mx-auto">
          Connecting cloud native communities across the Nordics
        </p>

        {/* Member counter */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/30">
          <span className="text-3xl font-heading font-bold text-white drop-shadow-md">
            <AnimatedCounter target={totalMembers} suffix="+" />
          </span>
          <span className="text-white/70 text-sm">community members</span>
        </div>
      </div>

      {/* Bottom gradient fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-white dark:from-navy-deep to-transparent" />
    </section>
  );
}
