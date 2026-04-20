import React, { useMemo, useState } from "react"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { useFormContext, Controller } from "react-hook-form"
import { Input, Select } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const SelectOtherField = ({ name, field }) => {
	const {
		label,
		title_display,
		validation,
		shouldDisplay,
		states,
		helperText,
		emptyOption,
		emptyValue,
		attributes,
		otherTitle,
	} = field
	const [selectState, setSelectState] = useState("") // State for the 'select' input

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
			rules={toRegister(
				t(`Nx:${selectState !== "other" ? label : otherTitle || label}`),
				local_validation,
				values,
				t
			)}
			render={({ field: { ref, onChange } }) => (
				<>
					<Select
						label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
						labelDisplay={title_display}
						list={[
							...field.options.map((option) => ({
								value: option.value,
								content: option.label || option.value,
							})),
							{ value: "other", content: t("Nx:Other...") },
						]}
						selected={
							selectState === undefined
								? emptyValue !== undefined
									? emptyValue
									: emptyOption !== undefined
										? "emptyOption"
										: selectState
								: selectState
						}
						setSelected={(option) => {
							setSelectState(option)
							if (option === "other") {
								onChange("")
							} else {
								onChange(option)
							}
						}}
						hasError={!!errorMessage}
						description={helperText}
						className={field.class}
						disabled={local_state?.disabled}
						errorMessage={selectState !== "other" && !!errorMessage && errorMessage}
						aria-label={t(`Nx:${label}`)}
						{...attributes}
					/>

					{selectState === "other" && (
						<Input
							label={
								t(`Nx:${otherTitle || label}`) +
								`${local_validation?.required ? " *" : ""}`
							}
							ref={ref}
							rules={toRegister(
								t("Nx:" + otherTitle || label),
								local_validation,
								values,
								t
							)}
							name={name}
							variant="default"
							type="text"
							hasError={!!errorMessage}
							errorMessage={errorMessage}
							onChange={(e) => {
								onChange(e.target.value)
							}}
							placeholder={t("Nx:Enter other option")}
						/>
					)}
				</>
			)}
		/>
	)
}
