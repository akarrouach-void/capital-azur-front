export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				id: "image-widget-amp",
				target: "_blank",
				rel: "noopener noreferrer",
				class: "image-widget",
				image: [
					{
						_default: "/assets/img/flowers.webp", // Using flowers image
						meta: { width: "800", height: "600" },
					},
				],
				intro:
					"Introduction Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
				description: {
					value: {
						"#text":
							"Description Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
					},
				},
				image_alt: "Image Alt Text",
				btn_more: {
					url: "/path/to/link",
					title: "Read More",
				},
			},
		],
	},
}
