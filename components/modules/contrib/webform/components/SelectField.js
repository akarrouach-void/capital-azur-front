import React, { useMemo } from "react"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { useFormContext, Controller } from "react-hook-form"
import { Select, SelectMultiple } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const SelectField = ({ name, field }) => {
	const {
		label,
		title_display,
		validation,
		shouldDisplay,
		states,
		helperText,
		emptyOption,
		emptyValue,
		isMultiple,
		attributes,
	} = field
	const { t } = useTranslation()
	const { watch, control } = useFormContext()
	const values = watch({ nest: true })
	const errorMessage = useErrorMessage(name, label, useFormContext)

	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	const local_state = useCheckConditions(states, watch)

	if (!isVisible) return null

	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null

	var local_validation

	if (local_state["required"] !== undefined) {
		local_validation = { ...validation, required: local_state.required }
	} else {
		local_validation = { ...validation }
	}

	return (
		<Controller
			variant="default"
			control={control}
			name={name}
			rules={toRegister(t("Nx:" + label), local_validation, values, t)}
			render={({ field: { ref, onChange, value } }) => {
				if (isMultiple) {
					return (
						<SelectMultiple
							label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
							labelDisplay={title_display}
							selected={value === undefined ? [] : [...value]}
							setSelected={onChange}
							errorMessage={!!errorMessage && errorMessage}
							hasError={!!errorMessage}
							description={helperText}
							disabled={local_state?.disabled}
							className={field.class}
							name={name}
							options={field.options.map((option) => ({
								value: option.value,
								label: option.label || option.value,
							}))}
							{...attributes}
						/>
					)
				}
				return (
					<Select
						ref={ref}
						label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
						labelDisplay={title_display}
						list={field.options.map((option) => ({
							value: option.value,
							content: option.label || option.value,
						}))}
						selected={
							value === undefined
								? emptyValue !== undefined
									? emptyValue
									: emptyOption !== undefined
										? "emptyOption"
										: value
								: value
						}
						setSelected={(option) => {
							onChange(option)
						}}
						hasError={!!errorMessage}
						description={helperText}
						className={field.class}
						disabled={local_state?.disabled}
						errorMessage={!!errorMessage && errorMessage}
						name={name}
						aria-label={t(`Nx:${label}`)}
						{...attributes}
					/>
				)
			}}
		/>
	)
}
