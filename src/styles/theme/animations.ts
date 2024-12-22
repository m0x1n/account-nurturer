export const animations = {
  keyframes: {
    'accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' }
    },
    'accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' }
    },
    'fade-in-up': {
      from: {
        opacity: '0',
        transform: 'translateY(10px)'
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)'
      }
    }
  },
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    'fade-in-up': 'fade-in-up 0.5s ease-out forwards'
  }
};