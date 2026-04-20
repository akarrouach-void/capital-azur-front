export const mockdata = {
	data: {
		components: [
			{
				link: {
					url: "https://example.com/page1", // URL for the first link
					attributes: {
						id: "link1", // ID for the first link
						rel: "noopener noreferrer", // Rel attribute for the first link
						target: "_blank", // Target attribute for the first link
						class: "custom-link-class", // Class for the first link
					},
				},
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: {
							width: 100,
							height: 100,
						},
					},
				],
				image_alt: "Flowers Image 1",
				description:
					"Description for the first item : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", // Description for the first item
			},
			{
				link: {
					url: "https://example.com/page2", // URL for the second link
					attributes: {
						id: "link2", // ID for the second link
						rel: "noopener noreferrer", // Rel attribute for the second link
						target: "_blank", // Target attribute for the second link
						class: "custom-link-class", // Class for the second link
					},
				},
				image: [
					{
						_default: "/assets/img/flowers.webp",
						meta: {
							width: 100,
							height: 100,
						},
					},
				],
				image_alt: "Flowers Image 2",
				description:
					"Description for the second item : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", // Description for the second item
			},
			// Add more components as needed
		],
	},
}
