export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				title: "Service 1",
				description: "Description for Service 1",
				link: {
					title: "Service Link 1",
					url: "/service-link-1",
					attributes: {
						id: "service-link-1-id",
						target: "_blank",
						rel: "noopener noreferrer",
					},
				},
			},
			{
				title: "Service 2",
				description: "Description for Service 2",
				link: {
					title: "Service Link 2",
					url: "/service-link-2",
					attributes: {
						id: "service-link-2-id",
						target: "_blank",
						rel: "noopener noreferrer",
					},
				},
			},
			{
				title: "Service 3",
				description: "Description for Service 3",
				link: {
					title: "Service Link 3",
					url: "/service-link-3",
					attributes: {
						id: "service-link-3-id",
						target: "_blank",
						rel: "noopener noreferrer",
					},
				},
			},
			// Add more services as needed
		],
	},
}
