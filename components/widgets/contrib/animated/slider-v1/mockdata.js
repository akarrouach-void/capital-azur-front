export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
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
				title: "Slide 1 Title",
				content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				link: {
					title: "Learn More",
					url: "/learn-more",
				},
			},
			{
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
				title: "Slide 2 Title",
				content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				link: {
					title: "Discover",
					url: "/discover",
				},
			},
			{
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
				title: "Slide 3 Title",
				content:
					"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
				link: {
					title: "Explore",
					url: "/explore",
				},
			},
			// Add more slides as needed
		],
		extra_field: {
			title: "Slider Title",
			content: "Some additional content for the slider.",
			cta: {
				title: "View All",
				url: "/view-all",
			},
		},
	},
}
