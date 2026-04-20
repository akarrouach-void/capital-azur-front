export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				title: "Content CTA Title",
				description: {
					value: {
						"#text":
							"Content CTA Description : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
					},
				},
				link: {
					url: "/path/to/link",
					title: "Link Title",
					id: "link-id",
					target: "_blank",
					rel: "noopener noreferrer",
					class: "cta-link",
				},
			},
		],
	},
}
