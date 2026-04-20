export const sliderTheme = {
	default: {
		wrapper: "relative lg:px-10 mb-8",
		slider: "",
		arrows: {
			wrapper: "",
			button:
				"text-white inline-flex justify-center items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-8 h-8 hover:text-gray-500 transition absolute -bottom-10 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 p-1",
			prev: "left-0",
			next: "right-0",
		},
		dots: {
			wrapper:
				"flex items-center justify-center absolute -bottom-8 left-0 right-0 gap-x-2",
			dot: "rounded-full w-3 h-3",
			dotNotActive: "bg-gray-300",
			dotActive: "active bg-primary-500",
		},
	},
	fullBackground: {
		wrapper: "relative",
		slider: "",
		arrows: {
			wrapper: "",
			button:
				"bg-gray-50/20 hover:bg-gray-50/40 group absolute z-50 items-center justify-center hidden w-11 h-11 transform -translate-y-1/2 rounded-full flex top-1/2 animate",
			prev: "left-5",
			next: "right-5",
		},
		dots: {
			wrapper:
				"absolute flex items-center transform -translate-x-1/2 bottom-6 left-1/2 rtl:translate-x-1/2 gap-x-3",
			dot: "w-5 h-2 rounded shadow",
			dotNotActive: "bg-gray-300",
			dotActive: "active bg-white",
		},
	},
	sliderImageBgVideo: {
		wrapper: "relative",
		slider: "",
		arrows: {
			wrapper: "",
			button:
				"bg-transparent group absolute z-50 items-center justify-center hidden w-11 h-11 transform -translate-y-1/2 border-2 border-gray-500 border-opacity-50 hover:border-transparent rounded-full md:flex top-1/2 transition-all hover:bg-black hover:bg-opacity-70 before:transition-all before:absolute before:content-[''] before:w-full before:border-b-2 before:border-white hover:before:w-2/6",
			prev: "left-5 before:left-1/2 hover:before:left-4",
			next: "right-5 before:right-1/2 hover:before:right-4",
		},
		dots: {
			wrapper: "absolute flex items-center bottom-5 right-5 gap-x-4",
			dot: "rounded-full w-4 h-4",
			dotNotActive: "bg-gray-200",
			dotActive: "active bg-primary-500",
		},
	},
	// cards aside wip
	cardsAside: {
		wrapper: "relative",
		slider: "ms-12",
		arrows: {
			wrapper: "",
			button: "absolute",
			prev: "top-0",
			next: "top-10",
		},
		dots: {
			wrapper: "",
			dot: "",
			dotNotActive: "",
			dotActive: "",
		},
	},
	vertical: {
		wrapper: "relative",
		slider: "h-full",
		arrows: {
			wrapper: "",
			button:
				"inline-flex justify-center items-center w-10 h-10 text-white bg-white/30 hover:bg-white/50 transition absolute left-1/2 -translate-x-1/2 rounded-full z-10",
			prev: "top-5",
			next: "bottom-5",
		},
		dots: {
			wrapper: "",
			dot: "",
			dotNotActive: "",
			dotActive: "",
		},
	},
}
