import React from "react"
import { Icon } from "../../icon/Icon"
import { Select } from "./Select"
import SelectCode from "!!raw-loader!./Select"

// eslint-disable-next-line
export default {
	title: "Form elements/Select",
	component: Select,
	parameters: {
		componentSource: {
			code: SelectCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		  Description:
		  Select component is a component that allows you to create a Select with a label.
		`,
			},
		},
	},
	args: {
		variant: "default",
		label: "Label",
		placeholder: "Placeholder",
		addonAfter: true,
		addonBefore: true,
		// prefix: "null",
		hasError: false,
		errorMessage: "This is an error messsage",
		description: "description",
		name: "select-name",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "secondary"],
			description: "Variant of input",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		label: {
			control: "text",
			description: "Label text",
			table: {
				defaultValue: { summary: "Label" },
			},
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
			table: {
				defaultValue: { summary: "Placeholder" },
			},
		},
		addonAfter: {
			control: "boolean",
			description: "Addon after text",
			table: {
				defaultValue: { summary: false },
			},
		},
		addonBefore: {
			control: "boolean",
			description: "Addon before text",
			table: {
				defaultValue: { summary: true },
			},
		},
		prefix: {
			control: "text",
			description: "Prefix text",
			table: {
				defaultValue: { summary: "null" },
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
		description: {
			control: "text",
			description: "Description of your input field",
			table: {
				defaultValue: { summary: "description text" },
			},
		},
	},
}

const listItems = [
	{
		value: "1",
		content: "Agadir oufla",
	},
	{
		value: "2",
		content: "Casa blanca",
	},
	{
		value: "3",
		content: "Paris",
	},
]

const Template = (args) => (
	<div className="min-h-[250px]">
		<Select {...args} />
	</div>
)
export const Example = Template.bind({})

Example.args = {
	list: listItems,
	selected: listItems[0],
	checkIcon: <Icon id="check-solid" width="15" height="15" />,
}

export const V2 = Template.bind({})
V2.args = {
	variant: "secondary",
	list: listItems,
	selected: listItems[1],
}
