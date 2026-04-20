export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		extra_field: {
			title: "Media Gallery Title",
			description: "Media Gallery Description",
			showFullscreenButton: 1, // 1 for true, 0 for false
			slideInterval: 2000, // milliseconds
			showPlayButton: 1, // 1 for true, 0 for false
			showBullets: 1, // 1 for true, 0 for false
			showThumbnails: 1, // 1 for true, 0 for false
			isInfinit: 1, // 1 for true, 0 for false
			position: "top", // "top", "bottom", or "center"
		},
		components: [
			{
				title: "Item 1",
				image: [
					{
						_default: { _original: "/assets/img/flowers.webp" },
						meta: {
							alt: "Image 1 Alt Text",
							width: 1200,
							height: 600,
						},
					},
				],
				video: {
					url: "https://www.youtube.com/watch?v=ryUxrFUk6MY",
				},
			},
			{
				title: "Item 2",
				image: [
					{
						_default: { _original: "/assets/img/flowers.webp" },
						meta: {
							alt: "Image 2 Alt Text",
							width: 1200,
							height: 600,
						},
					},
				],
				video: {
					url: "https://www.youtube.com/watch?v=ryUxrFUk6MY",
				},
			},
			// Add more components as needed
		],
	},
}
