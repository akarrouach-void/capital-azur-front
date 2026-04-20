export const alert = {
	wrapper: {
		full: "w-full rounded flex items-center justify-between px-6 py-4 fixed right-0 top-0 z-50",
		contained:
			"w-[calc(100%-2rem)] rounded flex items-center justify-between px-6 py-4 fixed right-0 left-0 mx-auto top-2 z-50",
	},
	animation: {
		enter: "transform ease-out duration-300 transition",
		enterFrom:
			"translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2 sm:rtl:-translate-x-2",
		enterTo: "translate-y-0 opacity-100 sm:translate-x-0",
		leave: "transition ease-in duration-100",
		leaveFrom: "opacity-100",
		leaveTo: "opacity-0",
	},
	variant: {
		info: "bg-primary-100 flex items-center text-primary-600 border border-primary-300",
		danger: "bg-error-100 text-error-600 border border-error-300",
		success: "bg-success-100 text-success-600 border border-success-300",
		warning: "bg-warning-100 text-warning-600 border border-warning-300",
	},
	icon: "w-4 h-4",
}
