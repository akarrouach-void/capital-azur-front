import React from "react"
import get from "lodash.get"
import { useRouter } from "next/router"
import { ConfirmationMessage } from "./ConfirmationMessage"

export const config = {
	id: "vactory_decoupled_webform:webform_confirmation",
}

export const WebFormConfirmationPage = ({ data }) => {
	const backToFormLabel = get(data, "components.0.link", "")
	const router = useRouter()
	let { isSubmitted, message, destination } = router.query
	if (isSubmitted === undefined && message === undefined) return null
	if (isSubmitted || message)
		return (
			<ConfirmationMessage
				message={decodeURIComponent(message)}
				btnLabel={backToFormLabel}
				destination={destination}
			/>
		)
}

export default WebFormConfirmationPage
