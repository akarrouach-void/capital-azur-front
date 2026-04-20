export const button = {
	base: "inline-flex justify-center gap-2 animate focus:outline-none",
	disabled: "opacity-50 cursor-not-allowed",
	pill: "rounded-full",
	icon: "flex items-center gap-2",
	size: {
		small: "px-2 py-1 text-sm",
		normal: "text-sm font-medium leading-[21px] px-5 py-3",
		large: "px-8 py-3 text-lg",
		xlarge: "px-10 py-5 text-3xl",
	},
	variant: {
		primary:
			"items-center text-white bg-primary-500 border border-primary-500 rounded-md hover:bg-white hover:text-primary-500 h-11",
		secondary:
			"items-center text-gray-900 bg-gray-200 border border-gray-200 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 hover:text-white h-11",
		danger:
			"items-center text-white bg-error-500 border border-error-500 rounded-md hover:bg-error-800 focus:ring-2 focus:ring-error-500 focus:ring-opacity-50 h-11",
		white:
			"items-center text-black bg-white border border-gray-100 rounded-md hover:bg-gray-200 hover:border-gray-200 h-11",
		toolBox:
			"relative items-center w-full text-sm font-bold text-primary-500 bg-white rounded-md hover:bg-primary-500 hover:text-white",
		roundedAddonAfter:
			"text-white bg-primary-600 border border-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 hover:text-white rounded-r-md",
		roundedAddonBefore:
			"text-white bg-primary-600 border border-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 hover:text-white rounded-l-md",
		inputDate:
			"justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0",
		chevronIconInputDate: "border text-primary-500 bg-gray-500",
		headerDate: "border bg-gray-500 hover:text-primary-500",
		gradient:
			"flex items-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg hover:scale-[1.02] shadow-lg hover:shadow-xl",
		filter: "items-center text-gray-500 p-0 hover:text-gray-700",
	},
	outlineVariant: {
		primary:
			"text-primary-500 bg-transparent border-primary-500 hover:bg-primary-500 hover:text-white",
		secondary:
			"text-gray-600 bg-transparent border-gray-200 hover:text-white hover:bg-gray-200",
		danger:
			"text-error-500 bg-transparent border-error-500 hover:text-white hover:bg-error-500",
	},
}
