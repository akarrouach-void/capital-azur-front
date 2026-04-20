import React from "react"
import { Tabs } from "./Tabs"

const TabsContent = [
	{
		id: 1,
		title: "Element 1",
		content: (
			<p>
				Tabs 1 lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet,
				consectetur lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet,
				consectetur
			</p>
		),
	},
	{
		id: 1,
		title: "Element 2",
		content: (
			<p>
				Tabs 2 lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet,
				consectetur lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet,
				consectetur
			</p>
		),
	},
	{
		id: 1,
		title: "Element 3",
		content: (
			<p>
				Tabs 3 lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet,
				consectetur lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet,
				consectetur
			</p>
		),
	},
]

const Template = (args) => {
	return <Tabs {...args} />
}

export const TabsStories = Template.bind({})

TabsStories.argTypes = {
	variant: {
		control: "select",
		options: ["default", "secondary"],
		description: "Change the variant of the breadcrumb",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	nodes: {
		control: "object",
		description: "The tabs content",
		table: {
			defaultValue: { summary: "[]" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Components/Tabs",
	args: {
		variant: "default",
		nodes: TabsContent,
	},
	parameters: {
		docs: {
			description: {
				component: `
				Description :
						Tabs component for creating tabs with various styles and options.
				`,
			},
		},
	},
}
