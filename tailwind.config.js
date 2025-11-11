/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom colors for match states
                matched: {
                    light: '#d1fae5',
                    DEFAULT: '#10b981',
                    dark: '#059669',
                },
                partial: {
                    light: '#fef3c7',
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                },
                unmatched: {
                    light: '#fee2e2',
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                },
            },
        },
    },
    plugins: [],
}

