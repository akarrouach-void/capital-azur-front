export const input = {
	default: {
		container: "relative mb-4 w-full",
		wrapper:
			"relative flex w-full rounded-lg overflow-hidden border border-gray-300 hover:border-gray-400",
		inputWrapper: {
			full: "relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
			right:
				"relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
			left: "relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
			inside:
				"relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
		},
		label: "inline-block mb-1 text-sm font-medium text-gray-700",
		addonBefore: "bg-gray-200 flex items-center max-w-[30%]",
		addonAfter: "bg-gray-200 flex items-center max-w-[30%]",
		input:
			"w-full px-3 py-3 text-sm placeholder-gray-500 border-none outline-none appearance-none grow focus:ring-0 text-left",
		prefix: "absolute top-0 bottom-0 flex items-center my-auto left-3",
		sufix: "absolute top-0 bottom-0 flex items-center my-auto right-3",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "mt-1 text-sm text-gray-400",
		errorMessage: "error-message",
	},
	listing: {
		container: "relative w-full",
		wrapper:
			"overflow-hidden h-11 relative flex w-full border border-gray-300 rounded-lg hover:border-gray-400",
		inputWrapper: {
			full: "relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
			right:
				"relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
			left: "relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
			inside:
				"relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
		},
		label: "block text-sm font-medium text-gray-700 mb-2",
		addonBefore: "bg-gray-200 flex items-center max-w-[30%]",
		addonAfter: "bg-gray-200 flex items-center max-w-[30%]",
		input:
			"w-full px-3 py-2 text-sm placeholder-gray-500 border-none outline-none appearance-none grow focus:ring-0 text-left",
		prefix: "absolute top-0 bottom-0 flex items-center my-auto left-3",
		sufix: "absolute top-0 bottom-0 flex items-center my-auto right-3",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "mt-1 text-sm text-gray-400",
		errorMessage: "error-message",
	},
	inline: {
		container: "relative w-full",
		wrapper:
			"relative h-11 flex w-full border border-gray-300 rounded-lg hover:border-gray-300",
		inputWrapper: {
			full: "overflow-hidden relative flex w-full rounded-lg grow focus-within:ring-1 focus-within:ring-warning-400",
			right:
				"overflow-hidden relative flex w-full rounded-r-lg grow focus-within:ring-1 focus-within:ring-warning-400",
			left: "overflow-hidden relative flex w-full rounded-l-lg grow focus-within:ring-1 focus-within:ring-warning-400",
			inside:
				"overflow-hidden relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
		},
		label: "mr-6 text-sm font-medium text-gray-700 whitespace-nowrap",
		addonBefore: "bg-gray-200 rounded-l-lg flex items-center max-w-[30%]",
		addonAfter: "bg-gray-200 rounded-r-lg flex items-center max-w-[30%]",
		input:
			"w-full px-3 py-3 text-sm placeholder-gray-500 border-none rounded-md outline-none appearance-none grow focus:ring-0",
		prefix: "flex items-center pl-3 bg-white",
		sufix: "flex items-center pr-3",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "mt-1 text-sm text-gray-400",
		errorMessage: "error-message",
	},
	overlay: {
		container: "relative mb-4 w-full",
		wrapper: "relative flex w-full border-b-2 border-white hover:border-gray-300",
		inputWrapper: {
			full: "relative flex w-full rounded-lg grow",
			right: "relative flex w-full grow",
			left: "relative flex w-full grow",
			inside:
				"relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
		},
		label: "mr-6 text-sm font-medium text-gray-700 whitespace-nowrap",
		addonBefore: "bg-gray-200 rounded-l-lg flex items-center max-w-[30%]",
		addonAfter: "bg-gray-200 rounded-r-lg flex items-center max-w-[30%]",
		input:
			"appearance-none p-3 pl-0 w-full placeholder-white outline-none grow border-none focus:!ring-0 text-white text-sm !bg-transparent",
		prefix: "flex items-center",
		sufix: "flex items-center",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "mt-3 text-sm text-right text-white",
		errorMessage: "error-message",
	},
	search: {
		container: "relative mb-4 w-full",
		wrapper: "relative flex w-full border border-gray-300 hover:border-gray-300",
		inputWrapper: {
			full: "relative flex w-full rounded-lg grow",
			right: "relative flex w-full grow",
			left: "relative flex w-full grow",
			inside:
				"relative flex w-full grow focus-within:ring-1 focus-within:ring-warning-400",
		},
		label: "mr-6 text-sm font-medium text-gray-700 whitespace-nowrap",
		addonBefore: "bg-gray-200 rounded-l-lg flex items-center max-w-[30%]",
		addonAfter: "bg-gray-200 rounded-r-lg flex items-center max-w-[30%]",
		input:
			"appearance-none p-3 w-full placeholder-gray-400 outline-none grow rounded-md border-none focus:!ring-0 text-sm bg-transparent",
		prefix: "flex items-center pl-3",
		sufix: "flex items-center",
		hasError: "border-error-500 hover:border-error-600 focus-within:ring-error-400",
		description: "mt-3 text-sm text-right text-white",
		errorMessage: "error-message",
	},
}
