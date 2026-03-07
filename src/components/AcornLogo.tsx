import acornLogoSrc from '../assets/acorn-logo.png';

export function AcornLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src={acornLogoSrc}
      alt="Gérard AI"
      className={className}
      draggable={false}
    />
  );
}
