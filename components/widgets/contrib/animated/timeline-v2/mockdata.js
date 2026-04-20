export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				date: "2022-01-01",
				content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: {
							width: "800",
							height: "600",
							alt: "Flowers Image",
							title: "Flowers Image Title",
						},
					},
				],
				link: {
					title: "Learn More",
					url: "/learn-more",
				},
			},
			{
				date: "2022-02-01",
				content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: {
							width: "800",
							height: "600",
							alt: "Flowers Image",
							title: "Flowers Image Title",
						},
					},
				],
				link: {
					title: "Discover",
					url: "/discover",
				},
			},
			{
				date: "2022-03-01",
				content:
					"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: {
							width: "800",
							height: "600",
							alt: "Flowers Image",
							title: "Flowers Image Title",
						},
					},
				],
				link: {
					title: "Explore",
					url: "/explore",
				},
			},
			// Add more timeline items as needed
		],
	},
}
