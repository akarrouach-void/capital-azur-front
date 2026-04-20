import React from "react"

import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { useCheckConditions } from "@vactorynext/core/webform"
import { useFormContext } from "react-hook-form"

export const Details = ({
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
		<details className={vclsx("webform-details mb-4 w-full", classes)}>
			{(title_display !== "invisible" ||
				title_display === "" ||
				title_display === undefined) && <summary>{title}</summary>}
			{(description_display !== "invisible" ||
				description_display === "" ||
				description_display === "before" ||
				description_display === undefined) && (
				<Wysiwyg html={description} className="mt-1 text-sm text-gray-400" />
			)}

			{children}
		</details>
	)
}
