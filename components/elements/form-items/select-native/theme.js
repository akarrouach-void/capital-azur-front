export const selectNative = {
	default: {
		wrapper: "flex flex-col md:flex-row md:items-center",
		label: "md:mr-5",
		select:
			"mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-[length:16px] bg-[center_right_8px] bg-no-repeat py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm",
		error: "",
	},
	filter: {
		wrapper: "flex flex-col",
		label: "block text-sm font-medium text-gray-700 mb-2",
		select:
			"block h-11 w-full appearance-none rounded-lg border border-gray-300 bg-[length:16px] bg-[center_right_8px] bg-no-repeat py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500",
		error: "",
	},
}
