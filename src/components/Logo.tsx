import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div 
      className="flex items-center gap-4 cursor-pointer group"
      whileHover="hover"
    >
      <svg 
        width="140" 
        height="48" 
        viewBox="0 0 280 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-auto overflow-visible"
      >
        <defs>
          <linearGradient id="symbol-gradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4AF37" /> {/* Champagne/Gold */}
            <stop offset="100%" stopColor="#4A1E5B" /> {/* Deep Purple */}
          </linearGradient>
          
          <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Symbol: Styled 8 / Infinity shape - Vertical Ribbon */}
        <g transform="translate(10, 4) scale(0.85)">
          <path 
            d="M30,25 C45,25 55,35 55,50 C55,65 45,75 30,75 C15,75 5,85 5,100 C5,115 15,125 30,125 C45,125 55,115 55,100 C55,85 45,75 30,75 C15,75 5,65 5,50 C5,35 15,25 30,25 Z" 
            stroke="url(#symbol-gradient)" 
            strokeWidth="10" 
            strokeLinecap="round" 
            fill="none"
            className="opacity-90"
          />
        </g>

        {/* Golden Particle */}
        <motion.circle
          id="logo-particle"
          cx="33"
          cy="68"
          r="3.5"
          fill="#F7E7CE"
          variants={{
            hover: {
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
              filter: [
                "drop-shadow(0 0 2px #F7E7CE)",
                "drop-shadow(0 0 8px #F7E7CE)",
                "drop-shadow(0 0 2px #F7E7CE)"
              ],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          }}
        />

        {/* Text Area */}
        <g transform="translate(75, 20)">
          <text 
            fill="#F7E7CE" 
            fontFamily="Outfit, Inter, sans-serif" 
            fontSize="18" 
            fontWeight="300" 
            letterSpacing="0.08em"
          >
            <tspan x="0" y="5">PORTAL</tspan>
            <tspan x="0" y="26">DA</tspan>
            <tspan x="0" y="47" fontWeight="400">PERMISSÃO</tspan>
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
