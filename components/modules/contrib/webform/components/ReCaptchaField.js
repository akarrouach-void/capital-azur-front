import React, { useMemo, useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useErrorMessage, toRegister } from "@vactorynext/core/webform"
import { Recaptcha, Input } from "@/ui"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import { useFlag } from "@vactory/console/client"

export const ReCaptchaField = ({ field }) => {
	const { t, activeLocale } = useTranslation()
	const { label, validation, shouldDisplay, captcha_type, placeholder } = field
	const { register, watch, control, setValue } = useFormContext()
	const errorMessage = useErrorMessage("g-recaptcha-response", label, useFormContext)
	const mathErrorMessage = useErrorMessage("captcha_response", label, useFormContext)
	const values = watch({ nest: true })
	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	const [question, setQuestion] = useState("")
	const [response, setResponse] = useState("")

	const generateCaptchaMath = async () => {
		try {
			const response = await drupal.fetch(`_webform/captcha_math/contact`, {
				method: "GET",
			})
			if (response.ok) {
				const result = await response.json()
				setValue("captcha_sid", result?.csid)
				setQuestion(`${result?.num1} + ${result?.num2}`)
				setResponse(parseInt(result?.num1) + parseInt(result?.num2))
			}
		} catch (err) {
			console.error("Captcha: error while generating", err)
		}
	}

	useEffect(() => {
		if (captcha_type == "captcha/Math") {
			generateCaptchaMath()
		}
	}, [])

	const isEnabled = useFlag("captcha")
	if (!isEnabled) {
		return (
			<>
				<input name="captcha_sid" {...register("captcha_sid")} type="hidden" value="" />
				<input
					name="g-recaptcha-response"
					{...register("g-recaptcha-response")}
					type="hidden"
					value=""
				/>
			</>
		)
	}

	return isVisible ? (
		captcha_type == "captcha/Math" ? (
			<>
				<input name="captcha_sid" {...register("captcha_sid")} type="hidden" />

				<Input
					label={
						t(`Nx:Question de sécurité`) +
						` ${question} ${validation?.required ? " *" : ""}`
					}
					variant="default"
					placeholder={placeholder}
					type="text"
					name="captcha_response"
					hasError={!!mathErrorMessage}
					errorMessage={mathErrorMessage}
					{...register("captcha_response", {
						required: t("Nx:Captcha field is required"),
						validate: {
							correct: (value) =>
								parseInt(value) == response || t("Nx:Captcha field is not valid"),
						},
					})}
				/>
			</>
		) : (
			<Controller
				control={control}
				name="g-recaptcha-response"
				rules={toRegister("g-recaptcha-response", validation, values, t)}
				render={({ field: { onChange, value } }) => {
					return (
						<Recaptcha
							{...register(
								"g-recaptcha-response",
								toRegister("g-recaptcha-response", validation, values, t)
							)}
							hl={activeLocale}
							hasError={!!errorMessage}
							errorMessage={!!errorMessage && errorMessage}
							onChange={onChange}
							value={value}
						/>
					)
				}}
			/>
		)
	) : null
}
