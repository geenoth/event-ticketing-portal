import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Favicon SVG (Glowing heart inside luxury rounded container)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2a0818" />
      <stop offset="100%" stop-color="#0a050d" />
    </radialGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#fb7185" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fda4af" />
      <stop offset="50%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect x="4" y="4" width="120" height="120" rx="32" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="4" />
  <circle cx="64" cy="62" r="32" fill="#f43f5e" opacity="0.35" filter="url(#glow)" />
  <path d="M64 94 C64 94 24 70 24 46 C24 33 34 24 46 24 C54 24 60 28 64 34 C68 28 74 24 82 24 C94 24 104 33 104 46 C104 70 64 94 64 94 Z"
        fill="url(#heartGrad)" filter="url(#glow)" />
  <path d="M96 24 L98 32 L106 34 L98 36 L96 44 L94 36 L86 34 L94 32 Z" fill="#fef08a" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);

// 2. SURPRISE OpenGraph Card SVG (1200 x 630 px)
// Completely SPOILER-FREE! Designed as a mysterious sealed luxury envelope with wax heart seal & sparkles
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180a1c" />
      <stop offset="50%" stop-color="#0b050f" />
      <stop offset="100%" stop-color="#1f091a" />
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="48%" r="55%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#f43f5e" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="goldGlow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="35%" stop-color="#f43f5e" />
      <stop offset="70%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <linearGradient id="envelopeFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#241328" />
      <stop offset="100%" stop-color="#180b1b" />
    </linearGradient>

    <linearGradient id="envelopeFlap" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#351a3a" />
      <stop offset="100%" stop-color="#220e26" />
    </linearGradient>

    <radialGradient id="waxSeal" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="40%" stop-color="#e11d48" />
      <stop offset="90%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4c0519" />
    </radialGradient>

    <linearGradient id="buttonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="50%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <filter id="shadowHeavy" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity="0.95" />
    </filter>

    <filter id="sealGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />
  <rect width="1200" height="630" fill="url(#centerGlow)" />
  <rect width="1200" height="630" fill="url(#goldGlow)" />

  <!-- Outer Decorative Border Frame -->
  <rect x="30" y="30" width="1140" height="570" rx="36" fill="none" stroke="url(#goldBorder)" stroke-width="1.8" stroke-opacity="0.4" />
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="none" stroke="#f43f5e" stroke-width="0.8" stroke-opacity="0.2" />

  <!-- Star Sparkles in Background -->
  <g fill="#fef08a" opacity="0.75">
    <path d="M160 140 L163 150 L173 153 L163 156 L160 166 L157 156 L147 153 L157 150 Z" />
    <path d="M1020 180 L1023 190 L1033 193 L1023 196 L1020 206 L1017 196 L1007 193 L1017 190 Z" />
    <path d="M220 480 L222 487 L229 489 L222 491 L220 498 L218 491 L211 489 L218 487 Z" opacity="0.6" />
    <path d="M980 460 L982 467 L989 469 L982 471 L980 478 L978 471 L971 469 L978 467 Z" opacity="0.6" />
    <circle cx="280" cy="200" r="2.5" fill="#fbcfe8" />
    <circle cx="920" cy="260" r="3" fill="#fbcfe8" />
    <circle cx="850" cy="140" r="2" fill="#fed7aa" />
    <circle cx="340" cy="450" r="2" fill="#fed7aa" />
  </g>

  <!-- Top Kicker Pill: "A SPECIAL SURPRISE · FOR YOU" -->
  <g transform="translate(600, 75)">
    <rect x="-180" y="0" width="360" height="42" rx="21" fill="#f43f5e" fill-opacity="0.16" stroke="#f43f5e" stroke-opacity="0.5" stroke-width="1.5" />
    <text x="0" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="#fda4af" text-anchor="middle">
      💌 A SPECIAL SURPRISE FOR YOU
    </text>
  </g>

  <!-- Main Romantic Header (Zero Spoilers!) -->
  <text x="600" y="175" font-family="'Georgia', serif" font-size="52" font-weight="600" fill="#fff1f2" text-anchor="middle" letter-spacing="-0.5">
    I have a surprise for you...
  </text>
  <text x="600" y="215" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="300" fill="#fecdd3" text-anchor="middle" letter-spacing="0.5">
    A little something made with all my love. Tap below to see what's inside ✨
  </text>

  <!-- CENTER: Elegant Luxury Sealed Wax Envelope Graphic -->
  <g transform="translate(600, 360)">
    <!-- Envelope Shadow & Base -->
    <rect x="-240" y="-100" width="480" height="220" rx="20" fill="url(#envelopeFront)" stroke="#f43f5e" stroke-opacity="0.35" stroke-width="1.5" filter="url(#shadowHeavy)" />

    <!-- Envelope bottom fold lines -->
    <path d="M-240 120 L-20 10 L240 120" stroke="#f43f5e" stroke-opacity="0.25" stroke-width="1.5" fill="none" />
    <path d="M-240 -100 L-40 40 L-240 120" stroke="#f43f5e" stroke-opacity="0.15" stroke-width="1" fill="#1b0c1e" fill-opacity="0.5" />
    <path d="M240 -100 L40 40 L240 120" stroke="#f43f5e" stroke-opacity="0.15" stroke-width="1" fill="#1b0c1e" fill-opacity="0.5" />

    <!-- Envelope Flap (Triangle pointing down to wax seal) -->
    <polygon points="-240,-100 0,40 240,-100" fill="url(#envelopeFlap)" stroke="#fb7185" stroke-opacity="0.3" stroke-width="1.5" />

    <!-- Wax Seal Ambient Glow -->
    <circle cx="0" cy="40" r="50" fill="#f43f5e" opacity="0.4" filter="url(#sealGlow)" />

    <!-- Red Wax Stamp Seal -->
    <circle cx="0" cy="40" r="38" fill="url(#waxSeal)" stroke="#fda4af" stroke-opacity="0.5" stroke-width="1.5" />
    <circle cx="0" cy="40" r="31" fill="none" stroke="#fb7185" stroke-opacity="0.5" stroke-width="1" stroke-dasharray="3,2" />

    <!-- Heart Symbol inside Wax Seal -->
    <path d="M0 52 C0 52 -16 40 -16 28 C-16 21 -10 16 -3 16 C1 16 4 18 6 21 C8 18 11 16 15 16 C22 16 28 21 28 28 C28 40 12 52 12 52 Z"
          transform="translate(-6, -4)" fill="#fff1f2" />

    <!-- Ribbons extending from seal -->
    <path d="M-10 65 Q-20 90 -45 105" stroke="#e11d48" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />
    <path d="M10 65 Q20 90 45 105" stroke="#e11d48" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />

    <!-- Label on Envelope -->
    <text x="0" y="-35" font-family="'Georgia', serif" font-style="italic" font-size="22" fill="#fbcfe8" text-anchor="middle">
      "For Someone Very Special"
    </text>
  </g>

  <!-- Bottom CTA Button (Zero Spoilers!) -->
  <g transform="translate(600, 545)">
    <rect x="-190" y="-22" width="380" height="46" rx="23" fill="url(#buttonGrad)" />
    <text x="0" y="7" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" letter-spacing="1" fill="#0f0714" text-anchor="middle">
      TAP TO OPEN YOUR SURPRISE 💌
    </text>
  </g>
</svg>`;

async function run() {
  console.log('Generating surprise OpenGraph card...');

  fs.writeFileSync(path.join(publicDir, 'og-preview.svg'), ogSvg);

  // Convert SVG to high-quality 1200x630 PNG (Standard for WhatsApp / iMessage)
  await sharp(Buffer.from(ogSvg))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(publicDir, 'og-preview.png'));
  console.log('Generated public/og-preview.png (1200x630, zero-spoiler surprise design)');

  // Generate Favicon PNGs
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'favicon-192x192.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Generated all assets successfully!');
}

run().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
