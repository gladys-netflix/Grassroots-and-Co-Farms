import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark-only';
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-10',
  variant = 'full',
  inverted = false,
}) => {
  // Brand colors extracted directly from Grassroots & Co. Farms logo
  const oliveColor = inverted ? '#A3C293' : '#556B48';
  const terraColor = inverted ? '#E07A52' : '#9E4423';
  const ochreColor = inverted ? '#F2BC56' : '#D4952B';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Soil Horizon & Sprout Arch Emblem */}
      <svg
        viewBox="0 0 100 115"
        className="h-full w-auto shrink-0 aspect-[100/115]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Top Rounded Arch Window Frame (Ochre) */}
        <path
          d="M 12 65 L 12 38 A 38 38 0 0 1 88 38 L 88 65 Z"
          stroke={ochreColor}
          strokeWidth="11"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Sprouting Plant inside the arch (Olive) */}
        {/* Central Stem */}
        <path
          d="M 50 64 L 50 20"
          stroke={oliveColor}
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        {/* Left Leaf Shoot */}
        <path
          d="M 50 44 C 36 44 26 38 23 37"
          stroke={oliveColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Right Leaf Shoot */}
        <path
          d="M 50 33 C 64 33 74 38 78 39"
          stroke={oliveColor}
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Middle Soil Strata (Terracotta) */}
        <rect
          x="7"
          y="74"
          width="86"
          height="14"
          rx="3"
          fill={terraColor}
        />

        {/* Bottom Living Earth Foundation (Olive) */}
        <rect
          x="7"
          y="95"
          width="86"
          height="16"
          rx="3"
          fill={oliveColor}
        />
      </svg>

      {/* Brand Typography Lockup */}
      {variant === 'full' && (
        <div className="flex flex-col justify-center leading-none tracking-tight">
          <span
            className="font-serif font-black tracking-wider text-lg sm:text-xl uppercase transition-colors"
            style={{ color: oliveColor, letterSpacing: '0.04em' }}
          >
            Grassroots
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="font-serif font-black text-base sm:text-lg tracking-tight uppercase"
              style={{ color: terraColor }}
            >
              &amp;Co.
            </span>
            <span
              className="font-serif font-black text-base sm:text-lg tracking-wider uppercase"
              style={{ color: ochreColor, letterSpacing: '0.05em' }}
            >
              Farms
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
