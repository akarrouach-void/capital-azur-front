import React, { useState } from "react"
import { SelectMultiple } from "./selectMultiple"
import SelectMultipleCode from "!!raw-loader!./selectMultiple"

const people = [
	{ value: "1", label: "Wade Cooper" },
	{ value: "2", label: "Arlene Mccoy" },
	{ value: "3", label: "Devon Webb" },
	{ value: "4", label: "Tanya Fox" },
	{ value: "5", label: "Hellen Schmidt" },
]

const Template = (args) => {
	const [selected, setSelected] = useState(["4"])
	return (
		<div className="min-h-[250px]">
			<SelectMultiple {...args} selected={selected} setSelected={setSelected} />
		</div>
	)
}

export const SelectMultipleStories = Template.bind({})

SelectMultipleStories.args = {
	options: people,
	name: "select-multiple-name",
}

// eslint-disable-next-line
export default {
	title: "Form elements/Select multiple",
	// component: SelectMultiple,
	parameters: {
		componentSource: {
			code: SelectMultipleCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		  Description:
		  SelectMultiple component is a component that allows you to create a SelectMultiple with a label.
		`,
			},
		},
	},
}
