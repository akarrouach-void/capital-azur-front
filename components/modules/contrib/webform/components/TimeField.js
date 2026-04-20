import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Input } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const TimeField = ({ id, name, field }) => {
	const {
		label,
		placeholder,
		htmlInputType,
		helperText,
		validation,
		shouldDisplay,
		states,
	} = field
	const { t } = useTranslation()
	const { register, watch } = useFormContext()
	const errorMessage = useErrorMessage(name, label, useFormContext)
	const values = watch({ nest: true })
	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	const local_state = useCheckConditions(states, watch)

	if (!isVisible) return null
	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null

	var local_validation

	if (local_state["required"] !== undefined) {
		local_validation = { ...validation, required: local_state.required }
	} else {
		local_validation = { ...validation }
	}

	return (
		<Input
			label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
			variant="default"
			placeholder={placeholder}
			// addonAfter ={ null}
			// addonBefore ={ null}
			// prefix ={ null}
			// sufix ={ null}
			// type={"text"}
			type={htmlInputType || "time"}
			{...register(name, toRegister(t("Nx:" + label), local_validation, values, t))}
			// handleInputChange
			hasError={!!errorMessage}
			errorMessage={errorMessage}
			description={helperText}
			// props

			id={name}
			data-testid={id}
			name={name}
			aria-label={t(`Nx:${label}`)}
		/>
	)
}
