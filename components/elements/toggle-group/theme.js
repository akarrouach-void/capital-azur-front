export const toggleGroup = {
	default: {
		wrapper: {
			base: "flex flex-row gap-1",
			disabled: "opacity-50 pointer-events-none",
		},
		element: {
			base: "flex cursor-pointer flex-row items-center justify-center rounded-md px-4 py-2 opacity-100 ",
			disabled: "pointer-events-none",
			active: "bg-slate-200 opacity-100",
			inactive: "hover:bg-slate-200 hover:opacity-80",
		},
	},
	outline: {
		wrapper: {
			base: "flex flex-row gap-1",
			disabled: "opacity-50 pointer-events-none",
		},
		element: {
			base: "flex cursor-pointer flex-row items-center justify-center rounded-md px-4 py-2 opacity-100 border border-transparent",
			disabled: "pointer-events-none",
			active: " border-primary-400 opacity-100",
			inactive: "hover:border-primary-400 hover:opacity-80",
		},
	},
}
