export const inputRadio = {
	default: {
		wrapper: "flex items-center flex-wrap gap-4",
		radioContainer: "flex gap-x-2 items-center",
		input:
			"w-5 h-5 rounded-full flex items-center justify-center p-1 border-2 hover:border-primary-300",
		state: {
			checked: "bg-white border-primary-500",
			unChecked: "border-gray-200",
		},
		icon: "h-full w-full bg-primary-500 rounded-full",
		label: "text-sm font-medium text-gray-700 pb-1",
		errorMessage: "inline-block text-xs text-error-600 mt-1",
		description: "text-sm text-gray-400 mt-1",
	},
}
