const defaultTheme = require("tailwindcss/defaultTheme")
let plugin = require("tailwindcss/plugin")

module.exports = {
	mode: "jit",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./themes/**/*.{js,ts,jsx,tsx}",
		"./components/**/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/@vactory/console/src/**/*.{js,jsx,ts,tsx}",
		"../../node_modules/@vactorynext/core/dist/**/*.js",
		"../../node_modules/@vactorynext/core/dist/***/**/*.js",
	],
	darkMode: ["class", '[data-theme="dark"]'],
	corePlugins: {
		preflight: true,
	},
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "var(--container-padding)",
			},
		},
		extend: {
			fontFamily: {
				sans: ["var(--sans-font-family)", ...defaultTheme.fontFamily.sans],
				rtl: ["var(--rtl-font-family)", ...defaultTheme.fontFamily.sans],
			},
			fontWeight: {
				100: "100",
				200: "200",
				300: "300",
				400: "400",
				500: "500",
				600: "600",
				700: "700",
				800: "800",
				900: "900",
			},
			backgroundImage: {
				gradient: "linear-gradient(to right, rgb(37 99 235), rgb(147 51 234))",
			},
			colors: {
				white: "rgb(var(--white) / <alpha-value>)",
				black: "rgb(var(--black) / <alpha-value>)",
				primary: {
					DEFAULT: "rgb(var(--primary) / <alpha-value>)",
					25: "rgb(var(--primary-25) / <alpha-value>)",
					50: "rgb(var(--primary-50) / <alpha-value>)",
					100: "rgb(var(--primary-100) / <alpha-value>)",
					200: "rgb(var(--primary-200) / <alpha-value>)",
					300: "rgb(var(--primary-300) / <alpha-value>)",
					400: "rgb(var(--primary-400) / <alpha-value>)",
					500: "rgb(var(--primary-500) / <alpha-value>)",
					600: "rgb(var(--primary-600) / <alpha-value>)",
					700: "rgb(var(--primary-700) / <alpha-value>)",
					800: "rgb(var(--primary-800) / <alpha-value>)",
					900: "rgb(var(--primary-900) / <alpha-value>)",
				},
				gray: {
					DEFAULT: "rgb(var(--gray) / <alpha-value>)",
					25: "rgb(var(--gray-25) / <alpha-value>)",
					50: "rgb(var(--gray-50) / <alpha-value>)",
					100: "rgb(var(--gray-100) / <alpha-value>)",
					200: "rgb(var(--gray-200) / <alpha-value>)",
					300: "rgb(var(--gray-300) / <alpha-value>)",
					400: "rgb(var(--gray-400) / <alpha-value>)",
					500: "rgb(var(--gray-500) / <alpha-value>)",
					600: "rgb(var(--gray-600) / <alpha-value>)",
					700: "rgb(var(--gray-700) / <alpha-value>)",
					800: "rgb(var(--gray-800) / <alpha-value>)",
					900: "rgb(var(--gray-900) / <alpha-value>)",
				},
				error: {
					DEFAULT: "rgb(var(--error) / <alpha-value>)",
					25: "rgb(var(--error-25) / <alpha-value>)",
					50: "rgb(var(--error-50) / <alpha-value>)",
					100: "rgb(var(--error-100) / <alpha-value>)",
					200: "rgb(var(--error-200) / <alpha-value>)",
					300: "rgb(var(--error-300) / <alpha-value>)",
					400: "rgb(var(--error-400) / <alpha-value>)",
					500: "rgb(var(--error-500) / <alpha-value>)",
					600: "rgb(var(--error-600) / <alpha-value>)",
					700: "rgb(var(--error-700) / <alpha-value>)",
					800: "rgb(var(--error-800) / <alpha-value>)",
					900: "rgb(var(--error-900) / <alpha-value>)",
				},
				warning: {
					DEFAULT: "rgb(var(--warning) / <alpha-value>)",
					25: "rgb(var(--warning-25) / <alpha-value>)",
					50: "rgb(var(--warning-50) / <alpha-value>)",
					100: "rgb(var(--warning-100) / <alpha-value>)",
					200: "rgb(var(--warning-200) / <alpha-value>)",
					300: "rgb(var(--warning-300) / <alpha-value>)",
					400: "rgb(var(--warning-400) / <alpha-value>)",
					500: "rgb(var(--warning-500) / <alpha-value>)",
					600: "rgb(var(--warning-600) / <alpha-value>)",
					700: "rgb(var(--warning-700) / <alpha-value>)",
					800: "rgb(var(--warning-800) / <alpha-value>)",
					900: "rgb(var(--warning-900) / <alpha-value>)",
				},
				success: {
					DEFAULT: "rgb(var(--success) / <alpha-value>)",
					25: "rgb(var(--success-25) / <alpha-value>)",
					50: "rgb(var(--success-50) / <alpha-value>)",
					100: "rgb(var(--success-100) / <alpha-value>)",
					200: "rgb(var(--success-200) / <alpha-value>)",
					300: "rgb(var(--success-300) / <alpha-value>)",
					400: "rgb(var(--success-400) / <alpha-value>)",
					500: "rgb(var(--success-500) / <alpha-value>)",
					600: "rgb(var(--success-600) / <alpha-value>)",
					700: "rgb(var(--success-700) / <alpha-value>)",
					800: "rgb(var(--success-800) / <alpha-value>)",
					900: "rgb(var(--success-900) / <alpha-value>)",
				},
			},
			width: {
				quarter: "calc((100% - (var(--container-gutter) * 3)) / 4)",
				third: "calc((100% - (var(--container-gutter) * 2)) / 3)",
				"2-thirds": "calc((100% - (var(--container-gutter) / 2)) * 2 / 3)",
				half: "calc((100% - var(--container-gutter)) / 2)",
				"3-quarters":
					"calc((100% - (100% - (var(--container-gutter) * 3)) / 4 - var(--container-gutter)))",
			},
			maxWidth: {
				"1/2": "50%",
				"1/3": "33.333333%",
				"2/3": "66.666667%",
				"1/4": "25%",
				"2/4": "50%",
				"3/4": "75%",
				"1/5": "20%",
				"2/5": "40%",
				"3/5": "60%",
				"4/5": "80%",
				"1/6": "16.666667%",
				"2/6": "33.333333%",
				"3/6": "50%",
				"4/6": "66.666667%",
				"5/6": "83.333333%",
				"1/12": "8.333333%",
				"2/12": "16.666667%",
				"3/12": "25%",
				"4/12": "33.333333%",
				"5/12": "41.666667%",
				"6/12": "50%",
				"7/12": "58.333333%",
				"8/12": "66.666667%",
				"9/12": "75%",
				"10/12": "83.333333%",
				"11/12": "91.666667%",
				"12/12": "100%",
			},
			screens: {
				xs: "320px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				xxl: "1400px",
				onlyTablet: { min: "641px", max: "992px" },

				// ...defaultTheme.screens,
				tabUp: "993px",
				tabDown: { max: "992px" },
				// => @media (min-width: 993px) { ... }

				"max-xl": { max: "1279px" },
				// => @media (max-width: 1279px) { ... }

				"max-lg": { max: "1023px" },
				// => @media (max-width: 1023px) { ... }

				"max-md": { max: "767px" },
				// => @media (max-width: 767px) { ... }

				"max-sm": { max: "639px" },
				// => @media (max-width: 639px) { ... }
			},
			keyframes: {
				progress: {
					"0%": { width: "0px" },
					"100%": { width: "100%" },
				},
			},
			animation: {
				progress: "progress 5s ease-in-out infinite",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/forms")({
			strategy: "class",
		}),
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
		plugin(function ({ addComponents, addUtilities, addVariant }) {
			addComponents({
				".container": {
					width: "100%",
					maxWidth: "var(--container-max-width)",
					paddingLeft: "var(--container-padding)",
					paddingRight: "var(--container-padding)",
					marginLeft: "auto",
					marginRight: "auto",
				},
				".container-fluid": {
					width: "100%",
					maxWidth: "var(--container-fluid-max-width)",
					paddingLeft: "var(--container-padding)",
					paddingRight: "var(--container-padding)",
					marginLeft: "auto",
					marginRight: "auto",
				},
			})
			addVariant("not-last-child", "&:not(:last-child)")
			addUtilities({
				'[dir="rtl"] .direction-ltr': {
					direction: "ltr",
				},
				".backface-visible": {
					"backface-visibility": "visible",
				},
				".backface-hidden": {
					"backface-visibility": "hidden",
				},
				".word-break": {
					"word-break": "break-word",
				},
			})
		}),
	],
}
