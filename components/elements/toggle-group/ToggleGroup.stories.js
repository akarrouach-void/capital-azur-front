import { ToggleGroup } from "./ToggleGroup"

const Template = (args) => (
	<div className="mx-auto flex max-w-lg items-center justify-center">
		<ToggleGroup {...args}>
			<div key={"A"} className="text-lg font-bold">
				A
			</div>
			<div key={"B"} className="text-lg font-bold">
				B
			</div>
			<div key={"C"} className="text-lg font-bold">
				C
			</div>
		</ToggleGroup>
	</div>
)

export const ToggleGroupStories = Template.bind({})

ToggleGroupStories.argTypes = {
	variant: {
		description:
			"Controls the style of the element, a string, one of the variants defined in theme.js",

		value: "default",
		table: {
			defaultValue: { summary: "default" },
			summary: "string",
		},
		control: "select",
		options: ["default", "outline"],
	},
	type: {
		description: "Controls whether the user can select mutltiple or single elements",
		value: "multiple",
		table: {
			defaultValue: { summary: "multiple" },
			summary: "string",
		},
		control: "select",
		options: ["multiple", "single"],
	},
	disabled: {
		description: "Boolean to disable the element",
		value: false,
		table: {
			defaultValue: { summary: false },
			summary: "boolean",
		},
		control: "boolean",
	},
	onChange: {
		description:
			"On change handler called when the selected list is changed, an array representing the new list is passed as first param",
		table: "function",
	},
}

// eslint-disable-next-line
export default {
	title: "components/ToggleGroup",
	args: {
		variant: "default",
		type: "single",
		disabled: false,
		onChange: (e) => {
			console.log("Selected items:", e)
		},
	},
	parameters: {
		docs: {
			description: {
				component: `
				Description :
				ToggleGroup component for selecting one or more items from a list.
				`,
			},
		},
	},
}
