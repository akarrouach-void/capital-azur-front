import { Textarea } from "./Textarea"
import TextareaCode from "!!raw-loader!./Textarea"

const Template = (args) => {
	return (
		<div className="mx-auto flex max-w-lg items-center justify-center">
			<Textarea {...args} />
		</div>
	)
}

export const TextareaStories = Template.bind({})

TextareaStories.argTypes = {
	variant: {
		control: "select",
		options: ["default", "rounded"],
		description: "Variant of input style of textarea",
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
	description: {
		control: "text",
		description: "Description text of input field",
		table: {
			defaultValue: { summary: "Description" },
		},
	},
	placeholder: {
		control: "text",
		description: "Placeholder text of input field",
		table: {
			defaultValue: { summary: "Placeholder" },
		},
	},
	rows: {
		control: "number",
		description: "Number of rows",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	resize: {
		control: "boolean",
		description: "Resize textarea or not",
		table: {
			defaultValue: { summary: true },
		},
	},
	showCounter: {
		control: "boolean",
		description: "Show counter",
		table: {
			defaultValue: { summary: false },
		},
	},
	maxLength: {
		control: { type: "number" },
		description: "Max length of textarea",
		table: {
			defaultValue: { summary: 50 },
		},
	},
	hasError: {
		control: { type: "boolean" },
		description: "Has error state or not of input field",
		table: {
			defaultValue: { summary: false },
		},
	},
	errorMessage: {
		control: { type: "text" },
		description: "Error message text if hasError is true",
		table: {
			defaultValue: { summary: "Error message" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Form elements/Textarea",
	args: {
		variant: "default",
		label: "Label",
		description: "Description",
		placeholder: "Placeholder",
		rows: 4,
		resize: true,
		showCounter: false,
		maxLength: 50,
		hasError: false,
		errorMessage: "This is an error messsage",
		name: "textarea-name",
	},
	parameters: {
		componentSource: {
			code: TextareaCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		Description:
		Textarea component for entering text.
	  `,
			},
		},
	},
}
