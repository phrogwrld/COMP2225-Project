/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'system-ui',
					'Avenir',
					'Helvetica',
					'Arial',
					'sans-serif',
				],
				body: ['Inter', 'sans-serif'],
				mono: ['Inter', 'sans-serif'],
			},
			colors: {
				black: '#000000',
				dark: '#181920',
				white: '#E8E7E9',
				secondary: '#747579',
				green: '#91dfb8',
				red: '#f48278',
			},
		},
	},
	plugins: [],
};
