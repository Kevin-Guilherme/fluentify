'use client';

interface LogoProps {
  variant?: 'full' | 'logomark' | 'icon' | 'wordmark';
  className?: string;
  size?: number;
  animate?: boolean;
}

export function Logo({ variant = 'logomark', className = '', size = 40, animate = false }: LogoProps) {
  // Full Logo - Icon + Wordmark + Tagline (landing page, emails)
  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <LogoIcon animate={animate} size={size} />
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-white">Fluentify</span>
          <span className="text-xs text-gray-400">AI Language Learning</span>
        </div>
      </div>
    );
  }

  // Logomark - Icon + Wordmark (navbar, footer, sidebar)
  if (variant === 'logomark') {
    const fontSize = size >= 48 ? 'text-2xl' : 'text-xl';
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoIcon animate={animate} size={size} />
        <span className={`${fontSize} font-bold text-white`}>Fluentify</span>
      </div>
    );
  }

  // Icon Only - Mark isolado (favicon, app icon, splash)
  if (variant === 'icon') {
    return <LogoIcon animate={animate} size={size} className={className} />;
  }

  // Wordmark Only - Texto apenas (menções, documentos)
  if (variant === 'wordmark') {
    return (
      <span className={`text-xl font-extrabold text-white ${className}`}>
        Fluentify
      </span>
    );
  }

  return null;
}

interface LogoIconProps {
  animate?: boolean;
  size?: number;
  className?: string;
}

function LogoIcon({ animate = false, size = 40, className = '' }: LogoIconProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Gradiente Blue to Purple */}
        <defs>
          <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="waveGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Sound Waves - Left (Azul - Captura de voz) */}
        <g className="sound-waves-left">
          {/* Wave 1 - Smallest */}
          <path
            d="M 25 60 Q 20 55, 20 50 Q 20 45, 25 40"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            {animate && (
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Wave 2 - Medium */}
          <path
            d="M 15 65 Q 8 58, 8 50 Q 8 42, 15 35"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          >
            {animate && (
              <animate
                attributeName="opacity"
                values="0.2;0.7;0.2"
                dur="1.5s"
                begin="0.2s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Wave 3 - Largest */}
          <path
            d="M 5 70 Q -3 60, -3 50 Q -3 40, 5 30"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          >
            {animate && (
              <animate
                attributeName="opacity"
                values="0.1;0.6;0.1"
                dur="1.5s"
                begin="0.4s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>

        {/* Microphone - Center (Gradiente Blue→Purple) */}
        <g transform="translate(60, 60)">
          {/* Mic Body */}
          <rect
            x="-12"
            y="-25"
            width="24"
            height="32"
            rx="12"
            fill="url(#micGradient)"
          />

          {/* Mic Grid Lines */}
          <line x1="-8" y1="-15" x2="8" y2="-15" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <line x1="-8" y1="-8" x2="8" y2="-8" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <line x1="-8" y1="-1" x2="8" y2="-1" stroke="white" strokeWidth="1.5" opacity="0.3" />

          {/* Mic Stand */}
          <path
            d="M -12 12 Q -12 20, -5 22 L 5 22 Q 12 20, 12 12"
            stroke="url(#micGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Mic Base */}
          <line x1="-15" y1="25" x2="15" y2="25" stroke="url(#micGradient)" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="22" x2="0" y2="25" stroke="url(#micGradient)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Sound Waves - Right (Roxo - IA respondendo) */}
        <g className="sound-waves-right">
          {/* Wave 1 - Smallest */}
          <path
            d="M 95 60 Q 100 55, 100 50 Q 100 45, 95 40"
            stroke="url(#waveGradientRight)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            {animate && (
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="1.5s"
                begin="0.1s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Wave 2 - Medium */}
          <path
            d="M 105 65 Q 112 58, 112 50 Q 112 42, 105 35"
            stroke="url(#waveGradientRight)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          >
            {animate && (
              <animate
                attributeName="opacity"
                values="0.2;0.7;0.2"
                dur="1.5s"
                begin="0.3s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Wave 3 - Largest */}
          <path
            d="M 115 70 Q 123 60, 123 50 Q 123 40, 115 30"
            stroke="url(#waveGradientRight)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          >
            {animate && (
              <animate
                attributeName="opacity"
                values="0.1;0.6;0.1"
                dur="1.5s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>
      </svg>
    </div>
  );
}
