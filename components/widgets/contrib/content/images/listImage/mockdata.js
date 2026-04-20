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
			btn_more: {
				id: "btn-more-id",
				target: "_blank",
				rel: "noopener noreferrer",
				class: "btn-more-class",
			},
		},
		components: [
			{
				image: [
					{
						_default: "/assets/img/flowers.webp", // Using flowers image
						meta: { width: "800", height: "600" },
					},
				],
				image_alt: "Image Alt Text 1",
				link: {
					url: "/path/to/link1",
					title: "Link Title 1",
				},
			},
			{
				image: [
					{
						_default: "/assets/img/flowers.webp", // Using flowers image
						meta: { width: "800", height: "600" },
					},
				],
				image_alt: "Image Alt Text 2",
				link: {
					url: "/path/to/link2",
					title: "Link Title 2",
				},
			},
			{
				image: [
					{
						_default: "/assets/img/flowers.webp", // Using flowers image
						meta: { width: "800", height: "600" },
					},
				],
				image_alt: "Image Alt Text 3",
				link: {
					url: "/path/to/link3",
					title: "Link Title 3",
				},
			},
		],
	},
}
