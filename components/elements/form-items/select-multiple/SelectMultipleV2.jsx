import Select, { components } from "react-select"

export const SelectMultipleV2 = ({
	options,
	isMulti,
	id,
	placeholder,
	field,
	closeMenuOnSelect = false,
	label,
}) => {
	return (
		<>
			{label && (
				<label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={id}>
					{label}
				</label>
			)}
			<Select
				{...field}
				placeholder={placeholder}
				options={options}
				isMulti={isMulti}
				id={id}
				components={{ MultiValue }}
				className="react-select-container"
				classNamePrefix="react-select"
				hideSelectedOptions={false}
				isOptionDisabled={(option) => option.disabled}
				closeMenuOnSelect={closeMenuOnSelect}
			/>
		</>
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
