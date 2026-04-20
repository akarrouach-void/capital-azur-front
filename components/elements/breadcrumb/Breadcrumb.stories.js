import React from "react"
import { Breadcrumb } from "./Breadcrumb"

const pages = [
	{ id: "1", name: "Projects", href: "#", current: false },
	{ id: "2", name: "Project Nero", href: "#", current: true },
]

const Template = (args) => {
	return (
		<div className="relative">
			<Breadcrumb {...args} pages={pages} />
		</div>
	)
}

export const BreadcrumbStories = Template.bind({})

Template.args = {
	variant: "default",
	className: "",
	homeUrl: "/",
}

// eslint-disable-next-line
export default {
	title: "Components/Breadcrumb",
	args: {
		variant: "default",
		className: "",
		homeUrl: "",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "secondary"],
			description: "Change the variant of the breadcrumb",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		className: {
			control: "text",
			description: "Add Taitailwind css classes to apply to the breadcrumb wrapper",
			table: {
				defaultValue: { summary: "" },
			},
		},
		homeUrl: {
			control: "text",
			description: "he URL for the home link (optional).",
			table: {
				defaultValue: { summary: "" },
			},
		},
	},
	parameters: {
		docs: {
			description: {
				component: `
				Description :
						Breadcrumb component for displaying a breadcrumb navigation trail with optional home link and styling.
				`,
			},
		},
	},
}
