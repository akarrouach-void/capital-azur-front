import React from "react"

import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { useCheckConditions } from "@vactorynext/core/webform"
import { useFormContext } from "react-hook-form"

export const FieldSet = ({
	title = "",
	title_display = "",
	description = "",
	description_display = "",
	classes = "",
	states = [],
	children,
}) => {
	const { watch } = useFormContext()
	const local_state = useCheckConditions(states, watch)
	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null
	return (
		<fieldset
			className={vclsx(
				"webform-fieldset mb-4 w-full",
				"border border-solid border-gray-300 p-3",
				classes
			)}
		>
			{(title_display !== "invisible" || title_display === "") && (
				<legend>{title}</legend>
			)}
			{description && (description_display == "before" || description_display == "") && (
				<Wysiwyg className="mt-1 text-sm text-gray-400" html={description} />
			)}
			{children}
			{description && description_display == "after" && (
				<Wysiwyg className="mt-1 text-sm text-gray-400" html={description} />
			)}
		</fieldset>
	)
}
