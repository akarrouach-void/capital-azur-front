export const toggle = {
	default: {
		className: "",
		switch: {
			className: "relative inline-flex items-center h-6 rounded-full w-11",
			enabled: "bg-primary-600",
			disabled: "bg-gray-200",
			span: {
				enabled: "translate-x-6 rtl:-translate-x-6",
				disabled: "translate-x-1 rtl:-translate-x-1",
				className: "inline-block w-4 h-4 transform bg-white rounded-full",
			},
		},
	},
}
