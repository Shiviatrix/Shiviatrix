/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050505',
        panel: '#0a0a0a',
        accent: '#00fff2',
        limeAccent: '#a8ff60',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 255, 242, 0.4)',
      },
      animation: {
        flicker: 'flicker 3s infinite both',
        'scan-sweep': 'scan 8s linear infinite',
        'particle-drift': 'particle 12s ease-in-out infinite',
        'cursor-blink': 'cursor 1s steps(2, start) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 0.92 },
          '10%': { opacity: 0.6 },
          '30%': { opacity: 0.95 },
          '50%': { opacity: 0.5 },
          '70%': { opacity: 0.9 },
          '90%': { opacity: 0.7 },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        particle: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(5px,-10px,0) scale(1.1)' },
          '100%': { transform: 'translate3d(-5px,10px,0) scale(1)' },
        },
        cursor: {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
