export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		extra_field: {
			title: "Featured Cards",
			content: "Explore our featured services",
			cta: {
				title: "View All",
				url: "/view-all",
			},
		},
		components: [
			{
				icon: "icon-1",
				title: "Service 1",
				content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				link: {
					title: "Learn More",
					url: "/service-1",
				},
			},
			{
				icon: "icon-2",
				title: "Service 2",
				content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				link: {
					title: "Discover",
					url: "/service-2",
				},
			},
			{
				icon: "icon-3",
				title: "Service 3",
				content:
					"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
				link: {
					title: "Explore",
					url: "/service-3",
				},
			},
			// Add more cards as needed
		],
	},
}
