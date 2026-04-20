import React from "react"
import { Input } from "./Input"
import InputCode from "!!raw-loader!./Input"
import { Icon } from "../../icon/Icon"

const Template = (args) => {
	const prefix = args.prefix === null ? null : <Icon id="user" className="h-5 w-5" />
	const sufix =
		args.sufix === null ? null : <Icon id="question-mark-circle" className="h-5 w-5" />
	return (
		<div className="mx-auto flex max-w-lg items-center justify-center">
			<Input {...args} prefix={prefix} sufix={sufix} />
		</div>
	)
}

export const InputText = Template.bind({})

InputText.argTypes = {
	variant: {
		control: "select",
		options: ["default", "search", "inline"],
		description: "Variant of input style",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	label: {
		control: "text",
		description: "Label text of input field",
		table: {
			defaultValue: { summary: "Label" },
		},
	},
	placeholder: {
		control: "text",
		description: "Placeholder text of input field",
		table: {
			defaultValue: { summary: "Placeholder" },
		},
	},
	description: {
		control: "text",
		description: "Description of your input field",
		table: {
			defaultValue: { summary: "description text" },
		},
	},
	hasError: {
		control: "boolean",
		description: "Has error state or not of input field",
		table: {
			defaultValue: { summary: false },
		},
	},
	errorMessage: {
		control: "text",
		description: "Error message text if hasError is true",
		table: {
			defaultValue: { summary: "Error message" },
		},
	},
	prefix: {
		control: "inline-radio",
		options: {
			null: null,
			icon: "prefix",
		},
		description: "Prefix icon of input field (left side)",
		table: {
			defaultValue: { summary: "null" },
		},
	},
	sufix: {
		control: "inline-radio",
		options: {
			null: null,
			icon: "sufix",
		},
		description: "Sufix icon of input field (right side)",
		table: {
			defaultValue: { summary: "null" },
		},
	},
	addonAfter: {
		control: "boolean",
		description: "Addon after text of input field",
		table: {
			defaultValue: { summary: false },
		},
	},
	addonBefore: {
		control: "boolean",
		description: "Addon before text of input field",
		table: {
			defaultValue: { summary: true },
		},
	},
}

export const InputTextWithAddons = Template.bind({})

InputTextWithAddons.args = {
	addonBefore: <span className="mx-3 truncate">https://</span>,
	addonAfter: <Icon id="user" className="mx-3 h-5 w-5" />,
}

InputTextWithAddons.argTypes = {
	...InputText.argTypes,
}

// eslint-disable-next-line
export default {
	title: "Form elements/Input",
	args: {
		variant: "default",
		label: "Label",
		placeholder: "Placeholder",
		addonAfter: true,
		addonBefore: true,
		prefix: null,
		sufix: null,
		hasError: false,
		errorMessage: "This is an error messsage",
		description: "description",
		name: "input-id",
	},
	parameters: {
		componentSource: {
			code: InputCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		Description:
		Input component for entering text.
	  `,
			},
		},
	},
}
