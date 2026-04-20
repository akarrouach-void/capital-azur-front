import { Heading, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { useCheckConditions } from "@vactorynext/core/webform"
import { useFormContext } from "react-hook-form"

export const Section = ({
	children,
	classes = "",
	title = "",
	title_display = "",
	description = "",
	description_display = "",
	states = [],
}) => {
	const { watch } = useFormContext()
	const local_state = useCheckConditions(states, watch)
	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null
	return (
		<div className={vclsx("webform-section mb-4 w-full", classes)}>
			{(title_display !== "invisible" ||
				title_display === "" ||
				title_display === undefined) && (
				<Heading level={3} variant={5} className="mb-4">
					{title}
				</Heading>
			)}

			{(description_display !== "invisible" ||
				description_display === "" ||
				description_display === undefined) && (
				<Wysiwyg html={description} className="mt-1 text-sm text-gray-400" />
			)}

			{children}
		</div>
	)
}
