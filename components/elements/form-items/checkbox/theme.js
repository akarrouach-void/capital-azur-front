export const checkbox = {
	default: {
		wrapper: "flex items-center gap-x-2",
		input:
			"h-5 w-5 rounded shrink-0 p-0.5 flex items-center justify-center transition duration-200",
		checked: {
			enabled: "bg-primary-200 cursor-pointer hover:ring-2 hover:ring-primary-300",
			disabled: "bg-gray-300 cursor-not-allowed",
		},
		unchecked: {
			enabled: "border border-gray-300 cursor-pointer",
			disabled: "border border-gray-300 cursor-not-allowed",
		},
		label: {
			enabled: "text-left text-sm",
			disabled: "text-left text-sm text-gray-300",
		},
		icon: "h-3 w-3 text-primary-700",
		errorMessage: "error-message",
		description: "text-sm text-gray-400 mt-1",
	},
}
