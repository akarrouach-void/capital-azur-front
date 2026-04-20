import { forwardRef } from "react"
import { Checkbox, Wysiwyg } from "@/ui"
import { checkboxes } from "./theme"

export const Checkboxes = forwardRef(
	(
		{
			variant = "default",
			label,
			hasError,
			errorMessage,
			checkboxesData,
			checked, // must contain the array of the seleted values
			setChecked,
			description,
			disabled,
			name,
			...rest
		},
		ref
	) => {
		return (
			<div className={checkboxes[variant].wrapper}>
				<label htmlFor={name} className={checkboxes[variant].label}>
					{label}
				</label>
				<div className={checkboxes[variant].checkboxesContainer}>
					{checkboxesData.map((checkboxItem) => {
						return (
							<Checkbox
								key={`${name}-${checkboxItem.value}}`}
								ref={ref}
								{...rest}
								variant={variant}
								label={checkboxItem.label}
								value={checkboxItem.value}
								disabled={disabled}
								checked={checked?.includes(checkboxItem?.value?.toString())}
								setChecked={setChecked}
								className={checkboxes[variant].checkboxesElement}
								id={name}
								name={name}
							/>
						)
					})}
				</div>
				{hasError && <p className={checkboxes[variant].errorMessage}>{errorMessage}</p>}
				{description && (
					<Wysiwyg className={checkboxes[variant].description} html={description} />
				)}
			</div>
		)
	}
)
