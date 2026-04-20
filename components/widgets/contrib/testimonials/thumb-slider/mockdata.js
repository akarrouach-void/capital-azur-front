export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		extra_field: {
			intro:
				"Introduction Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		},
		components: [
			{
				name: "Testimonial Name 1",
				role: "Testimonial Role 1",
				description: {
					value: {
						"#text":
							"Testimonial Description 1 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
					},
				},
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: { alt: "Testimonial Image Alt 1", width: "800", height: "600" },
					},
				],
				image_alt: "Testimonial Image Alt 1",
			},
			{
				name: "Testimonial Name 2",
				role: "Testimonial Role 2",
				description: {
					value: {
						"#text":
							"Testimonial Description 2 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
					},
				},
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: { alt: "Testimonial Image Alt 2", width: "800", height: "600" },
					},
				],
				image_alt: "Testimonial Image Alt 2",
			},
			{
				name: "Testimonial Name 3",
				role: "Testimonial Role 3",
				description: {
					value: {
						"#text":
							"Testimonial Description 3 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
					},
				},
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: { alt: "Testimonial Image Alt 3", width: "800", height: "600" },
					},
				],
				image_alt: "Testimonial Image Alt 3",
			},
			// Add more testimonial objects as needed
		],
	},
}
