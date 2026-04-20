import React, { forwardRef, useRef } from "react"

import { Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { checkbox } from "./theme"

export const Checkbox = forwardRef(
	(
		{
			variant = "default",
			label,
			disabled = false,
			checked = false,
			setChecked,
			hasError,
			errorMessage,
			className,
			description,
			name,
			...rest
		},
		ref
	) => {
		const checkboxRef = useRef()

		const toggleCheckbox = () => {
			!disabled && checkboxRef.current.click()
		}

		const getCheckboxStateClass = () => {
			if (checked && disabled) {
				return checkbox[variant].checked["disabled"]
			}
			if (checked && !disabled) {
				return checkbox[variant].checked["enabled"]
			}
			if (!checked && disabled) {
				return checkbox[variant].unchecked["disabled"]
			}
			return checkbox[variant].unchecked["enabled"]
		}

		return (
			<button
				className={vclsx("relative", className)}
				onClick={toggleCheckbox}
				type="button"
			>
				<input
					type="checkbox"
					className="invisible absolute left-56 h-0 w-0"
					disabled={disabled}
					onChange={!disabled && setChecked}
					id={name}
					name={name}
					data-testid={`checkbox-field-${name}`}
					{...rest}
					ref={(e) => {
						ref?.(e)
						checkboxRef.current = e
					}}
				/>
				<div className={checkbox[variant].wrapper}>
					<div
						aria-label={label}
						className={vclsx(checkbox[variant].input, getCheckboxStateClass())}
					>
						<Icon id={checked ? "check" : ""} className={checkbox[variant].icon} />
					</div>
					<span
						className={vclsx(
							disabled
								? checkbox[variant].label["disabled"]
								: checkbox[variant].label["enabled"]
						)}
					>
						{label}
					</span>
				</div>
				{hasError && (
					<span className={checkbox[variant].errorMessage}>{errorMessage}</span>
				)}
				{description && (
					<Wysiwyg className={checkbox[variant].description} html={description} />
				)}
			</button>
		)
	}
)
