import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        unbounded: 'var(--font-unbounded)',
        'roboto-flex': 'var(--font-roboto-flex)',
        'work-sans': 'var(--font-work-sans)',
      },
    },
  },
  plugins: [],
};

export default config;
