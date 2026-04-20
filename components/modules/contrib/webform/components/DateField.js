import React, { useMemo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Input } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const DateField = ({ id, name, field }) => {
	const {
		label,
		title_display,
		placeholder,
		helperText,
		validation,
		shouldDisplay,
		states,
		dateMin,
		dateMax,
		attributes,
	} = field
	const { t } = useTranslation()
	const { watch, control } = useFormContext()
	const errorMessage = useErrorMessage(name, label, useFormContext)
	const values = watch({ nest: true })
	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	const local_state = useCheckConditions(states, watch)

	// Only use text type if placeholder exists, otherwise use date
	const [inputType, setInputType] = useState(placeholder ? "text" : "date")

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

	const convertDate = (date) => {
		const current_date = new Date()
		if (/^[+-]?\d+ (years|months|days)$/.test(date)) {
			const [, sign, numericValue, unit] = date.match(
				/^([+-]?)(\d+) (years|months|days)$/
			)
			const multiplier = sign === "-" ? -1 : 1
			if (unit === "years") {
				current_date.setFullYear(current_date.getFullYear() + numericValue * multiplier)
			} else if (unit === "months") {
				current_date.setMonth(current_date.getMonth() + numericValue * multiplier)
			} else if (unit === "days") {
				current_date.setDate(current_date.getDate() + numericValue * multiplier)
			}
			return current_date.toISOString().slice(0, 10)
		} else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return date
		} else if (/^today$/.test(date)) {
			return current_date.toISOString().slice(0, 10)
		}
		return null
	}

	return (
		<Controller
			control={control}
			name={name}
			rules={toRegister(t("Nx:" + label), local_validation, values, t)}
			render={({ field }) => (
				<Input
					label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
					variant="default"
					placeholder={placeholder}
					max={convertDate(dateMax)}
					min={convertDate(dateMin)}
					type={inputType}
					{...field}
					{...(placeholder
						? {
								onFocus: () => {
									setInputType("date")
								},
								onBlur: (e) => {
									field.onBlur()
									if (!e.target.value || e.target.value === "") {
										setInputType("text")
									}
								},
							}
						: {})}
					hasError={!!errorMessage}
					errorMessage={errorMessage}
					description={helperText}
					id={name}
					data-testid={id}
					name={name}
					labelDisplay={title_display}
					aria-label={t(`Nx:${label}`)}
					{...attributes}
				/>
			)}
		/>
	)
}
