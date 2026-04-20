const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	darkMode: "class", // 'class' to toggle dark mode via a class
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				darkBackground: "#121212",
				darkText: "#f1f1f1",
				colorTeal: "#0097A7",
				colorOrange: "#FD7702",
				colorOrangeLight: "#FFA07A",
				tealSoft: "#E0F7FA",
				chatBg: "#f5f5f5",
				userMessage: "#0097A7",
				botMessage: "#ffffff",
				voiceActive: "#FF4444",
				voiceInactive: "#666666",
				primary: "#0097A7",
				primaryDark: "#00838F",
				accent: "#FF4444",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				typing: {
					"0%, 100%": { opacity: "0.4" },
					"50%": { opacity: "1" },
				},
				"pulse-ring": {
					"0%": { transform: "scale(0.8)", opacity: "1" },
					"100%": { transform: "scale(2)", opacity: "0" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.3s ease-out forwards",
				typing: "typing 1s infinite",
				"pulse-ring":
					"pulse-ring 1.25s cubic-bezier(0.24, 0, 0.38, 1) infinite",
			},
		},
	},
	plugins: [],
});
