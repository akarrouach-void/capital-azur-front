export const inputFile = {
	default: {
		wrapper: "relative flex w-full border border-gray-200 hover:border-gray-300 min-w-0",
		inputWrapper: {
			full: "flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 min-w-0",
			right:
				"flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 min-w-0",
			left: "flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 min-w-0",
			inside:
				"flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 min-w-0",
		},
		label: "text-sm font-medium text-gray-700 pb-1",
		file: "py-2 mx-2 text-gray-400 text-sm flex items-center gap-x-2 overflow-scroll appearance-none",
		addonBefore: "relative bg-gray-200 bg-gray-200 flex items-center max-w-[30%]",
		addonAfter: "relative bg-gray-200 flex items-center max-w-[30%]",
		prefix: "flex items-center pl-3",
		sufix: "flex items-center pr-3",
		errorMessage: "text-xs text-error-600 mt-1",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "text-base text-gray-600 mt-1",
	},
	rounded: {
		wrapper:
			"relative flex w-full border border-gray-200 hover:border-gray-300 rounded-lg",
		inputWrapper: {
			full: "flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 rounded-lg overflow-hidden",
			right:
				"flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 rounded-r-lg overflow-hidden",
			left: "flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 rounded-l-lg overflow-hidden",
			inside:
				"flex grow relative w-full focus-within:ring-1 focus-within:ring-warning-400 overflow-hidden",
		},
		label: "text-sm font-medium text-gray-700 pb-3",
		file: "grow py-2 mx-2 text-gray-400 text-sm flex items-center gap-x-2 overflow-scroll appearance-none",
		addonBefore:
			"relative bg-gray-200 rounded-l-lg bg-gray-200 flex items-center max-w-[30%]",
		addonAfter: "relative bg-gray-200 rounded-r-lg flex items-center max-w-[30%]",
		prefix: "flex items-center pl-3",
		sufix: "flex items-center pr-3",
		errorMessage: "text-xs text-error-600 mt-1",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "text-base text-gray-600 mt-1",
	},
}
