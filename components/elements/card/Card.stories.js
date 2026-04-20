import React from "react"
import { Card } from "./Card"
import CardCode from "!!raw-loader!./Card"
//import { Image } from "../image/Image"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Primitives/Card",
	component: Card,
	parameters: {
		componentSource: {
			code: CardCode,
			language: "javascript",
		},
	},
	args: {
		title: "This is the title of the card",
		excerpt:
			"Lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor sit amet, consectetur adip",
		/* image: (
			<Image
				className="h-52 w-full object-cover"
				src="https://place-hold.it/100x150"
				alt="Image alt"
				width={100}
				height={150}
			/>
		), */
		urlTag: "/about",
		url: "/about",
		urlContent: "En savoir plus",
		category: "Development",
		className: "max-w-sm",
	},
	argTypes: {
		title: {
			control: "text",
			description: "Title of the card",
			table: {
				defaultValue: { summary: "This is the title of the card" },
			},
		},
		excerpt: {
			control: "text",
			description: "Excerpt of the card",
			table: {
				defaultValue: {
					summary:
						"Lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor sit amet, consectetur adip",
				},
			},
		},
		image: {
			control: "text",
			description: "Image of the card",
			table: {
				defaultValue: { summary: "https://place-hold.it/100x150" },
			},
		},
		urlTag: {
			control: "text",
			description: "Url tag of the card",
			table: {
				defaultValue: { summary: "/about" },
			},
		},
		url: {
			control: "text",
			description: "Url of the card",
			table: {
				defaultValue: { summary: "/about" },
			},
		},
		urlContent: {
			control: "text",
			description: "Url content of the card",
			table: {
				defaultValue: { summary: "En savoir plus" },
			},
		},
		category: {
			control: "text",
			description: "Category of the card",
			table: {
				defaultValue: { summary: "Development" },
			},
		},
		className: {
			control: "text",
			description: "Add Taitailwind css classes to apply to the card wrapper",
			table: {
				defaultValue: { summary: "" },
			},
		},
		variant: {
			control: "select",
			options: ["box", "inline", "inlineInversed"],
			description: "Change the variant of the card",
			table: {
				defaultValue: { summary: "box" },
			},
		},
	},
}

const Template = (args) => <Card {...args} />

export const Box = Template.bind({})
Box.args = {
	title: "This is the title of the card",
	excerpt:
		"Lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor sit amet, consectetur adip",
	/* image: (
		<Image
			className="h-52 w-full object-cover"
			src="https://place-hold.it/100x150"
			alt="Image alt"
			width={100}
			height={150}
		/>
	), */
	urlTag: "/about",
	url: "/about",
	urlContent: "En savoir plus",
	category: "Development",
	className: "max-w-sm",
}

export const Inline = Template.bind({})
Inline.args = {
	...Box.args,
	variant: "inline",
	className: "max-w-lg",
}

export const InlineReverse = Template.bind({})
InlineReverse.args = {
	...Box.args,
	variant: "inlineInversed",
	className: "max-w-lg",
}
