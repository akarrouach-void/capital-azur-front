import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "@/ui"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const TextAreaField = ({ name, field }) => {
	const {
		label,
		title_display,
		placeholder,
		helperText,
		validation,
		shouldDisplay,
		states,
		class: itemClass,
	} = field
	const { register, watch } = useFormContext()
	const errorMessage = useErrorMessage(name, label, useFormContext)
	const values = watch({ nest: true })
	const { t } = useTranslation()
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
		<Textarea
			variant="default"
			placeholder={placeholder}
			label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
			description={helperText}
			hasError={!!errorMessage}
			errorMessage={errorMessage}
			rows={3}
			{...register(name, toRegister(t("Nx:" + label), local_validation, {}, t))}
			id={name}
			name={name}
			itemClass={itemClass}
			labelDisplay={title_display}
			aria-label={t(`Nx:${label}`)}
		/>
	)
}
