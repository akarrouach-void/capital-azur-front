import featureimg from "./statics/feature-img.webp"

export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				link: {
					title: "Feature Link",
					url: "/feature-link",
					attributes: {
						id: "feature-link-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "feature-link-class ",
					},
				},
				image: [
					{
						_default: featureimg.src,
						meta: {
							width: featureimg.width,
							height: featureimg.height,
						},
					},
				],
				image_alt: "Flower Image",
				title: "Feature Title",
				description: "Feature Description",
			},
			{
				link: {
					title: "Feature Link",
					url: "/feature-link",
					attributes: {
						id: "feature-link-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "feature-link-class ",
					},
				},
				image: [
					{
						_default: featureimg.src,
						meta: {
							width: featureimg.width,
							height: featureimg.height,
						},
					},
				],
				image_alt: "Flower Image",
				title: "Feature Title",
				description: "Feature Description",
			},
			{
				link: {
					title: "Feature Link",
					url: "/feature-link",
					attributes: {
						id: "feature-link-id",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "feature-link-class ",
					},
				},
				image: [
					{
						_default: featureimg.src,
						meta: {
							width: featureimg.width,
							height: featureimg.height,
						},
					},
				],
				image_alt: "Flower Image",
				title: "Feature Title",
				description: "Feature Description",
			},
			// Add more components as needed
		],
	},
}
