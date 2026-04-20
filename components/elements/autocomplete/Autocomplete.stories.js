import React, { useState } from "react"
import { Autocomplete } from "./Autocomplete"
import AutocompleteCode from "!!raw-loader!./Autocomplete"

// eslint-disable-next-line
export default {
	title: "Form Elements/Autocomplete",
	component: Autocomplete,
	args: {
		variant: "default",
		label: "Label",
		hasError: false,
		errorMessage: "This is an error messsage",
		placeholder: "Placeholder",
		className: "",
		name: "autocomplete",
	},
	parameters: {
		componentSource: {
			code: AutocompleteCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
	Description :
	Autocomplete component for selecting options from a list with search functionality.
	`,
			},
		},
	},
	argTypes: {
		label: {
			control: "text",
			description: "The label of the autocomplete",
			table: {
				defaultValue: { summary: "Label" },
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
		hasError: {
			control: "boolean",
			description: "Should the autocomplete have an error",
			table: {
				defaultValue: { summary: false },
			},
		},
		errorMessage: {
			control: "text",
			description: "The error message to display",
			table: {
				defaultValue: { summary: "This is an error messsage" },
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
			description: "Add Taitailwind css classes to apply to the autocomplete wrapper",
			table: {
				defaultValue: { summary: "" },
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
	return (
		<div className="min-h-[300px]">
			<Autocomplete
				selected={selected}
				setSelected={setSelected}
				list={listCities}
				{...args}
			/>
		</div>
	)
}

export const AutocompleteStories = Template.bind({})
