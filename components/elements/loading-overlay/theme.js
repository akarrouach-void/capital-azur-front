export const spinner = {
	default: {
		wrapper: "flex items-center justify-center ",
		loader: "w-16 h-16 border-b-2 border-l-2 border-gray-800 rounded-full animate-spin",
	},
}

export const dotsloader = {
	default: {
		wrapper: "flex items-center justify-center py-4",
		dots: "h-2.5 w-2.5 bg-current  rounded-full",
		animation: {
			firstDot: "mr-1 animate-bounce",
			secondeDot: "mr-1 animate-bounce200",
			thirdDot: "animate-bounce400",
		},
	},
}

export const pulse = {
	default: {
		wrapper:
			"border border-primary-300 shadow rounded-md p-4 max-w-sm w-full mx-auto animate-pulse flex space-x-4",
		profileImage: "rounded-full bg-gray-200 h-10 w-10",
		container: {
			wrapper: "flex-1 space-y-6 py-1",
			title: "h-2 bg-gray-200 rounded",
			paragraph: {
				wrapper: "space-y-3",
				line1: {
					wrapper: "grid grid-cols-3 gap-4",
					grid1: "h-2 bg-gray-200 rounded col-span-2",
					grid2: "h-2 bg-gray-200 rounded col-span-1",
				},
				line2: "h-2 bg-gray-200 rounded",
			},
		},
	},
}
