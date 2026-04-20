export const select = {
	default: {
		groupField: "w-full mb-4",
		label: "inline-block mb-1 text-sm font-medium text-gray-700",
		description: "text-sm text-gray-400 mt-1",
		wrapper: "w-full relative",
		button: {
			base: "relative bg-white flex w-full grow rounded-lg overflow-hidden border border-gray-300 hover:border-gray-400 px-3 py-3 text-sm placeholder-gray-500",
			icon: {
				id: "chevron-down",
				width: "20",
				height: "20",
				className:
					"pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center pr-2 right-1",
			},
			hasError: "border border-error-500",
		},
		options: {
			wrapper:
				"absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
			base: "relative cursor-default select-none truncate px-3 py-2",
			active: "bg-primary-100 font-medium",
			inactive: "font-normal text-gray-900",
			icon: {
				id: "check-solid",
				width: "15",
				height: "15",
				className:
					"absolute top-1/2 flex -translate-y-1/2 items-center text-warning-600 ltr:left-3 rtl:right-3",
			},
		},
		animation: {
			enter: "transition ease-in duration-300",
			enterFrom: "opacity-0",
			enterTo: "opacity-100",
			leave: "transition ease-in duration-100",
			leaveFrom: "opacity-100",
			leaveTo: "opacity-0",
		},
	},
	secondary: {
		groupField: "w-full mb-4",
		label: "inline-block mb-1 text-sm font-medium text-gray-700",
		description: "text-sm text-gray-400 mt-1",
		wrapper: "w-full relative",
		button: {
			base: "relative w-full cursor-default truncate rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-warning-300 sm:text-sm",
			icon: {
				id: "chevron-down",
				width: "30",
				height: "30",
				className:
					"pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2",
			},
		},
		options: {
			wrapper:
				"absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
			base: "relative cursor-default select-none truncate py-2 pl-10 pr-4",
			active: "bg-warning-100 font-medium text-warning-900",
			inactive: "font-normal text-gray-900",
			icon: {
				id: "check-solid",
				width: "15",
				height: "15",
				className:
					"absolute top-1/2 flex -translate-y-1/2 items-center text-warning-600 ltr:left-3 rtl:right-3",
			},
		},
		animation: {
			enter: "transition ease-in duration-300",
			enterFrom: "opacity-0 scale-0",
			enterTo: "opacity-100 scale-1",
			leave: "transition ease-in duration-100",
			leaveFrom: "opacity-100",
			leaveTo: "opacity-0",
		},
	},
	inputAddon: {
		groupField: "w-full mb-4",
		label: "inline-block mb-1 text-sm font-medium text-gray-700",
		wrapper: "w-full max-w-xs relative",
		button: {
			base: "relative w-full truncate rounded-md bg-gray-200 py-3 pl-3 pr-10 text-left focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-warning-300 sm:text-sm",
			icon: {
				id: "chevron-down",
				width: "30",
				height: "30",
				className:
					"pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 pt-4",
			},
		},
		options: {
			wrapper:
				"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
			base: "relative cursor-default select-none truncate py-2 pl-4 pr-4",
			active: "bg-warning-100 font-medium text-warning-900",
			inactive: "font-normal text-gray-900",
			icon: {
				id: "d",
				width: "15",
				height: "15",
				className:
					"absolute top-1/2 flex -translate-y-1/2 items-center text-warning-600 ltr:left-3 rtl:right-3",
			},
		},
		animation: {
			enter: "transition ease-in duration-300",
			enterFrom: "opacity-0 scale-0",
			enterTo: "opacity-100 scale-1",
			leave: "transition ease-in duration-100",
			leaveFrom: "opacity-100",
			leaveTo: "opacity-0",
		},
	},
}
