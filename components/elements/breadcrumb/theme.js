export const breadcrumb = {
	default: {
		wrapper: "mb-6",
		list: "flex items-center gap-2",
		listElement: "flex items-center gap-2",
		link: "text-sm text-white hover:text-primary-200 animate",
		nolink: "text-sm text-white",
		linkActive: "text-sm text-white hover:text-primary-200 animate",
		separateIcon: {
			id: "chevron-right",
			width: "10",
			height: "10",
			className: "rtl-icon",
		},
		homeIcon: {
			id: "home",
			width: "30",
			height: "30",
			className: "",
		},
	},
	secondary: {
		wrapper: "",
		list: "flex items-center gap-2",
		listElement: "flex items-center",
		link: "text-base text-gray-500 hover:text-primary-500",
		nolink: "text-base text-gray-500",
		linkActive: "text-base text-error-500 hover:text-gray-700",
		separateIcon: {
			id: "chevron-right",
			width: "15",
			height: "15",
			className: "text-gray-400",
		},
		homeIcon: {
			id: "home",
			width: "30",
			height: "30",
			className: "",
		},
	},
}
