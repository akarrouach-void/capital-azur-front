import { InputFile } from "./InputFile"
import { Icon } from "../../icon/Icon"
// import { InputText } from "../input/Input.stories"
import InputFileCode from "!!raw-loader!./InputFile"

const Template = (args) => {
	const prefix = args.prefix === null ? null : <Icon id="home" className="h-5 w-5" />
	const sufix =
		args.sufix === null ? null : <Icon id="question-mark-circle" className="h-5 w-5" />
	return (
		<div className="mx-auto flex max-w-lg items-center justify-center">
			<InputFile {...args} prefix={prefix} sufix={sufix}></InputFile>
		</div>
	)
}

export const InputFileStories = Template.bind({})

InputFileStories.argTypes = {
	// ...InputText.argTypes,
}

// eslint-disable-next-line
export default {
	title: "Form elements/Input File",
	parameters: {
		componentSource: {
			code: InputFileCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
                Description:
                Input file component for uploading files.
                `,
			},
		},
	},
	args: {
		isMultiple: false,
		label: "Label",
		variant: "default",
		placeholder: "Placeholder",
		addonAfter: true,
		addonBefore: true,
		// prefix: "null",
		hasError: false,
		errorMessage: "This is an error messsage",
		description: "description",
		name: "input-file-name",
	},

	argTypes: {
		isMultiple: {
			control: "boolean",
			description: "Is multiple",
			table: {
				defaultValue: { summary: false },
			},
		},
		label: {
			control: "text",
			description: "Label text",
			table: {
				defaultValue: { summary: "Label" },
			},
		},
		variant: {
			control: "select",
			options: ["default", "rounded"],
			description: "Variant of input",
			table: {
				defaultValue: { summary: "default" },
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
				defaultValue: { summary: "" },
			},
		},
		hasError: {
			control: "boolean",
			description: "Has error message",
			table: {
				defaultValue: { summary: false },
			},
		},
		errorMessage: {
			control: "text",
			description: "Error message text",
			table: {
				defaultValue: { summary: "This is an error messsage" },
			},
		},
		description: {
			control: "text",
			description: "Description text",
			table: {
				defaultValue: { summary: "Description" },
			},
		},
	},
}
