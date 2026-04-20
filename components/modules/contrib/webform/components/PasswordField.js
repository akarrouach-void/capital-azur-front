import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { InputPassword, Icon } from "@/ui"
import { useCheckConditions } from "@vactorynext/core/webform"

export const PasswordField = ({ name, field }) => {
	const { label, title_display, shouldDisplay, states, attributes } = field
	const { t } = useTranslation()
	const { register, watch } = useFormContext()

	const local_state = useCheckConditions(states, watch)

	const values = watch({ nest: true })

	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	if (!isVisible) return null

	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null

	return (
		<>
			<div className="relative mb-6">
				{label && title_display !== "none" && (
					<label
						className="mb-1 inline-block text-sm font-medium text-gray-700"
						for="password"
					>
						{t(`Nx:${label}`) + ` *`}
					</label>
				)}
				<InputPassword
					id="password"
					name={name}
					autocomplete="off"
					applyValidations={true}
					{...attributes}
				/>
			</div>
			<div className="relative">
				{label && title_display !== "none" && (
					<label
						className="mb-1 inline-block text-sm font-medium text-gray-700"
						for="c_password"
					>
						{t("Nx:Password Confirm") + ` *`}
					</label>
				)}
				<InputPassword
					id="c_password"
					name={"c_password"}
					applyValidations={false}
					{...register("c_password", {
						required: t("Nx:Confirm password is required"),
						validate: (value) => {
							return value === watch().pass || t("The passwords do not match")
						},
					})}
					sufix={
						watch().pass === watch().c_password &&
						watch().c_password != "" &&
						watch().c_password && (
							<Icon id="check-solid" className="h-5 w-5 text-success-500"></Icon>
						)
					}
					autocomplete="off"
					{...attributes}
				/>
			</div>
		</>
	)
}
