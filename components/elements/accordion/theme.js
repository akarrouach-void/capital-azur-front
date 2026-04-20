// paragraph_accordion
export const accordion = {
	default: {
		wrapper: "z-50 overflow-y-hidden",
		element: "mb-3 bg-white rounded-xl overflow-hidden shadow-md",
		button: {
			base: "flex items-center justify-between w-full px-5 py-4 text-base font-medium",
			inactive: "text-primary-900 bg-primary-100 hover:bg-primary-200 animate",
			active: "text-white bg-primary-700",
			icon: {
				base: "animate",
				inactiveId: "plus",
				activeId: "minus",
				width: "16",
				height: "16",
			},
		},
		panel: {
			wrapper: "max-h-[0vh] overflow-hidden animate",
			inactive: "max-h-[0vh]",
			active: "!max-h-[200vh]",
			base: "px-5 py-8 text-sm text-gray-500",
		},
	},
	no_icon: {
		wrapper: "z-50 overflow-y-hidden",
		element: "mb-3",
		button: {
			base: "flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg ltr:text-left rtl:text-right",
			inactive: "text-primary-900 bg-primary-100 hover:bg-primary-200",
			active: "text-primary-100 bg-primary-900 hover:bg-primary-800",
		},
		panel: {
			wrapper: "max-h-[0vh] overflow-hidden animate",
			inactive: "max-h-0",
			active: "max-h-[300vh] py-5 ",
			base: "w-full px-4 overflow-hidden text-sm text-gray-500 transition-all duration-300",
		},
	},
	paragraph_accordion: {
		wrapper: "",
		element: "mb-4 rounded-xl overflow-hidden shadow-md bg-primary-50",
		button: {
			base: "flex items-center justify-between w-full px-5 py-4 text-base font-medium",
			inactive: "text-primary-900 bg-primary-100 hover:bg-primary-200 animate",
			active: "text-white bg-primary-700",
			icon: {
				base: "animate",
				inactiveId: "chevron-down",
				activeId: "chevron-up",
				width: "16",
				height: "16",
			},
		},
		panel: {
			wrapper: "max-h-[0vh] overflow-hidden animate bg-primary-25",
			inactive: "max-h-[0vh]",
			active: "!max-h-[200vh]",
			base: "px-5 py-8 text-sm text-gray-500",
		},
	},
	white: {
		wrapper: "p-4 lg:p-6 pb-2 lg:pb-2 bg-white rounded-xl shadow-lg",
		element: "border border-gray-200 rounded-lg overflow-hidden mb-4",
		button: {
			base: "w-full px-6 py-4 text-left bg-white hover:bg-gray-25 animate flex items-center justify-between",
			inactive: "",
			active: "",
			icon: {
				base: "text-gray-500 animate",
				inactiveId: "chevron-down",
				activeId: "chevron-down",
				inactive: "",
				active: "rotate-180",
				width: "12",
				height: "12",
			},
		},
		panel: {
			wrapper: "overflow-hidden animate",
			inactive: "max-h-0 opacity-0",
			active: "max-h-[200vh] opacity-100",
			base: "px-6 py-4 bg-gray-25 border-t border-gray-200 text-sm",
		},
	},
}
