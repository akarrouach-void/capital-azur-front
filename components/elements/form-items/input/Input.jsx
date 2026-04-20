import { useRouter } from "next/router"
import React, { forwardRef, useRef } from "react"

import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { Keyboard } from "../arabic-keyboard/arabicKeyboard"
import { input } from "./theme"

// Helper functions to reduce cognitive complexity
const getInputWrapperClass = (addonBefore, addonAfter, variant) => {
	if (addonBefore && addonAfter) {
		return input[variant].inputWrapper.inside
	}
	if (addonAfter) {
		return input[variant].inputWrapper.left
	}
	if (addonBefore) {
		return input[variant].inputWrapper.right
	}
	return input[variant].inputWrapper.full
}

const getLabelClasses = (variant, labelDisplay) => {
	return vclsx(
		input[variant].label,
		labelDisplay === "invisible" && "sr-only",
		labelDisplay === "inline" && "shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
		labelDisplay === "after" && "order-2 mt-4"
	)
}

const getContainerClasses = (variant, labelDisplay) => {
	return vclsx(
		input[variant].container,
		labelDisplay === "after" && "flex flex-wrap",
		labelDisplay === "inline" && "flex flex-wrap md:items-center"
	)
}

const getWrapperClasses = (variant, wrapperClass, type, hasError, labelDisplay) => {
	return vclsx(
		wrapperClass,
		input[variant].wrapper,
		type === "hidden" && "border-none",
		hasError && input[variant].hasError,
		labelDisplay === "inline" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
		labelDisplay === "after" && "border-1"
	)
}

const handleRefAssignment = (element, forwardedRef, inputRef) => {
	if (forwardedRef) {
		if (typeof forwardedRef === "function") {
			forwardedRef(element)
		} else {
			forwardedRef.current = element
		}
	}
	inputRef.current = element
}

export const Input = forwardRef(
	(
		{
			label,
			labelDisplay = "default",
			variant = "default",
			placeholder,
			addonAfter = null,
			addonBefore = null,
			prefix = null,
			sufix = null,
			type = "text",
			handleSufixClick = null, // this only used in password case and it maight be optimized
			handleInputChange,
			hasError,
			errorMessage,
			description,
			disabled,
			inputClass,
			wrapperClass,
			setValue,
			name,
			...rest
		},
		forwardedRef
	) => {
		// const displayOfLabel = ["default", "before", "after", "inline", "invisible", "none"]

		const inputRef = useRef()
		const router = useRouter()
		const { locale } = router

		const shouldShowLabel = type !== "hidden" && label && labelDisplay !== "none"

		return (
			<div className={getContainerClasses(variant, labelDisplay)}>
				{shouldShowLabel && (
					<label className={getLabelClasses(variant, labelDisplay)} htmlFor={name}>
						{label}
					</label>
				)}
				<div
					className={getWrapperClasses(
						variant,
						wrapperClass,
						type,
						hasError,
						labelDisplay
					)}
				>
					{addonBefore && (
						<div className={vclsx("flex", input[variant].addonBefore)}>{addonBefore}</div>
					)}
					<span
						className={vclsx(
							getInputWrapperClass(addonBefore, addonAfter, variant),
							hasError && input[variant].hasError
						)}
					>
						{prefix && <div className={vclsx(input[variant].prefix)}>{prefix}</div>}
						<input
							ref={(element) => handleRefAssignment(element, forwardedRef, inputRef)}
							onChange={(e) => handleInputChange?.(e.target.value)}
							className={vclsx(
								input[variant].input,
								disabled && "cursor-not-allowed bg-gray-50",
								inputClass
							)}
							type={type}
							placeholder={placeholder}
							disabled={disabled}
							id={name}
							name={name}
							data-testid={`text-field-${name}`}
							{...rest}
						/>
						{sufix && (
							<button
								type="button"
								className={vclsx(input[variant].sufix)}
								onClick={() => {
									handleSufixClick?.()
								}}
								onKeyDown={(e) => {
									e.key === "Enter" && handleSufixClick?.()
								}}
								tabIndex={0}
							>
								{sufix}
							</button>
						)}
					</span>
					{addonAfter && (
						<div className={vclsx("flex", input[variant].addonAfter)}>{addonAfter}</div>
					)}
				</div>
				{locale === "ar" && (
					<Keyboard
						name={name}
						inputRef={inputRef}
						inputClass={inputClass}
						setValue={setValue}
					/>
				)}

				{errorMessage && hasError && (
					<p data-testid="error-message" className={input[variant].errorMessage}>
						{errorMessage}
					</p>
				)}
				{description && (
					<Wysiwyg className={input[variant].description} html={description} />
				)}
			</div>
		)
	}
)
