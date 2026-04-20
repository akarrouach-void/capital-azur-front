export const dropdown = {
	wrapper: "relative inline-block z-30 w-48",
	button: {
		default: "flex items-center justify-between w-full",
		active: "text-primary-500",
	},
	title: "text-sm",
	listWrapper:
		"relative md:absolute left-0 mt-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
	listItem: {
		default: "group flex w-full items-center rounded-md px-5 py-3",
		active: "text-primary-500",
		inactive: "text-gray-900",
	},
}
