import { Checkbox } from "./Checkbox"
import CheckboxCode from "!!raw-loader!./Checkbox"

const Template = (args) => (
	<div className="mx-auto flex max-w-lg items-center justify-center">
		<Checkbox {...args} />
	</div>
)

export const CheckboxStories = Template.bind({})

CheckboxStories.argTypes = {
	disabled: {
		control: "boolean",
		description: "Disable the checkbox",
		table: {
			defaultValue: { summary: false },
		},
	},
	checked: {
		control: "boolean",
		description: "Check the checkbox",
		table: {
			defaultValue: { summary: false },
		},
	},
	label: {
		control: "text",
		description: "The label of the checkbox",
		table: {
			defaultValue: { summary: "Label" },
		},
	},
	className: {
		control: "text",
		description: "Add Taitailwind css classes to apply to the checkbox wrapper",
		table: {
			defaultValue: { summary: "" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Form elements/Checkbox",
	args: {
		disabled: false,
		checked: false,
		label: "Label",
		className: "",
		name: "checkbox-id",
	},
	parameters: {
		componentSource: {
			code: CheckboxCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
          Description:
		  checkbox component is a component that allows you to create a checkbox with a label.
        `,
			},
		},
	},
}
