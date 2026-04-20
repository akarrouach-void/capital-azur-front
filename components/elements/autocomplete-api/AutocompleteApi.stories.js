import React, { useState } from "react"
import { AutocompleteApi } from "./AutocompleteApi"
import AutocompleteApiCode from "!!raw-loader!./AutocompleteApi"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Form Elements/AutocompleteApi",
	component: AutocompleteApi,
	args: {
		label: "Label",
		hasError: true,
		errorMessage: "This could be the error message of your input",
		placeholder: "Placeholder",
		className: "",
	},
	parameters: {
		componentSource: {
			code: AutocompleteApiCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
          Description:
          Autocomplete component for selecting options from a list with search functionality using an API endpoint.
        `,
			},
		},
	},
}

const listCities = [
	{ value: 1, content: "Casablanca" },
	{ value: 2, content: "Paris" },
	{ value: 3, content: "Agadir" },
]

const Template = (args) => {
	const [selected, setSelected] = useState(listCities[0])
	return <AutocompleteApi selected={selected} setSelected={setSelected} {...args} />
}

export const AutocompleteApiStories = Template.bind({})

AutocompleteApiStories.argTypes = {
	control: {
		control: "boolean",
		description: "Control the autocomplete",
		table: {
			defaultValue: { summary: false },
		},
	},
	variant: {
		control: "select",
		options: ["default"],
		description: "Change the variant of the autocomplete",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	label: {
		control: "text",
		description: "The label of the autocomplete",
		table: {
			defaultValue: { summary: "Label" },
		},
	},
	hasError: {
		control: { type: "boolean" },
		description: "Should the autocomplete display an error",
		table: {
			defaultValue: { summary: true },
		},
	},
	errorMessage: {
		control: "text",
		description: "The error message of the autocomplete",
		table: {
			defaultValue: { summary: "This could be the error message of your input" },
		},
	},
	placeholder: {
		control: "text",
		description: "The placeholder of the autocomplete",
		table: {
			defaultValue: { summary: "Placeholder" },
		},
	},
	className: {
		control: "text",
		description: "Add Tailwind CSS classes to apply to the autocomplete wrapper",
		table: {
			defaultValue: { summary: "" },
		},
	},
}
