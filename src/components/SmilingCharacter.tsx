import { motion } from "motion/react";

// Precise visual rendering of 3D gradient-rich golden stars
const FloatingStar = ({
  delay,
  duration,
  x,
  y,
  scale,
}: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  scale: number;
}) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
      className="absolute pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(253,224,71,0.4)]"
      initial={{ opacity: 0, scale: 0, y: 15 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [scale * 0.8, scale * 1.1, scale],
        y: [-10, -40, -70, -100],
        rotate: [0, 45, 90, 180],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="url(#starGrad)"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffeb3b" />
            <stop offset="60%" stopColor="#fbc02d" />
            <stop offset="100%" stopColor="#f57f17" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

// Rich, high-fidelity floating currency bank notes with rotating 3D simulation
const FloatingBill = ({
  delay,
  duration,
  x,
  y,
  scale,
  initialRotation,
}: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  scale: number;
  initialRotation: number;
}) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
      className="absolute pointer-events-none select-none drop-shadow-[0_8px_16px_rgba(34,76,43,0.3)]"
      initial={{ opacity: 0, scale: 0, rotate: initialRotation }}
      animate={{
        opacity: [0, 0.9, 0.9, 0],
        scale: [scale * 0.9, scale, scale * 0.9],
        y: [-25, -90, -155, -220],
        rotate: [initialRotation, initialRotation + 45, initialRotation - 30, initialRotation + 90],
        rotateX: [0, 20, -15, 0],
        rotateY: [0, -30, 45, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    >
      <svg
        width="65"
        height="36"
        viewBox="0 0 65 36"
        fill="url(#billGrad)"
        className="border border-[#3d7a3a]/30 rounded-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="65" height="36" rx="2" fill="url(#billGrad)" />
        {/* Border pattern */}
        <rect x="2" y="2" width="61" height="32" rx="1.5" fill="none" stroke="#529944" strokeWidth="0.75" strokeDasharray="3 2" />
        {/* Center decorative disk */}
        <circle cx="32.5" cy="18" r="7.5" fill="#5fa851" opacity="0.3" stroke="#488c3a" strokeWidth="0.75" />
        {/* Corner numeric values */}
        <text x="5" y="10" fill="#2d5e24" fontSize="5" fontWeight="bold" fontFamily="monospace">$</text>
        <text x="56" y="31" fill="#2d5e24" fontSize="5" fontWeight="bold" fontFamily="monospace">$</text>
        {/* Abstract portrait/emblem outline */}
        <path d="M30 19 C30 16, 35 16, 35 19 C35 22, 30 22, 30 19 Z M28 22 L37 22 L35 24 L30 24 Z" fill="#2d5e24" opacity="0.6" />
        <defs>
          <linearGradient id="billGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#caecb1" />
            <stop offset="50%" stopColor="#92d572" />
            <stop offset="100%" stopColor="#67b243" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export function SmilingCharacter() {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[440px] h-[380px] sm:h-[480px] mx-auto flex items-center justify-center">
      {/* Absolute floating currency notes & stars (replicating the image perfectly) */}
      <FloatingBill delay={0.2} duration={8.5} x="5%" y="22%" scale={1.1} initialRotation={-15} />
      <FloatingBill delay={1.8} duration={10} x="82%" y="12%" scale={0.9} initialRotation={35} />
      <FloatingBill delay={3.5} duration={9} x="2%" y="65%" scale={0.95} initialRotation={-45} />
      <FloatingBill delay={0.8} duration={7.5} x="85%" y="58%" scale={1.05} initialRotation={20} />
      <FloatingBill delay={2.3} duration={11} x="15%" y="85%" scale={0.8} initialRotation={45} />
      <FloatingBill delay={4.1} duration={9.5} x="75%" y="82%" scale={0.85} initialRotation={-25} />
      <FloatingBill delay={1.5} duration={12} x="48%" y="5%" scale={1} initialRotation={10} />

      <FloatingStar delay={0.5} duration={6} x="5%" y="48%" scale={1.2} />
      <FloatingStar delay={2.5} duration={7.5} x="88%" y="30%" scale={0.9} />
      <FloatingStar delay={1.2} duration={8} x="20%" y="8%" scale={1} />
      <FloatingStar delay={3.8} duration={6.5} x="78%" y="70%" scale={1.1} />

      {/* Main Crisp SVG Cartoon Cheering Character with high-fidelity gradients */}
      <svg
        id="character-svg"
        viewBox="0 0 280 340"
        className="w-full h-full drop-shadow-[0_20px_40px_rgba(15,35,18,0.5)] z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe3cb" />
            <stop offset="60%" stopColor="#fec296" />
            <stop offset="100%" stopColor="#e8a06e" />
          </linearGradient>
          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e29f70" />
            <stop offset="100%" stopColor="#be7643" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#434551" />
            <stop offset="40%" stopColor="#212228" />
            <stop offset="100%" stopColor="#141416" />
          </linearGradient>
          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="40%">
            <stop offset="0%" stopColor="#ff8552" />
            <stop offset="50%" stopColor="#ff571f" />
            <stop offset="100%" stopColor="#db3700" />
          </linearGradient>
          <linearGradient id="pufferDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#db4e1d" />
            <stop offset="100%" stopColor="#aa2900" />
          </linearGradient>
          <linearGradient id="glassesFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#1e1e1e" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e08e5b" />
            <stop offset="100%" stopColor="#964b1d" />
          </linearGradient>
          <linearGradient id="teethGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eaeaea" />
          </linearGradient>
          <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff8b8d" />
            <stop offset="100%" stopColor="#e84e51" />
          </linearGradient>
          
          {/* Filter for realistic 3D shadow */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#0d2110" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* --- BODY BACK ELEMENTS --- */}
        {/* Hair Back Volume Silhouette */}
        <path
          d="M 98 126 C 75 120, 80 75, 102 80 C 108 42, 160 38, 180 54 C 205 48, 200 85, 185 102 C 192 112, 188 128, 174 128 Z"
          fill="url(#hairGrad)"
        />

        {/* --- CHEERING ARMS & HANDS (BACK REAR) --- */}
        {/* Left Cheering Arm */}
        <path
          d="M 90 230 C 58 165, 42 140, 34 122 C 24 102, 44 88, 58 102 C 68 112, 88 160, 108 202 Z"
          fill="url(#jacketGrad)"
          stroke="#942301"
          strokeWidth="1.5"
        />
        {/* Left Hand detailed 3D design cheering style */}
        <path
          d="M 34 122 C 24 116, 14 102, 18 92 C 22 84, 32 88, 38 96 C 42 86, 48 84, 52 92 C 55 98, 52 106, 46 112"
          fill="url(#skin)"
          stroke="#b87346"
          strokeWidth="1.5"
        />
        {/* Left Thumb */}
        <path d="M 34 112 Q 25 110, 24 104" fill="none" stroke="#b87346" strokeWidth="1.5" />

        {/* Right Cheering Arm */}
        <path
          d="M 190 230 C 222 165, 238 140, 246 122 C 256 102, 236 88, 222 102 C 212 112, 192 160, 172 202 Z"
          fill="url(#jacketGrad)"
          stroke="#942301"
          strokeWidth="1.5"
        />
        {/* Right Hand detailed 3D design */}
        <path
          d="M 246 122 C 256 116, 266 102, 262 92 C 258 84, 248 88, 242 96 C 238 86, 232 84, 228 92 C 225 98, 228 106, 234 112"
          fill="url(#skin)"
          stroke="#b87346"
          strokeWidth="1.5"
        />
        {/* Right Thumb */}
        <path d="M 246 112 Q 255 110, 256 104" fill="none" stroke="#b87346" strokeWidth="1.5" />

        {/* --- HEAD & NECK --- */}
        {/* Neck */}
        <path d="M 124 186 L 124 212 Q 140 222 156 212 L 156 186 Z" fill="url(#skinShadow)" />
        
        {/* Ears */}
        <circle cx="86" cy="154" r="14" fill="url(#skinShadow)" />
        <circle cx="86" cy="154" r="8" fill="url(#skin)" />
        <circle cx="194" cy="154" r="14" fill="url(#skinShadow)" />
        <circle cx="194" cy="154" r="8" fill="url(#skin)" />

        {/* Round Cute Head/Face (Selected Element path:7) */}
        <path
          id="character-face-element"
          d="M 88 152 C 88 98, 192 98, 192 152 C 192 196, 176 205, 140 205 C 104 205, 88 196, 88 152 Z"
          fill="url(#skin)"
          filter="url(#softShadow)"
        />

        {/* Blush Cheeks */}
        <ellipse cx="104" cy="172" rx="11" ry="8" fill="#ff6b6b" opacity="0.45" />
        <ellipse cx="176" cy="172" rx="11" ry="8" fill="#ff6b6b" opacity="0.45" />

        {/* --- STYLISH UPPER HAIR (FRONT - Beautiful Quiff/Spikes matching the reference) --- */}
        <path
          d="M 88 132 C 78 112, 85 82, 106 88 C 112 55, 152 48, 174 65 C 185 55, 198 75, 190 94 C 198 108, 186 128, 176 128 C 160 118, 150 132, 140 118 C 130 132, 114 118, 88 132 Z"
          fill="url(#hairGrad)"
        />
        {/* Multi-layered vector hair highlights for premium 3D look */}
        <path d="M 115 72 Q 130 54 152 64" fill="none" stroke="#636674" strokeWidth="4" strokeLinecap="round" />
        <path d="M 102 90 Q 115 74 134 82" fill="none" stroke="#636674" strokeWidth="3" strokeLinecap="round" />
        <path d="M 148 76 Q 164 64 178 78" fill="none" stroke="#525461" strokeWidth="3.5" strokeLinecap="round" />

        {/* --- FACE DETAILS --- */}
        {/* Thick Black Cute Eyebrows */}
        <path d="M 96 126 Q 110 115, 125 123" fill="none" stroke="#121315" strokeWidth="5" strokeLinecap="round" />
        <path d="M 155 123 Q 170 115, 184 126" fill="none" stroke="#121315" strokeWidth="5" strokeLinecap="round" />

        {/* Thick Black-Rimmed Glasses (Iconic key element from reference img) */}
        {/* Left Glasses Frame */}
        <rect
          x="92"
          y="131"
          width="43"
          height="35"
          rx="12"
          fill="none"
          stroke="url(#glassesFrameGrad)"
          strokeWidth="6"
        />
        {/* Right Glasses Frame */}
        <rect
          x="145"
          y="131"
          width="43"
          height="35"
          rx="12"
          fill="none"
          stroke="url(#glassesFrameGrad)"
          strokeWidth="6"
        />
        {/* Connective Bridge */}
        <path d="M 132 146 L 148 146" stroke="#111111" strokeWidth="6.5" strokeLinecap="round" />
        {/* Side Arms */}
        <path d="M 92 146 L 76 142" stroke="#111111" strokeWidth="6" strokeLinecap="round" />
        <path d="M 188 146 L 204 142" stroke="#111111" strokeWidth="6" strokeLinecap="round" />

        {/* Glasses Dynamic Lens Glare/Reflection details */}
        <path d="M 96 135 L 115 135" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
        <path d="M 149 135 L 168 135" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
        <path d="M 96 140 L 104 140" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M 149 140 L 157 140" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* Laughing/Squeezing Closed Eyes (as in screenshot) */}
        <path d="M 101 149 Q 113.5 139, 126 149" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />
        <path d="M 154 149 Q 166.5 139, 179 149" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />

        {/* Cute Little Button Nose */}
        <path d="M 135 163 Q 140 168 145 163" fill="none" stroke="#bd7748" strokeWidth="3" strokeLinecap="round" />

        {/* Super Happy Laughing Wide Open 3D Mouth */}
        <path d="M 110 171 Q 140 216, 170 171 Z" fill="#881516" />
        {/* Perfect White Teeth Arch */}
        <path d="M 113 172 Q 140 181, 167 172 L 165 178 Q 140 186, 115 178 Z" fill="url(#teethGrad)" />
        {/* Soft Pink Tongue */}
        <path d="M 123 194 Q 140 185, 157 194 Q 149 213, 133 213 Z" fill="url(#tongueGrad)" />
        {/* Mouth Dark Outlining for depth */}
        <path d="M 110 171 Q 140 216, 170 171" fill="none" stroke="#4a0809" strokeWidth="2.5" strokeLinecap="round" />


        {/* --- CLOTHING (WHITE SHIRT & ORANGE PUFFER JACKET) --- */}
        {/* White T-Shirt Neck Collar Block */}
        <path d="M 118 206 C 118 206, 118 226, 140 226 C 162 226, 162 206, 162 206 Z" fill="#eaeaea" />
        <path d="M 118 212 C 118 212, 118 235, 140 235 C 162 235, 162 212, 162 212 Z" fill="#ffffff" />

        {/* Under T-Shirt Torso Base Fabric */}
        <path d="M 112 228 L 168 228 L 175 315 L 105 315 Z" fill="#ffffff" />

        {/* Puffer Jacket - Left Panel & Thick Puffed Sleeve (Selected Element path:25) */}
        <path
          id="character-puffer-jacket-left"
          d="M 108 208 C 95 210, 85 225, 87 245 C 87 255, 93 265, 93 265 L 105 315 L 118 315 C 118 315, 113 245, 113 226 Z"
          fill="url(#jacketGrad)"
          stroke="#9e2800"
          strokeWidth="1.5"
        />
        {/* Highlight Curve on Puffer Left Sleeve */}
        <path d="M 94 220 Q 98 235 108 226" fill="none" stroke="#ffa27c" strokeWidth="1.5" opacity="0.6" />
        
        {/* Puffer segment lines left panel */}
        <path d="M 87 240 Q 100 242 113 234" fill="none" stroke="url(#pufferDark)" strokeWidth="2.5" />
        <path d="M 89 265 Q 101 268 114 258" fill="none" stroke="url(#pufferDark)" strokeWidth="2.5" />
        <path d="M 92 290 Q 103 293 115 285" fill="none" stroke="url(#pufferDark)" strokeWidth="2.5" />

        {/* Puffer Jacket - Right Panel & Thick Puffed Sleeve */}
        <path
          d="M 172 208 C 185 210, 195 225, 193 245 C 193 255, 187 265, 187 265 L 175 315 L 162 315 C 162 315, 167 245, 167 226 Z"
          fill="url(#jacketGrad)"
          stroke="#9e2800"
          strokeWidth="1.5"
        />
        {/* Highlight Curve on Puffer Right Sleeve */}
        <path d="M 186 220 Q 182 235 172 226" fill="none" stroke="#ffa27c" strokeWidth="1.5" opacity="0.6" />

        {/* Puffer segment lines right panel */}
        <path d="M 193 240 Q 180 242 167 234" fill="none" stroke="url(#pufferDark)" strokeWidth="2.5" />
        <path d="M 191 265 Q 179 268 166 258" fill="none" stroke="url(#pufferDark)" strokeWidth="2.5" />
        <path d="M 188 290 Q 177 293 165 285" fill="none" stroke="url(#pufferDark)" strokeWidth="2.5" />

        {/* Extra Thick round stylish Puffy hoodie collars */}
        <path
          d="M 108 212 C 103 218, 107 244, 116 248 C 124 252, 128 242, 125 228 Z"
          fill="url(#jacketGrad)"
          stroke="#aa2c00"
          strokeWidth="1"
        />
        <path
          d="M 172 212 C 177 218, 173 244, 164 248 C 156 252, 152 242, 155 228 Z"
          fill="url(#jacketGrad)"
          stroke="#aa2c00"
          strokeWidth="1"
        />

        {/* Hoodie Drawstrings with tiny 3D matching knots */}
        <path d="M 114 235 Q 112 258 116 268" fill="none" stroke="#cfebdf" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="116" cy="270" r="3.5" fill="#e8ca2c" />
        <path d="M 166 235 Q 168 258 164 268" fill="none" stroke="#cfebdf" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="164" cy="270" r="3.5" fill="#e8ca2c" />

        {/* --- LEGS & SHOES (Fitted to Frame) --- */}
        {/* Dark Gray Premium Pants */}
        <path d="M 112 315 L 138 315 L 136 345 L 115 345 Z" fill="#2d2f36" />
        <path d="M 142 315 L 168 315 L 165 345 L 144 345 Z" fill="#2d2f36" />

        {/* Shoes bottoms sticking out of frame with 3D shadows */}
        <path d="M 111 340 L 138 340 C 138 340, 141 346, 137 350 C 131 354, 111 354, 111 348 Z" fill="url(#shoeGrad)" />
        <path d="M 111 347 Q 125 351, 137 347" fill="none" stroke="#fcfcfc" strokeWidth="2" />

        <path d="M 142 340 L 167 340 C 167 340, 170 346, 166 350 C 160 354, 140 354, 140 348 Z" fill="url(#shoeGrad)" />
        <path d="M 140 347 Q 154 351, 166 347" fill="none" stroke="#fcfcfc" strokeWidth="2" />
      </svg>
    </div>
  );
}
