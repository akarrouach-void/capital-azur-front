export const modalVideo = {
	default: {
		thumbnailContainer:
			"relative flex items-center justify-center flex-1 w-full aspect-w-16 aspect-h-9 rounded overflow-hidden cursor-pointer",
		thumbnailImage: "absolute top-0 left-0 w-full h-full object-fit",
		playIcon: {
			base: "w-16 h-16 text-white hover:text-gray-500",
			position:
				"absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-20",
			id: "play-solid",
		},
	},
	cardVideo: {
		thumbnailContainer: "cursor-pointer",
		thumbnailImage: "w-full h-full object-cover ",
		playIcon: {
			base: "w-16 h-16 text-white hover:text-gray-500",
			position:
				"absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-20 bg-black bg-opacity-10",
			id: "play-solid",
		},
	},
}
