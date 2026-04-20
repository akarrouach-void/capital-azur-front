export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
	},
	data: {
		extra_field: {
			intro:
				"Introduction Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit", // Example introduction text
		},
		components: [
			{
				image: [
					{
						_default: "/assets/img/flowers.webp", // Example image URL
						meta: {
							width: "800",
							height: "600",
						},
					},
				],
				image_alt: "Image Alt Text 1",
				name: "Name 1",
				role: "Role 1",
				description:
					"Description 1 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit",
				mode: "mode1", // Example mode value
			},
			{
				image: [
					{
						_default: "/assets/img/flowers.webp", // Example image URL
						meta: {
							width: "800",
							height: "600",
						},
					},
				],
				image_alt: "Image Alt Text 2",
				name: "Name 2",
				role: "Role 2",
				description:
					"Description 2 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit",
			},
			// Add more components as needed
		],
	},
}
