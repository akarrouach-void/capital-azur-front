export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		extra_field: {
			title: "Featured Items",
			content: "Explore our featured items",
			cta: {
				title: "View All",
				url: "/view-all",
			},
		},
		components: [
			{
				title: "Item 1",
				content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				link: {
					title: "Learn More",
					url: "/item-1",
				},
			},
			{
				title: "Item 2",
				content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				link: {
					title: "Discover",
					url: "/item-2",
				},
			},
			{
				title: "Item 3",
				content:
					"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
				link: {
					title: "Explore",
					url: "/item-3",
				},
			},
			// Add more items as needed
		],
	},
}
