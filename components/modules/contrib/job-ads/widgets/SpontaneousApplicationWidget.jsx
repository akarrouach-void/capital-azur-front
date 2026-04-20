import React from "react"
import get from "lodash.get"
import dynamic from "next/dynamic"
const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "vactory_job_ads:spontaneous-application",
	lazy: true,
}

const SpontaneousApplicationWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	return (
		<Form
			webformId={webform_id}
			schema={elements}
			styles={style}
			buttons={buttons}
		></Form>
	)
}

export default SpontaneousApplicationWidget
