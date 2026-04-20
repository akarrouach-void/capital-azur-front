import React from "react"
import { Text } from "./Text"
import TextCode from "!!raw-loader!./Text"

const Template = (args) => <Text {...args} />

export const TextStories = Template.bind({})

TextStories.args = {
	children: "lorem ipsum dolor sit amet, consectetur adip",
}

TextStories.argTypes = {
	variant: {
		control: "select",
		options: ["base", "small", "large", "intro", "text"],
		description: "Change the variant of the text",
		table: {
			defaultValue: { summary: "base" },
		},
	},
	children: {
		control: "text",
		description: "The content of the text",
		table: {
			defaultValue: { summary: "Text" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Primitives/Text",
	// component: Text,
	args: {
		variant: "base",
		children: "Text",
	},
	parameters: {
		componentSource: {
			code: TextCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description :
				Text component for creating text with various styles and options.
				`,
			},
		},
	},
}
