import React, { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Checkboxes } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const CheckboxesField = ({ name, field }) => {
	const { label, validation, shouldDisplay, states, helperText, attributes } = field
	const { t } = useTranslation()
	const { watch, control, defaultValues } = useFormContext()
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
		<>
			<Controller
				control={control}
				name={name}
				rules={toRegister(t("Nx:" + label), local_validation, values, t)}
				render={({ field: { onChange, value } }) => (
					<Checkboxes
						label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
						checkboxesData={field.options.map((radio) => {
							return {
								value: radio.value,
								label: radio.label || radio.name,
								checked: defaultValues[name]?.includes(radio.value),
							}
						})}
						checked={value !== undefined ? value : []}
						setChecked={(e) => {
							if (value === undefined) {
								onChange([e.target.value])
							} else {
								if (!value.includes(e.target.value)) {
									onChange([...value, e.target.value])
								} else {
									const reste = value.filter((option) => {
										return option != e.target.value
									})
									onChange(reste || [])
								}
							}
						}}
						hasError={!!errorMessage}
						errorMessage={!!errorMessage && errorMessage}
						description={helperText}
						disabled={local_state?.disabled}
						{...attributes}
					/>
				)}
			/>
		</>
	)
}
