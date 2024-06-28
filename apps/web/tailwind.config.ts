import type { Config } from 'tailwindcss';
import uiTailwindConfig from 'ui/tailwind.config';

const config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  presets: [uiTailwindConfig],
} satisfies Config;

export default config;
