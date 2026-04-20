import React from "react"
import { Container } from "./Container"

const Template = (args) => {
	return <Container {...args} />
}

export const ContainerStories = Template.bind({})

ContainerStories.args = {
	layout: "default",
	children: <p>Content</p>,
	className: "bg-gray-200 rounded h-56",
}

ContainerStories.argTypes = {
	layout: {
		control: "select",
		options: ["default", "fluid", "full"],
		description: "Change the layout of the container",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	children: {
		control: "object",
		description: "The content of the container",
		table: {
			defaultValue: { summary: "[]" },
		},
	},
	className: {
		control: "text",
		description: "Add Taitailwind css classes to apply to the container wrapper",
		table: {
			defaultValue: { summary: "" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Primitives/Container",
	component: Container,
	parameters: {
		docs: {
			description: {
				component: `
				Description :
						Container component for creating containers with various styles and options.
				`,
			},
		},
	},
}
