import React, { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Checkbox } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const CheckboxField = ({ name, field }) => {
	const { label, validation, shouldDisplay, states, helperText, attributes } = field
	const { t } = useTranslation()
	const { register, watch, control } = useFormContext()
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
		<div className="mb-4 w-full">
			<Controller
				control={control}
				name={name}
				rules={toRegister(t("Nx:" + label), local_validation, values, t)}
				render={({ field: { onChange } }) => (
					<Checkbox
						variant="default"
						label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
						name={name}
						type="checkbox"
						id={name}
						checked={values[name]}
						setChecked={(e) => {
							onChange(e.value)
						}}
						{...register(name, toRegister(name, local_validation, values, t))}
						hasError={!!errorMessage}
						errorMessage={!!errorMessage && errorMessage}
						disabled={local_state.disabled}
						description={helperText}
						aria-label={t(`Nx:${label}`)}
						{...attributes}
					/>
				)}
			/>
		</div>
	)
}
