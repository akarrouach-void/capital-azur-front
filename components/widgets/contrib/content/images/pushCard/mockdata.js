export const mockdata = {
	settings: {
		toHide: false,
	},
	data: {
		components: [
			{
				intro:
					"Introduction Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
				image: [
					{
						_default: "/assets/img/flowers.webp", // Using flowers image
					},
				],
				mode: false,
				titre: "Card Title",
				description:
					"Card Description : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
				link: {
					url: "/path/to/link",
					title: "Link Title",
					attributes: {
						id: "link-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "link-class",
					},
				},
				btn_more: {
					url: "/path/to/button/more",
					title: "Button More Title",
					attributes: {
						id: "button-more-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "button-more-class",
					},
				},
			},
		],
	},
}
