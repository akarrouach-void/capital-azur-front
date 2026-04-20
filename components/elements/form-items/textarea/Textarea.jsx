import React, { forwardRef, useState } from "react"

import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { textarea } from "./theme"

export const Textarea = forwardRef(
	(
		{
			variant = "default",
			placeholder,
			handleTextareaChange,
			label,
			labelDisplay = "default",
			description,
			hasError,
			errorMessage,
			rows = 1,
			resize = true,
			showCounter = false,
			maxLength = null,
			name,
			itemClass,
			...rest
		},
		ref
	) => {
		const [length, setLength] = useState(0)
		const onTextareaChange = (e) => {
			let inputValue = e.target.value
			setLength(inputValue.split("").length)
			handleTextareaChange?.(e.target.value)
		}
		return (
			<div
				className={vclsx(
					"relative mb-4 w-full",
					["after", "inline"].indexOf(labelDisplay) > -1 && "flex flex-wrap",
					labelDisplay == "inline" && "md:items-center"
				)}
			>
				{label && labelDisplay !== "none" && (
					<label
						className={vclsx(
							textarea[variant].label,
							labelDisplay == "invisible" && "sr-only",
							labelDisplay == "inline" &&
								"shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
							labelDisplay == "after" && "order-2 mt-4"
						)}
						htmlFor={name}
					>
						{label}
					</label>
				)}
				<div
					className={vclsx(
						"w-full",
						labelDisplay == "inline" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
						labelDisplay == "after" && "order-1"
					)}
				>
					<textarea
						ref={ref}
						className={vclsx(
							textarea[variant].base,
							!resize && textarea[variant].resize,
							hasError && textarea[variant].hasError,
							itemClass
						)}
						placeholder={placeholder}
						onChange={(e) => {
							onTextareaChange(e)
						}}
						rows={rows}
						maxLength={showCounter ? maxLength : null}
						id={name}
						name={name}
						data-testid={`text-area-field-${name}`}
						{...rest}
					/>
					{showCounter && maxLength !== null && (
						<span className="absolute bottom-2 right-2 text-sm">{`${length}/${maxLength}`}</span>
					)}
					{errorMessage && hasError && (
						<p className={textarea[variant].errorMessage}>{errorMessage}</p>
					)}
					{description && (
						<Wysiwyg className={textarea[variant].description} html={description} />
					)}
				</div>
			</div>
		)
	}
)

export default Textarea
