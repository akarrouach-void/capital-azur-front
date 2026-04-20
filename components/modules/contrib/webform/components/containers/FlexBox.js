import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { useCheckConditions } from "@vactorynext/core/webform"
import { useFormContext } from "react-hook-form"

export const FlexBox = ({
	align_items = "items-start",
	classes = "",
	states = [],
	children,
}) => {
	const { watch } = useFormContext()
	const local_state = useCheckConditions(states, watch)
	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null
	switch (align_items) {
		case "flex-end":
			align_items = "items-end"
			break
		case "center":
			align_items = "items-center"
			break
		default:
			align_items = "items-start"
			break
	}

	return (
		<div
			className={vclsx("webform-flexbox", "-mx-2 flex flex-wrap", align_items, classes)}
		>
			{children}
		</div>
	)
}
