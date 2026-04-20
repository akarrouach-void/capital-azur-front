export const pagination = {
	default: {
		wrapper: "flex items-center justify-center",
		arrow: {
			base: "group w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded border border-transparent hover:border-primary flex shrink-0 items-center justify-center mx-1 sm:mx-2 cursor-pointer",
			disabled: "invisible",
			icon: "w-5 h-5 group-hover:text-primary rtl-icon",
		},
		pager: {
			wrapper: "flex items-center justify-center",
			base: "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex shrink-0 items-center justify-center mx-1 sm:mx-2 cursor-pointer bg-transparent border border-secondary hover:border-primary text-black hover:text-primary rounded",
			active: "!border-primary !text-primary",
		},
	},
	small: {
		wrapper: "flex items-center justify-center md:justify-between py-2",
		arrow: {
			base: "group w-5 h-5 flex shrink-0 items-center justify-center mx-2 cursor-pointer",
			disabled: "invisible",
			icon: "w-4 h-4 group-hover:text-primary rtl-icon",
		},
		pager: {
			wrapper: "flex items-center justify-center",
			base: "w-5 h-5 flex shrink-0 items-center justify-center mx-1 sm:mx-2 cursor-pointer text-gray-800 hover:text-primary",
			active: "!text-primary font-semibold",
		},
	},
	v2: {
		wrapper: "flex items-center justify-center text-sm md:text-lg font-bold lg:gap-5",
		arrow: {
			base: "group/active w-6 h-6 flex items-center justify-center",
			disabled: "group/disabled cursor-not-allowed !text-gray-500 !border-transparent",
			icon: "w-3 h-3 group-hover/active:text-primary-500 group-hover/disabled:!text-gray-500 rtl-icon",
		},
		pager: {
			wrapper: "flex items-center justify-center",
			base: "w-10 h-10 md:w-14 md:h-14 flex shrink-0 items-center justify-center mx-1 sm:mx-2 cursor-pointer bg-transparent border border-primary-500 hover:text-white hover:bg-primary-500 rounded-lg",
			active: "!bg-primary-500 !text-white",
		},
	},
}
