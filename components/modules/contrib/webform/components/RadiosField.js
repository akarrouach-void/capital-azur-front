import React, { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { InputRadio } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const RadiosField = ({ name, field }) => {
	const { label, validation, shouldDisplay, states, helperText, attributes } = field
	const { t } = useTranslation()
	const { watch, control, defaultValues, getValues } = useFormContext()
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
			control={control}
			name={name}
			rules={toRegister(t("Nx:" + label), local_validation, values, t)}
			render={({ field: { onChange, value } }) => (
				<InputRadio
					variant="default"
					label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
					name={name}
					options={field.options.map((radio) => ({
						value: radio.value,
						label: radio.label || radio.name,
						checked: defaultValues[name]?.includes(radio.value),
					}))}
					defaultValue={field.options.find((option) => {
						return option.value === getValues(name)
					})}
					selectedInput={value}
					setSelectedInput={(e) => {
						onChange(e.value)
					}}
					hasError={!!errorMessage}
					errorMessage={!!errorMessage && errorMessage}
					disabled={local_state.disabled}
					description={helperText}
					aria-label={t(`Nx:${label}`)}
					{...attributes}
				/>
			)}
		/>
	)
}
