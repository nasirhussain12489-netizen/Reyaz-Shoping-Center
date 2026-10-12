import React, { useState, useRef, useEffect } from 'react';

interface ReyazLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  showTextBeside?: boolean;
  onClick?: () => void;
  onLongPressFiveSeconds?: () => void;
}

/**
 * 100% Background-Removed (Transparent) Vector Recreation of the REYAZ Logo & Icon:
 * - Click (< 5s): Refreshes the page / storefront (`onClick`)
 * - Press & Hold for 5 Seconds (5000ms): Opens the Admin Login Page (`onLongPressFiveSeconds`)
 */
export const ReyazLogo: React.FC<ReyazLogoProps> = ({
  size = 'md',
  theme = 'light',
  showTextBeside = true,
  onClick,
  onLongPressFiveSeconds,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const longPressTriggeredRef = useRef<boolean>(false);

  const clearHoldTimers = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current)
        window.clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only primary mouse button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    longPressTriggeredRef.current = false;

    if (!onLongPressFiveSeconds) return;

    holdStartTimeRef.current = Date.now();
    setIsHolding(true);
    setHoldProgress(0);

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / 5000) * 100));
      setHoldProgress(pct);
    }, 80);

    holdTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      clearHoldTimers();
      onLongPressFiveSeconds();
    }, 5000);
  };

  const handlePointerUpOrCancel = () => {
    clearHoldTimers();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    onClick?.();
  };

  const dimensions =
    size === 'sm'
      ? 'w-11 h-11'
      : size === 'lg'
      ? 'w-16 h-16'
      : size === 'xl'
      ? 'w-24 h-24'
      : 'w-13 h-13';
  const titleSize =
    size === 'sm'
      ? 'text-base'
      : size === 'lg'
      ? 'text-2xl'
      : size === 'xl'
      ? 'text-3xl'
      : 'text-xl';
  const subSize = size === 'sm' ? 'text-[8px]' : 'text-[9.5px]';

  const inkColor = theme === 'dark' ? '#FFFDF9' : '#0B0B0B';
  const middleRingColor = theme === 'dark' ? '#1E293B' : '#0B0B0B';

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrCancel}
      onPointerLeave={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onContextMenu={(e) => {
        if (onLongPressFiveSeconds) {
          e.preventDefault();
        }
      }}
      onClick={handleClick}
      className="relative inline-flex items-center gap-3 text-left group cursor-pointer select-none focus:outline-none bg-transparent"
      title="Reyaz Shopping Center — Horanda Alias Ramgarh, Jharkhand (JH) - 822110"
    >
      <div
        className={`${dimensions} relative shrink-0 flex items-center justify-center transition-transform duration-150 group-active:scale-95 bg-transparent`}
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-xs bg-transparent"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="reyazGoldRing"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="25%" stopColor="#E6B84C" />
              <stop offset="50%" stopColor="#B88214" />
              <stop offset="75%" stopColor="#F5CE62" />
              <stop offset="100%" stopColor="#8E5E06" />
            </linearGradient>
            <linearGradient
              id="reyazGoldSwoosh"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="80%"
            >
              <stop offset="0%" stopColor="#FFE885" />
              <stop offset="45%" stopColor="#DDA228" />
              <stop offset="100%" stopColor="#9B6508" />
            </linearGradient>
          </defs>

          {/* Outer Metallic Gold Ring (100% Transparent Background Inside & Outside) */}
          <circle
            cx="120"
            cy="120"
            r="110"
            stroke="url(#reyazGoldRing)"
            strokeWidth="8"
            fill="none"
          />
          {/* Middle Accent Ring */}
          <circle
            cx="120"
            cy="120"
            r="103"
            stroke={middleRingColor}
            strokeWidth="5"
            fill="none"
          />
          {/* Inner Metallic Gold Ring */}
          <circle
            cx="120"
            cy="120"
            r="98"
            stroke="url(#reyazGoldRing)"
            strokeWidth="4"
            fill="none"
          />

          {/* 5-Second Hold Progress Ring */}
          {isHolding && holdProgress > 5 && (
            <circle
              cx="120"
              cy="120"
              r="114"
              stroke="#10B981"
              strokeWidth="6"
              strokeDasharray={`${Math.round((holdProgress / 100) * 716)} 716`}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 120 120)"
            />
          )}

          {/* Bold Serif 'R' Stem & Top Bowl */}
          <path
            d="M66 56 L118 56 C144 56 158 69 158 88 C158 106 144 118 120 120 L114 120 L114 108 L118 108 C133 108 141 100 141 88 C141 75 133 67 116 67 L94 67 L94 138 L106 145 L68 145 L78 138 L78 68 Z"
            fill={inkColor}
          />

          {/* Clothes Hanger + T-Shirt Silhouette inside the 'R' loop */}
          <path
            d="M113 73 C113 69.5 117.5 69.5 117.5 72.5 C117.5 74.5 114.5 75.5 114.5 77.5 M103 84 L114.5 77.5 L126 84"
            stroke={inkColor}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M103 84 L97 91 L103 96 L106 92 L106 111 L123 111 L123 92 L126 96 L132 91 L126 84 L119 84 C117.5 87 111.5 87 110 84 Z"
            fill={inkColor}
          />

          {/* Sweeping 3D Metallic Gold Ribbon Leg of 'R' */}
          <path
            d="M70 55 C88 57 96 76 105 97 C116 121 140 132 183 148 C153 148 130 139 112 118 C98 102 90 74 70 55 Z"
            fill="url(#reyazGoldSwoosh)"
          />
          <path
            d="M108 117 C127 132 146 144 182 149 C158 156 135 147 108 117 Z"
            fill="url(#reyazGoldRing)"
          />

          {/* 3D Golden Shopping Bag on Right */}
          <path
            d="M148 114 L173 112 L179 144 L151 142 Z"
            fill="url(#reyazGoldSwoosh)"
          />
          <path
            d="M173 112 L180 115 L184 144 L179 144 Z"
            fill="#8E5E06"
          />
          {/* Shopping Bag Handles */}
          <path
            d="M155 115 C155 103 166 103 166 114"
            stroke="url(#reyazGoldRing)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M161 114 C161 104 171 104 171 113"
            stroke="#B88214"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bold Serif "REYAZ" Text inside bottom of crest */}
          <text
            x="120"
            y="181"
            textAnchor="middle"
            fontFamily="Playfair Display, Georgia, serif"
            fontWeight="900"
            fontSize="35"
            letterSpacing="1"
            fill={inkColor}
          >
            REYAZ
          </text>

          {/* Golden Swoosh across the 'A' in REYAZ */}
          <path
            d="M139 182 C145 170 156 165 169 164 C158 168 149 173 142 182 Z"
            fill="url(#reyazGoldSwoosh)"
          />
        </svg>
      </div>

      {showTextBeside && (
        <div className="leading-none">
          <div
            className={`font-serif font-extrabold tracking-wide whitespace-nowrap ${titleSize} ${
              theme === 'dark' ? 'text-white' : 'text-[#0D1B2A]'
            }`}
          >
            REYAZ
          </div>
          <div
            className={`font-bold uppercase tracking-[0.18em] mt-1 whitespace-nowrap ${subSize} ${
              theme === 'dark' ? 'text-[#F5CE62]' : 'text-[#B8860B]'
            }`}
          >
            SHOPPING CENTER
          </div>
        </div>
      )}
    </button>
  );
};
