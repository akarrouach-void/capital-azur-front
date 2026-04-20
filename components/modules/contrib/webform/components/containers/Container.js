import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { useCheckConditions } from "@vactorynext/core/webform"
import { useFormContext } from "react-hook-form"

export const Container = ({ classes, children, states = [] }) => {
	const { watch } = useFormContext()
	const local_state = useCheckConditions(states, watch)
	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null
	return <div className={vclsx("webform-container", classes)}>{children}</div>
}
