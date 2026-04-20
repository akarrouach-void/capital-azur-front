export const tabs = {
	default: {
		wrapper: "bg-white p-2 rounded-xl flex flex-col gap-2",
		listwrapper: "flex p-1 gap-2 bg-primary-700 rounded-[60px] w-full overflow-x-auto",
		title: {
			base: "w-full p-2 text-sm font-medium rounded-[60px] bg-transparent animate whitespace-nowrap outline-none",
			active: "!bg-white shadow text-primary-700",
			inactive: "text-white hover:bg-white hover:text-primary-700",
		},
		panel: "bg-gray-50/60 rounded-lg p-3 text-sm text-gray-700",
	},
	paragraph_tabs: {
		wrapper: "flex flex-col gap-2",
		listwrapper: "flex p-1 gap-2 bg-primary-900 rounded-xl overflow-x-auto",
		title: {
			base: "w-full p-2 text-sm leading-5 font-medium rounded-lg bg-transparent animate whitespace-nowrap outline-none",
			active: "!bg-white shadow text-primary-500",
			inactive: "text-primary-100 hover:bg-white/[0.12] hover:text-white",
		},
		panel:
			"bg-white rounded-xl p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60",
	},
}
