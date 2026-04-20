import React, { useRef } from "react"
import { Form } from "@/form"
import get from "lodash.get"
import { useRouter } from "next/router"
import { Wysiwyg } from "@/ui"

export const config = {
	id: "vactory_tender:tender-form",
}

const TenderFormWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const description = get(data, "extra_field.intro.value.#text", null)
	const router = useRouter()
	const { title, tender } = router.query

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}
	const schema = useRef({
		...elements,
		tender: { ...elements.tender, default_value: tender },
	})
	return (
		<>
			{title && <p className="... text-2xl">{title}</p>}
			{description && <Wysiwyg html={description} />}
			<Form
				webformId={webform_id}
				schema={schema.current}
				styles={style}
				buttons={buttons}
			></Form>
		</>
	)
}
export default TenderFormWidget
