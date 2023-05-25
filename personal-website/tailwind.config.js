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
                'button-std': '#02ab877F',
                'button-std-hover': '#02ab877F',
                'button-std-text': 'black',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
