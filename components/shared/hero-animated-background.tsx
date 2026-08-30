import {
  Box,
  Code2,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

export function HeroAnimatedBackground() {
  const icons = [
    { Icon: Smartphone, className: "tech-icon tech-icon-1" },
    { Icon: ShieldCheck, className: "tech-icon tech-icon-2" },
    { Icon: Download, className: "tech-icon tech-icon-3" },
    { Icon: Box, className: "tech-icon tech-icon-4" },
    { Icon: Code2, className: "tech-icon tech-icon-5" },
    { Icon: Sparkles, className: "tech-icon tech-icon-6" },
  ];

  return (
    <div
      className="hero-animated-bg absolute inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      <div className="hero-tech-glow" />

      <div className="hero-wave hero-wave-left">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero-wave hero-wave-right">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />

      <div className="hero-tech-particles">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="hero-floating-icons">
        {icons.map(({ Icon, className }, index) => (
          <div key={index} className={className}>
            <Icon className="h-5 w-5" />
          </div>
        ))}
      </div>

      <div className="hero-center-mask" />
      <div className="hero-bottom-fade" />
    </div>
  );
}
