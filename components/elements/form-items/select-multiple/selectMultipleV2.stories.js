import React from "react"
import Select, { components } from "react-select"

const people = [
	{
		value: "-1",
		label: "Select thematique",
		disabled: true,
	},
	{
		id: "2",
		value: "2",
		label: "Annonce",
	},
	{
		id: "3",
		value: "3",
		label: "Environnement",
	},
	{
		id: "4",
		value: "4",
		label: "Innovation",
	},
	{
		id: "5",
		value: "5",
		label: "Pubication",
	},
]

const Template = () => {
	return (
		<div className="max-w-xs">
			<Select
				name="thematiques"
				options={people}
				placeholder="Thèmatiques"
				isMulti
				id="publication-thematiques"
				components={{ MultiValue }}
				className="react-select-container"
				classNamePrefix="react-select"
				hideSelectedOptions={false}
				isOptionDisabled={(option) => option.disabled}
				closeMenuOnSelect={false}
			/>
		</div>
	)
}

const MultiValue = ({ index, getValue, ...props }) => {
	const maxToShow = 1
	const hiddenSelectedOptions = getValue()
		.slice(maxToShow)
		.map((x) => x.label)

	if (index < maxToShow) {
		return <components.MultiValue {...props} />
	} else if (index === maxToShow) {
		return (
			<div className="order-2 whitespace-nowrap rounded-[4px] bg-primary-600 px-1 text-white">
				{`+ ${hiddenSelectedOptions.length}`}
			</div>
		)
	} else {
		return null
	}
}

export const SelectMultipleV2Stories = Template.bind({})

// eslint-disable-next-line
export default {
	title: "Form elements/Select multiple",
}
