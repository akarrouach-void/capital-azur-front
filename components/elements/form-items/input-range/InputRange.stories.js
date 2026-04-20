import { InputRange } from "./InputRange"
import InputRangeCode from "!!raw-loader!./InputRange"

const Template = (args) => (
	<div className="mx-auto flex max-w-lg items-center justify-center">
		<InputRange {...args} />
	</div>
)

export const InputRangeStories = Template.bind({})

InputRangeStories.argTypes = {
	thumb: {
		control: "select",
		options: ["defaultThumb", "roundedThumb"],
		description: "Thumb variant",
		table: {
			defaultValue: { summary: "defaultThumb" },
		},
	},
	min: {
		control: { type: "number" },
		description: "Min value",
		table: {
			defaultValue: { summary: "0" },
		},
	},
	max: {
		control: { type: "number" },
		description: "Max value",
		table: {
			defaultValue: { summary: "100" },
		},
	},
	label: {
		control: { type: "text" },
		description: "Label text",
		table: {
			defaultValue: { summary: "Label" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Form elements/input Range",
	args: {
		min: 0,
		max: 100,
		label: "Label",
		thumb: "defaultThumb",
		name: "input-range-name",
	},
	parameters: {
		componentSource: {
			code: InputRangeCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		Description:
		Input range component for selecting a range of values.
		`,
			},
		},
	},
}
