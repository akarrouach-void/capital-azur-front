export const card = {
	default: {
		wrapper:
			"group flex flex-col rounded-lg shadow-lg overflow-hidden text-black bg-white hover:shadow-xl",
		image: "flex items-center justify-center flex-shrink-0",
		body: "relative flex flex-col h-full p-8 pt-5",
		tag: "mb-5",
		title: "text-xl font-semibold text-gray-900 text-primary-600",
		excerpt: "my-3 text-base text-gray-500",
		link: "mt-auto",
	},
	inline: {
		wrapper: "md:flex-row",
		image: "md:w-half lg:w-third",
		body: "relative md:w-full flex flex-col justify-center p-8",
		link: "mt-auto",
	},
	inlineInversed: {
		wrapper: "md:flex-row-reverse ",
		image: "md:w-half lg:w-third",
		body: "relative md:w-full flex flex-col justify-center p-5",
	},
	"2Cols": {
		wrapper: "lg:flex-row ",
		image: "w-full lg:w-1/2",
		body: "relative lg:w-1/2 flex flex-col justify-center p-8",
		link: "mt-auto",
	},
	"2ColsInversed": {
		wrapper: "lg:flex-row-reverse ",
		image: "aspect-[16/9] lg:w-1/2",
		body: "relative lg:w-1/2 flex flex-col justify-center p-8",
		link: "mt-auto",
	},
	cardPicto: {
		image: "w-24 pl-8 pt-8",
		body: "relative flex flex-col h-full p-8",
		link: "mt-auto",
	},
}
