import { passwordStrength } from "check-password-strength"
import { forwardRef, Fragment, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Transition } from "@headlessui/react"
import { Icon, Input } from "@/ui"
import { useI18n, useI18n as useTranslation } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

import { input } from "./theme"

const validations = [
	{
		name: "passWordLength",
		pattern: /.{8,}/,
		messageError: "This is too short",
		ruleString: "Minimum 8 characters",
	},
	{
		name: "hasSpecialCaracter",
		pattern: "[$&+,:;=?@#|'<>.^*()%!-]",
		messageError: "It doesn't contain special caracter",
		ruleString: "Password must contain at least one special character",
	},
	{
		name: "hasCapitalLetter",
		pattern: ".*[A-Z].*",
		messageError: "Doesn't have a capital letter",
		ruleString: "Password must contain at least one capital character",
	},
	{
		name: "hasNumber",
		pattern: /\d/,
		messageError: "Doesn't contains a number",
		ruleString: "Password must contain at least one number",
	},
]

const PasswordConstraint = ({ validity, constraint }) => {
	const { t } = useTranslation()
	return (
		<Transition
			as={Fragment}
			show={validity}
			enter="transition duration-[400ms]"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="duration-200 transition ease-in-out"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="flex items-center space-x-2">
				<span className="text-xs text-gray-500">{t(`Nx:${constraint}`)}</span>
			</div>
		</Transition>
	)
}

const generateValidationFunction = (validations, validation) => {
	const validationFunction = (arg) => {
		let regex = new RegExp(validation.pattern)
		return regex.test(arg) || validation.messageError
	}
	validations[validation.name] = validationFunction
	return validationFunction
}

const generateValidationFunctions = () => {
	let validationsFunctions = {}
	validations.forEach((validation) => {
		generateValidationFunction(validationsFunctions, validation)
	})
	return validationsFunctions
}

const getPasswordStrengthStyles = (inputValue, score) => {
	if (inputValue === null) {
		return "w-0"
	}

	switch (score) {
		case 0:
			return "w-3/12 bg-error-600"
		case 1:
			return "w-6/12 bg-warning-600"
		case 2:
			return "w-9/12 bg-warning-600"
		case 3:
			return "w-12/12 bg-success-600"
		default:
			return "w-0"
	}
}

const PasswordStrengthIndicator = ({ inputValue, score }) => (
	<div className="mb-2 mt-3 h-1 w-full bg-gray-100">
		<div
			className={vclsx(
				"h-1 transition-all",
				getPasswordStrengthStyles(inputValue, score)
			)}
		></div>
	</div>
)

const PasswordConstraints = ({ validatePattern }) => (
	<div className="flex flex-col gap-x-2">
		{validations.map((constraint) => {
			return (
				<PasswordConstraint
					key={constraint.name}
					constraint={constraint.ruleString}
					validity={!validatePattern(constraint.pattern)}
				/>
			)
		})}
	</div>
)

const InputLabel = ({ type, label, labelDisplay, name, variant }) => {
	if (type === "hidden" || !label || labelDisplay === "none") {
		return null
	}

	return (
		<label
			className={vclsx(
				input[variant].label,
				labelDisplay == "invisible" && "sr-only",
				labelDisplay == "inline" && "shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
				labelDisplay == "after" && "order-2 mt-4"
			)}
			htmlFor={name}
		>
			{label}
		</label>
	)
}

export const InputPassword = forwardRef(
	(
		{
			name,
			applyValidations = true,
			labelDisplay,
			type,
			label,
			variant = "default",
			sufix = null,
			...rest
		},
		ref
	) => {
		const [inputValue, setInputValue] = useState(null)
		const [score, setScore] = useState(0)
		const [isPasswordVisible, setIsPasswordVisible] = useState(false)
		const {
			register,
			formState: { errors },
		} = useFormContext()
		const { t } = useI18n()

		const validatePattern = (pattern) => {
			let regex = new RegExp(pattern)
			return regex.test(inputValue)
		}

		const handleChange = (e) => {
			let inputValue = e.target.value
			if (inputValue === "") {
				setInputValue(null)
			} else {
				setInputValue(inputValue)
			}

			setScore(passwordStrength(e.target.value).id)
		}

		const handleEyeButtonClick = () => {
			setIsPasswordVisible((prev) => {
				return !prev
			})
		}

		const hasError = () => {
			return !!errors[name]
		}

		const restFields = applyValidations
			? register(name, {
					required: t("Nx:Le champ") + " " + name + " " + t("Nx:est requis."),
					validate: applyValidations && generateValidationFunctions(),
				})
			: { ...rest, ref, name }

		return (
			<div
				className={vclsx(
					labelDisplay == "after" && "flex flex-wrap",
					labelDisplay == "inline" && "flex flex-wrap md:items-center"
				)}
			>
				<InputLabel
					type={type}
					label={label}
					labelDisplay={labelDisplay}
					name={name}
					variant={variant}
				/>
				<Input
					type={isPasswordVisible ? "text" : "password"}
					{...restFields}
					onChange={(e) => {
						restFields.onChange(e)
						handleChange(e)
					}}
					hasError={hasError()}
					errorMessage={errors[name]?.message}
					sufix={sufix || <Icon id="eye" className="h-5 w-5 text-black" />}
					handleSufixClick={handleEyeButtonClick}
					name={name}
				/>
				{applyValidations && (
					<PasswordStrengthIndicator inputValue={inputValue} score={score} />
				)}
				{applyValidations && <PasswordConstraints validatePattern={validatePattern} />}
			</div>
		)
	}
)
