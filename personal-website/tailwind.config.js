/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./shared/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            transitionProperty: {
                height: "height",
                width: "width",
                margin: "margin",
            },
            colors: {
                std: "#00CDA1",
                "std-dark": "#1e293b", // gray-800
                "std-darker": "#111827", // gray-900
                "std-light": "#d1d5db",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
