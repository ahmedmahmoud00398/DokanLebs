/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          '#080808',
        surface:     '#111111',
        card:        '#161616',
        border:      '#1E1E1E',
        'border-light': '#2A2A2A',
        offwhite:    '#F5F0EC',
        warm:        '#E8DDD5',
        muted:       '#7A7370',
        rose: {
          DEFAULT: '#C9877A',
          light:   '#E0A89D',
          dark:    '#A86E63',
        },
        gold: {
          DEFAULT: '#B8965A',
          light:   '#CFA96E',
        },
        success: '#5A9E72',
        error:   '#D95F5F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,.4)',
        md: '0 8px 24px rgba(0,0,0,.5)',
        lg: '0 20px 60px rgba(0,0,0,.6)',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(.94)' }, to: { opacity: 1, transform: 'scale(1)' } },
        slideRight:{ from: { transform: 'translateX(100%)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeUp:     'fadeUp .5s cubic-bezier(.4,0,.2,1) both',
        fadeIn:     'fadeIn .35s ease both',
        scaleIn:    'scaleIn .35s cubic-bezier(.4,0,.2,1) both',
        slideRight: 'slideRight .3s cubic-bezier(.4,0,.2,1) both',
        float:      'float 3s ease infinite',
        shimmer:    'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
}
