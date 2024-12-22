import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				serif: ['Georgia', 'serif'],
				sans: ['Lato', 'sans-serif'],
			},
			fontSize: {
				'display-xl': ['3.5rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],
				'display-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
				'display': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }],
				'title-lg': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
				'title': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
				'subtitle': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
				'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'body': ['1rem', { lineHeight: '1.5rem' }],
				'caption': ['0.875rem', { lineHeight: '1.25rem' }],
				'small': ['0.75rem', { lineHeight: '1rem' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#1371D6',
					light: '#4C9AFF',
					dark: '#0E4F96',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F5F7F9',
					light: '#FFFFFF',
					dark: '#E1E7EC',
					foreground: '#1E2B3A'
				},
				success: {
					DEFAULT: '#2D7738',
					light: '#E3F1E4',
					dark: '#1E5126',
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: '#F5A300',
					light: '#FFF4D9',
					dark: '#A86E00',
					foreground: '#FFFFFF'
				},
				error: {
					DEFAULT: '#D93F0B',
					light: '#FFEDE6',
					dark: '#982C08',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#D93F0B',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5F7F9',
					foreground: '#6C7884'
				},
				accent: {
					DEFAULT: '#1371D6',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: '#F5F7F9',
					foreground: '#1E2B3A',
					primary: '#1371D6',
					'primary-foreground': '#FFFFFF',
					accent: '#E1E7EC',
					'accent-foreground': '#1E2B3A',
					border: '#CBD5E0',
					ring: '#1371D6'
				}
			},
			spacing: {
				'2xs': '0.125rem',  // 2px
				'xs': '0.25rem',    // 4px
				'sm': '0.5rem',     // 8px
				'md': '1rem',       // 16px
				'lg': '1.5rem',     // 24px
				'xl': '2rem',       // 32px
				'2xl': '2.5rem',    // 40px
				'3xl': '3rem',      // 48px
				'4xl': '4rem',      // 64px
			},
			borderRadius: {
				lg: '0.5rem',
				md: '0.375rem',
				sm: '0.25rem'
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: {
				'primary-gradient': 'linear-gradient(135deg, #1371D6 0%, #0E4F96 100%)',
				'secondary-gradient': 'linear-gradient(135deg, #F5F7F9 0%, #E1E7EC 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;