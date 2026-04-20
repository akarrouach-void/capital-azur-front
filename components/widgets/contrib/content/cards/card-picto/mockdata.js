import imgCard from "./statics/img-card.webp"

export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		extra_field: {
			intro:
				"Introduction Text : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
			btn_more: {
				url: "/path/to/button",
				title: "Read More",
				attributes: {
					id: "btn-more-id",
					rel: "nofollow",
					target: "_blank",
					class:
						"inline-flex justify-center gap-2 animate focus:outline-none text-sm font-medium leading-[21px] px-5 py-3 items-center text-white bg-primary-500 border border-primary-500 rounded-md hover:bg-white hover:text-primary-500 h-11",
				},
			},
			slider: {
				// Add slider settings if needed
			},
		},
		components: [
			{
				image: [
					{
						_default: imgCard.src,
						meta: { width: imgCard.width, height: imgCard.height },
					},
				],
				image_alt: "Image Alt 1",
				title: "Card Title 1",
				description:
					"Card Description 1 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut",
				link: {
					url: "/path/to/link1",
					title: "Link Title 1",
				},
				video: "/path/to/video1.mp4",
			},
			{
				image: [
					{
						_default: imgCard.src,
						meta: { width: imgCard.width, height: imgCard.height },
					},
				],
				image_alt: "Image Alt 2",
				title: "Card Title 2",
				description:
					"Card Description 2 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut",
				link: {
					url: "/path/to/link2",
					title: "Link Title 2",
				},
				video: null,
			},
			{
				image: [
					{
						_default: imgCard.src,
						meta: { width: imgCard.width, height: imgCard.height },
					},
				],
				image_alt: "Image Alt 3",
				title: "Card Title 3",
				description:
					"Card Description 3 : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut",
				link: {
					url: "/path/to/link3",
					title: "Link Title 3",
				},
				video: null,
			},
			// Add more card objects as needed
		],
	},
}
