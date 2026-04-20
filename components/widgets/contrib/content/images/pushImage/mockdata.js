export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		extra_field: {
			intro:
				"Introduction Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
			mode: 0, // Change to 1 for different mode
			mode_text: 0, // Change to 1 for different mode
			btn_more: {
				id: "btn-more-id",
				target: "_blank",
				rel: "noopener noreferrer",
				class: "btn-more-class",
			},
		},
		components: [
			{
				titre: "Push Image 1",
				description: "Description for Push Image 1",
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
					title: "Link 1",
					url: "/link-1",
					attributes: {
						id: "link-1-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "link-1-class",
					},
				},
			},
			{
				titre: "Push Image 2",
				description: "Description for Push Image 2",
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
					title: "Link 2",
					url: "/link-2",
					attributes: {
						id: "link-2-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "link-2-class",
					},
				},
			},
			// Add more push images as needed
		],
	},
}
