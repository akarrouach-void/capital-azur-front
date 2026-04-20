export const theme = {
	default: {
		wrapper: "relative w-72",
		button: {
			wrapper:
				"flex items-center justify-between divide-x gap-x-2 truncate relative w-full cursor-default border rounded-lg bg-white py-2 px-3 text-left shadow-md focus:outline-none sm:text-sm",
			resetSelectButton: {
				wrapper: "p-1 hover:bg-gray-100 rounded-full ml-2",
				icon: "w-4 h-4 text-black",
			},
			selectedOptionsCount: "flex items-center text-sm gap-x-0.5",
			selectedOption: {
				wrapper: "flex item-center bg-gray-100 rounded px-2 py-1 gap-x-3",
				optionText: "",
				deleteButton: {
					wrapper: "bg-black p-0.5 rounded-full place-self-center",
					icon: "w-3 h-3 text-white",
				},
			},
		},
		options: {
			wrapper:
				"absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-300 py-1.5 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30",
			option: {
				wrapper: {
					default:
						"relative flex items-center gap-x-1.5 cursor-default select-none py-2 px-3",
					active: "bg-gray-100",
				},
				checkbox: {
					default: "w-5 h-5 border flex justify-center items-center rounded",
					selected: "bg-black",
					unselected: "bg-white",
					icon: "w-3 h-3 text-white",
				},
				optionText: "",
			},
		},
		placeholder: {
			wrapper: "py-1",
			text: "text-gray-700",
		},
	},
}
