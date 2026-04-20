import React from "react"
import { Button } from "./Button"
import { Icon } from "../icon/Icon"

const Template = (args) => {
	const icon = args.icon === null ? null : <Icon id="check" className="h-5 w-5" />
	return <Button {...args} icon={icon}></Button>
}

export const ButtonStories = Template.bind({})

ButtonStories.argTypes = {
	variant: {
		control: "select",
		options: ["primary", "secondary", "danger"],
		description: "Change the variant of the button",
		table: {
			defaultValue: { summary: "primary" },
		},
	},
	children: {
		control: "text",
		description: "The content of the button",
		table: {
			defaultValue: { summary: "Button" },
		},
	},
	className: {
		control: "text",
		description: "Add Taitailwind css classes to apply to the button wrapper",
		table: {
			defaultValue: { summary: "" },
		},
	},
	size: {
		control: "select",
		options: ["small", "normal", "large", "xlarge"],
		description: "Change the size of the button",
		table: {
			defaultValue: { summary: "normal" },
		},
	},
	disabled: {
		options: [false, true],
		control: "boolean",
		description: "Disable the button",
		table: {
			defaultValue: { summary: false },
		},
	},
	outline: {
		options: [false, true],
		control: "boolean",
		description: "Change the variant of the button",
		table: {
			defaultValue: { summary: false },
		},
	},
	pill: {
		options: [false, true],
		control: "boolean",
		description: "Change the variant of the button",
		table: {
			defaultValue: { summary: false },
		},
	},
	icon: {
		control: "inline-radio",
		options: {
			null: null,
			icon: "icon",
		},
		description: "The icon to display on the button",
		table: {
			defaultValue: { summary: "null" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Primitives/Button",
	args: {
		children: "Button",
		icon: null,
		variant: "primary",
		size: "normal",
		disabled: false,
		outline: false,
		pill: false,
		className: "",
	},
	parameters: {
		docs: {
			description: {
				component: `
			Description: 
				Button component for creating interactive buttons with various styles and options.
				`,
			},
		},
	},
}
