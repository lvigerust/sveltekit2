/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true
		},

		extend: {
			fontFamily: {
				sans: ['Inter, ui-sans-serif, system-ui, -apple-system'],
				Display: ['Lexend', 'ui-sans-serif', 'system-ui', '-apple-system'],
				Geist: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system']
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
}
