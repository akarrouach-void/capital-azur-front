export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				title: "Call to Action Title",
				content: {
					value: {
						"#text": "<p>This is a sample content for the call to action.</p>",
					},
				},
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
				cta: {
					title: "Learn More",
					url: "/learn-more",
				},
			},
		],
	},
}
