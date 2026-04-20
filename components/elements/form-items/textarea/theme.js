export const textarea = {
	default: {
		base: "relative w-full px-3 py-3 text-sm border border-gray-300 focus:ring-0 focus:border-warning-300",
		label: "inline-block mb-1 text-sm font-medium text-gray-700",
		description: "text-sm text-gray-400 mt-1",
		counter: "absolute text-sm bottom-2 right-2",
		resize: "resize-none",
		errorMessage: "error-message",
		hasError:
			"border border-error-500 hover:border-error-600 focus-within:ring-error-400",
	},
	rounded: {
		base: "relative w-full px-3 py-3 text-sm border border-gray-300 rounded-md focus:ring-0 focus:border-warning-300",
		label: "mb-2 text-sm font-medium text-gray-700",
		description: "mt-1 text-sm text-gray-400",
		counter: "absolute text-sm bottom-2 right-2",
		resize: "resize-none",
		errorMessage: "error-message",
		hasError:
			"border border-error-500 hover:border-error-600 focus-within:ring-error-400",
	},
}
