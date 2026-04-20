import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { process, useCheckConditions, toRegister } from "@vactorynext/core/webform"

export const RangeField = ({ name, field }) => {
	const {
		label,
		attributes,
		validation,
		states,
		value: defaultValue,
		setValueInput,
		disabled = false,
	} = field
	const { max, min, step } = attributes
	const { register, watch } = useFormContext()
	const { t } = useTranslation()
	const localState = useCheckConditions(states, watch)
	const [isTyping, setIsTyping] = useState(false)
	const values = watch({ nest: true })
	let default_value = defaultValue || values[name]
	const [value, setValue] = useState(default_value || min)
	const [inputValue, setInputValue] = useState(value)

	const handleRangeChange = (e) => {
		const newValue = Number(e.target.value)
		setValue(newValue)
		setInputValue(newValue)
		typeof setValueInput === "function" && setValueInput(newValue)
	}

	const handleInputChange = (e) => {
		const newValue = e.target.value
		setInputValue(newValue === "" ? newValue : Number(newValue))
		typeof setValueInput === "function" &&
			setValueInput(newValue === "" ? newValue : Number(newValue))
	}

	useEffect(() => {
		const delay = 1000
		let timer

		if (isTyping) {
			timer = setTimeout(() => {
				const newValue = Math.min(max, Math.max(min, inputValue))
				setValue(newValue)
				setInputValue(newValue)
			}, delay)
		} else {
			const newValue = Math.min(max, Math.max(min, inputValue))
			setValue(newValue)
			setInputValue(newValue)
		}

		return () => clearTimeout(timer)
	}, [inputValue, min, max, isTyping])

	useEffect(() => {
		setInputValue(defaultValue)
	}, [defaultValue])

	const localValidation =
		localState?.required !== undefined
			? { ...validation, required: localState.required }
			: { ...validation }

	const { onChange, ...registerFuncs } = register(
		name,
		toRegister(t("Nx:" + label), localValidation, values, t)
	)

	const revertProcess = (e) => {
		process[field["process"]] !== undefined ? process[field["process"]](e) : null
	}

	return (
		<div className="mb-4 flex w-full flex-col">
			<div className="flex w-full items-center justify-between">
				{label && (
					<label className="text-thegray4 block font-normal" htmlFor={name}>
						{label}
					</label>
				)}

				<input
					id={name}
					name={name}
					type="number"
					min={min}
					step={step}
					max={max}
					value={inputValue}
					disabled={disabled}
					onChange={(e) => (handleInputChange(e), setIsTyping(true))}
					className="range-input block px-6 py-3 md:hidden"
				/>
			</div>

			<div className="flex w-full items-center gap-3">
				<div className="relative w-full overflow-hidden py-2">
					<input
						type="range"
						id="custom-range"
						{...register(
							name,
							toRegister(t("Nx:" + label), localValidation?.required, values, t)
						)}
						min={min}
						max={max}
						onChange={(e) => {
							handleRangeChange(e)
							onChange(e)
							revertProcess(e)
							setIsTyping(false)
						}}
						step={step}
						{...registerFuncs}
						value={value}
						disabled={disabled}
						className="h-2 w-full rounded-full outline-none"
					/>
					<div
						className="pointer-events-none absolute left-0 top-0 z-[1] mt-[18px] h-2 rounded-full bg-black"
						style={{
							width: `${((value - min) / (max - min)) * 100}%`,
						}}
					/>
				</div>
				<input
					type="number"
					min={min}
					max={max}
					step={step}
					name={name}
					value={inputValue}
					disabled={disabled}
					onChange={(e) => (handleInputChange(e), setIsTyping(true))}
					className="range-input hidden px-2 md:block"
				/>
			</div>
		</div>
	)
}
