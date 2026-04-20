import { forwardRef, useRef } from "react"

import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { inputRadio } from "./theme"

export const InputRadio = forwardRef(
	(
		{
			variant = "default",
			hasError,
			errorMessage,
			label,
			name,
			options,
			selectedInput,
			setSelectedInput,
			disabled,
			description,
			...rest
		},
		ref
	) => {
		return (
			<div className="mb-4">
				<div className={vclsx(inputRadio[variant].label)}>
					{label && <label htmlFor={name}>{label}</label>}
				</div>
				<div className={inputRadio[variant].wrapper}>
					{options.map((option) => {
						return (
							<InputRadioElement
								key={`${name}-${option.value}`}
								selectedInput={
									selectedInput !== undefined
										? options.find((option) => {
												return selectedInput === option.value
											})
										: {}
								}
								setSelectedInput={setSelectedInput}
								name={name}
								option={option}
								{...rest}
								ref={ref}
								disabled={disabled}
							/>
						)
					})}
				</div>
				{hasError && <p className={inputRadio[variant].errorMessage}>{errorMessage}</p>}
				{description && (
					<Wysiwyg className={inputRadio[variant].description} html={description} />
				)}
			</div>
		)
	}
)

const InputRadioElement = forwardRef(
	(
		{
			variant = "default",
			selectedInput,
			setSelectedInput,
			option,
			disabled,
			name,
			...rest
		},
		ref
	) => {
		const inputRadioRef = useRef()

		const handleInputClick = () => {
			if (!disabled) {
				setSelectedInput(option)
				inputRadioRef.current.click()
			}
		}

		return (
			<div className="shrink-0">
				<button
					onClick={handleInputClick}
					type="button"
					className={vclsx(inputRadio[variant].radioContainer, "relative")}
				>
					<input
						type="radio"
						value={option.value}
						checked={selectedInput.value === option.value}
						onChange={() => setSelectedInput(option)}
						id={option.value}
						className="invisible absolute left-56 h-0 w-0"
						disabled={disabled}
						data-testid={`radio-field-${name}-${option.value}`}
						{...rest}
						ref={(e) => {
							typeof ref === "function" && ref?.(e)
							inputRadioRef.current = e
						}}
					/>
					<div
						className={vclsx(
							inputRadio[variant].input,
							selectedInput.value === option.value
								? inputRadio[variant].state.checked
								: inputRadio[variant].state.unChecked,
							disabled
								? "pointer-events-none cursor-not-allowed bg-gray-50"
								: "cursor-pointer"
						)}
					>
						{selectedInput === option && <div className={inputRadio[variant].icon} />}
					</div>
					<label
						htmlFor={option.value}
						className={vclsx(
							"text-sm",
							disabled
								? "pointer-events-none cursor-not-allowed text-gray-400"
								: "cursor-pointer"
						)}
					>
						{option.label}
					</label>
				</button>
			</div>
		)
	}
)
