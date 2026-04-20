import { vclsx } from "@vactorynext/core/utils"

import { selectNative } from "./theme"

const mockData = [
	{
		value: "1",
		label: "Agadir",
	},
	{
		value: 2,
		label: "Casablanca",
	},
	{
		value: 3,
		label: "Tanger",
	},
	{
		value: 4,
		label: "Marrakech",
	},
]

export const SelectNative = ({
	variant = "default",
	list = mockData,
	label,
	onChange,
	onBlur,
	defaultValue,
	name,
	className = "",
	...rest
}) => {
	return (
		<div className={selectNative[variant].wrapper}>
			{label && (
				<label htmlFor={name} className={selectNative[variant].label}>
					{label}
				</label>
			)}
			<select
				onChange={onChange}
				onBlur={onBlur}
				id={name}
				name={name}
				value={defaultValue}
				className={vclsx(selectNative[variant].select, "select-arrow", className)}
				{...rest}
			>
				{list.map((item) => (
					<option key={item.value} value={item.value}>
						{item.label}
					</option>
				))}
			</select>
		</div>
	)
}
