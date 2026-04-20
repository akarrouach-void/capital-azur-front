export const badge = {
	default: {
		wrapper: "inline-flex items-center font-medium rounded-3xl",
		size: {
			xsmall: "px-2.5 py-0.5 text-xs",
			small: "px-3 py-2 text-sm",
			normal: "px-3 py-1 text-sm",
		},
		icon: "w-3 h-3 mr-2",
		color: "text-primary-600 bg-primary-100",
	},
	ribbon: {
		wrapper:
			"inline-flex items-center font-medium rounded absolute -left-[10px] top-2 before:absolute before:content-[''] before:bottom-[-10px] before:left-0 before:border-t-[13px] before:border-l-[11px] before:border-t-primary-700 before:border-l-transparent before:z-[1]",
		size: {
			xsmall: "px-2.5 py-0.5 text-xs",
			small: "px-3 py-2 text-sm",
			normal: "px-3 py-[2px] text-sm",
		},
		icon: "w-3 h-3 mr-2",
		color: "text-white bg-primary-500",
	},
	inline: {
		wrapper: "inline-flex items-center font-medium rounded-3xl",
		size: {
			xsmall: "text-xs",
			small: "text-sm",
			normal: "text-base",
		},
		icon: "w-3 h-3 mr-2",
		color: "text-primary-600 hover:text-primary-300",
	},
}
