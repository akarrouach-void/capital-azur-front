import {
	numberInputOnWheelPreventChange,
	process,
	useCheckConditions,
	useErrorMessage,
	toRegister,
	injectTelValidation,
} from "@vactorynext/core/webform"

import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useFormContext, Controller } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Input, PhoneInput } from "@/ui"
import { isPossiblePhoneNumber } from "react-phone-number-input"
import "react-phone-input-2/lib/style.css"
import fr from "react-phone-input-2/lang/fr.json"
import ar from "react-phone-input-2/lang/ar.json"

export const TextField = ({ name, field }) => {
	const {
		label,
		title_display,
		placeholder,
		htmlInputType,
		helperText,
		validation,
		shouldDisplay,
		states,
		class: inputClass,
		wrapperClass,
		attributes,
	} = field
	const { t } = useTranslation()
	const { register, watch, setValue, control } = useFormContext()
	const router = useRouter()
	const { locale } = router
	const local_state = useCheckConditions(states, watch)

	const errorMessage = useErrorMessage(name, label, useFormContext)
	const values = watch({ nest: true })

	// Config for Input Phone International
	let telCountriesConf = {
		isInternational: attributes?.international,
		initialCountry: attributes?.international_initial_country?.toLowerCase() || "ma",
		preferredCountries: attributes?.international_preferred_countries
			? attributes?.international_preferred_countries.map((el) => el.toLowerCase())
			: null,
	}

	const [countrycode, setCountryCode] = useState(telCountriesConf?.initialCountry)

	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

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

	// Injecting Regex for input type tel from here, unless it's assigned from the BO ( only for type "tel" and not international)
	local_validation = injectTelValidation(
		// Check if input type is "tel" and internationalization is false
		htmlInputType === "tel" && !telCountriesConf?.isInternational,
		local_validation,
		{
			pattern: "/^(05|06|07)[0-9]{8}$/",
			patternError:
				"Please enter a valid 10-digit mobile number that starts with either 05 or 06 or 07",
		}
	)

	const { onChange, ...registerFuncs } = register(
		name,
		toRegister(t("Nx:" + label), local_validation, values, t)
	)

	const revertProcess = (e) => {
		if (process[field["process"]] !== undefined) {
			process[field["process"]](e)
		}
	}

	const validatePhoneNumber = () => {
		// Implement your custom validation logic here
		// Return true if valid, or return a string message if invalid

		if (
			values[name] == undefined ||
			(isPossiblePhoneNumber(values?.[name] || "", countrycode) &&
				values[name].length > 9)
		) {
			return true
		}

		if (values[name] == undefined || values?.[name]?.length <= 3) return true

		return t("Nx:Invalid phone number") // Error message
	}

	const localisation = {
		ar: ar,
		fr: fr,
		//en: en,
	}

	if (htmlInputType === "tel" && telCountriesConf?.isInternational) {
		return (
			<div className="relative mb-5 w-full">
				<label
					className="mb-1 inline-block text-sm font-medium text-gray-700"
					htmlFor={name}
				>
					{t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
				</label>
				<Controller
					name={name} // Correctly set the name prop here
					control={control}
					rules={{ validate: validatePhoneNumber }}
					{...registerFuncs}
					render={({ field }) => (
						<div className="relative flex w-full rounded-lg border border-gray-300 hover:border-gray-400">
							<span className="focus-within:ring-warning-400-full relative flex w-full grow focus-within:ring-1">
								<PhoneInput
									international
									country={telCountriesConf?.initialCountry}
									placeholder={t("Nx:Enter phone number")}
									defaultCountry={telCountriesConf?.initialCountry}
									enableSearch={true}
									disableSearchIcon={true}
									rules={{ required: "Phone number is required" }} // Add your validation rules here
									{...registerFuncs}
									localization={localisation[locale]}
									onlyCountries={telCountriesConf?.preferredCountries}
									inputClass="w-full px-3 py-3 text-sm placeholder-gray-500 border-none outline-none appearance-none grow focus:ring-0 text-left !w-full !border-0 py-[20px] px-[40px] !h-11"
									value={field?.value || field?.default_value} // Bind the PhoneInput value to the form value via field.value
									onChange={field.onChange} // Use field.onChange for change handling
									onBlur={field.onBlur} // Use field.onBlur for blur handling
									searchPlaceholder={t("Nx:Search")}
									searchNotFound={t("Nx:No entries to show")}
									hasError={!!validatePhoneNumber()}
									errorMessage={t("Nx:Invalid phone number")}
									aria-label={t(`Nx:phone number}`)}
									id={name}
									isValid={(inputNumber, country) => {
										setCountryCode(country?.iso2.toUpperCase())
										if (
											values[name] == undefined ||
											(isPossiblePhoneNumber(values?.[name] || "", countrycode) &&
												values[name].length > 9)
										) {
											return true
										}
										return false // Error message
									}}
								/>
							</span>
						</div>
					)}
				/>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
			</div>
		)
	}

	return (
		<Input
			label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
			variant="default"
			placeholder={placeholder}
			type={htmlInputType ? (htmlInputType === "tel" ? "number" : htmlInputType) : "text"}
			hasError={!!errorMessage}
			errorMessage={errorMessage}
			onChange={(e) => {
				onChange(e)
				revertProcess(e)
			}}
			{...registerFuncs}
			disabled={local_state?.disabled}
			description={helperText}
			labelDisplay={title_display}
			// aria-describedby={name}
			aria-label={t(`Nx:${label}`)}
			inputClass={inputClass}
			wrapperClass={wrapperClass}
			onWheel={numberInputOnWheelPreventChange}
			// setValue was passed to the Arabic Keybaord via the Input component to keep the same context for the whole Form elements
			setValue={setValue}
		/>
	)
}
