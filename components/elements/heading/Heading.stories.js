import React from "react"
import { Heading } from "./Heading"

const Template = (args) => {
	return <Heading {...args}></Heading>
}

export const HeadingStories = Template.bind({})

HeadingStories.argTypes = {
	level: {
		description: "choose the level of the heading",
		control: "select",
		options: [1, 2, 3, 4, 5, 6],
		table: {
			defaultValue: { summary: "1" },
		},
	},
	variant: {
		description: "choose the variant of the heading",
		control: "select",
		options: ["title", 1, 2, 3, 4, 5, 6],
		table: {
			defaultValue: { summary: 1 },
		},
	},
	children: {
		description: "type the text of the heading",
		control: "text",
		table: {
			defaultValue: { summary: "This the heading text" },
		},
	},
	className: {
		description: "Add Taitailwind css classes to apply to the heading wrapper",
		control: "text",
		table: {
			defaultValue: { summary: "" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Primitives/Headings",
	component: Heading,
	args: {
		level: 1,
		variant: null,
		children: "This the heading text",
		className: "",
	},
	parameters: {
		docs: {
			description: {
				component: `
				Description :
						Heading component for creating headings with various styles and options.
				`,
			},
		},
	},
}
