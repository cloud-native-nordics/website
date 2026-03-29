import Image from "next/image";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  totalMembers: number;
}

export function Hero({ totalMembers }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-20 sm:py-28">
      {/* Animated aurora blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-brand-gold/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-brand-gold/15 blur-[100px] animate-pulse-glow [animation-delay:1.5s]" />
        <div className="absolute -bottom-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-pink/12 blur-[100px] animate-pulse-glow [animation-delay:0.8s]" />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-brand-blue/15 blur-[80px] animate-pulse-glow [animation-delay:2s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo with gradient rings */}
        <div className="relative inline-block mb-10 animate-float">
          {/* Outer spinning gradient ring */}
          <div className="absolute inset-0 -m-8 sm:-m-10 rounded-full animate-spin-slow">
            <div className="w-full h-full rounded-full border-2 border-transparent" style={{
              background: "linear-gradient(#09090b, #09090b) padding-box, linear-gradient(135deg, #FFB500, #FF6DAF, #326CE5, #FFB500) border-box",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Inner reverse-spinning gradient ring */}
          <div className="absolute inset-0 -m-4 sm:-m-5 rounded-full animate-spin-slow-reverse">
            <div className="w-full h-full rounded-full border border-transparent" style={{
              background: "linear-gradient(#09090b, #09090b) padding-box, linear-gradient(135deg, #326CE5, #FFB500, #FF6DAF, #326CE5) border-box",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "transparent",
            }} />
          </div>

          {/* Glow behind the icon */}
          <div className="absolute inset-0 -m-6 rounded-full bg-brand-blue/20 blur-[40px] animate-pulse-glow" />

          {/* The helm icon */}
          <Image
            src="/logo-icon.svg"
            alt="Cloud Native Nordics"
            width={120}
            height={120}
            className="relative z-10 drop-shadow-[0_0_30px_rgba(50,108,229,0.4)]"
            priority
          />
        </div>

        {/* Text content */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-3">
          Cloud Native Nordics
        </h1>
        <p className="text-lg sm:text-xl font-heading font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-pink mb-10 max-w-2xl mx-auto">
          Connecting cloud native communities across the Nordics
        </p>

        {/* Member counter */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-brand-gold/30">
          <span className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-pink">
            <AnimatedCounter target={totalMembers} suffix="+" />
          </span>
          <span className="text-gray-400 text-sm">community members</span>
        </div>
      </div>
    </section>
  );
}
