import React from "react"
import { Link } from "./Link"

// eslint-disable-next-line
export default {
	title: "Primitives/Links",
	component: Link,
	parameters: {
		docs: {
			description: {
				component: `
				Description :
						Link component for creating links with various styles and options.
				`,
			},
		},
	},
}

const Template = (args) => {
	return <Link {...args} />
}
export const LinkDefault = Template.bind({})

LinkDefault.args = {
	href: "#.",
	children: "This is the link text",
	className: "",
	variant: "default",
	onClick: null,
}

LinkDefault.argTypes = {
	variant: {
		control: "select",
		options: ["default", "permalink", "btnPrimary", "download"],
		description: "Change the variant of the link",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	children: {
		control: "text",
		description: "Type the text of the link",
		table: {
			defaultValue: { summary: "This is the link text" },
		},
	},
	className: {
		control: "text",
		description: "Add Taitailwind css classes to apply to the link wrapper",
		table: {
			defaultValue: { summary: "" },
		},
	},
	href: {
		control: "text",
		description: "The URL for the link",
		table: {
			defaultValue: { summary: "#." },
		},
	},
	onClick: {
		control: "text",
		description: "The function to run when the link is clicked",
		table: {
			defaultValue: { summary: null },
		},
	},
}
