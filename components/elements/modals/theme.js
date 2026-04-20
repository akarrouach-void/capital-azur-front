export const modal = {
	default: {
		wrapper: "z-[99] inset-0 overflow-y-auto flex justify-center items-center",
		container:
			"block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0",
		background: {
			animation: {
				enter: "ease-out duration-300 opacity-0",
				enterFrom: "ease-out duration-300 opacity-100",
				enterTo: "",
				leave: "ease-in duration-200",
				leaveFrom: "opacity-0",
				leaveTo: "opacity-0",
			},
			wrapper: "fixed inset-0 transition-opacity",
			container: "absolute inset-0 bg-gray-500 opacity-75",
		},
		modal: {
			animation: {
				enter:
					"ease-out duration-300 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
				enterFrom: "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100",
				enterTo: "",
				leaveFrom: "ease-in duration-200",
				leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
			},
			wrapper:
				"bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle max-w-sm w-full sm:p-6",
			buttonContainer: "mt-5 sm:mt-6",
			button:
				"inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm",
		},
	},
}
