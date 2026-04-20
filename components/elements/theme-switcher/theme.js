export const themeSwitcher = {
	default: {
		wrapper: "fixed bottom-20 right-7 z-50",
		button:
			"inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary bg-primary-200 text-white hover:bg-primary",
		menu: "z-10 absolute -top-[130px] right-0 overflow-hidden rounded-lg bg-white shadow-md min-w-[180px]",
		icon: "h-5 w-5 text-white",
	},
	inline: {
		wrapper: "relative",
		button:
			"group relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl animate",
		menu: "absolute -bottom-[140px] right-0 z-10 min-w-[180px] overflow-hidden rounded-2xl bg-white backdrop-blur-xl shadow-2xl border border-gray-200 ",
		icon: "h-5 w-5 text-gray-700 group-hover:text-gray-900 animate",
	},
}
