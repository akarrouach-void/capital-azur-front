import React, { useRef } from "react"
import get from "lodash.get"
import { useRouter } from "next/router"
import { Wysiwyg } from "@/ui"
import dynamic from "next/dynamic"
const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "vactory_job_ads:job-application",
	lazy: true,
}

const JobApplicationWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const description = get(data, "extra_field.intro.value.#text", null)
	const router = useRouter()
	const { title, job } = router.query
	const plain = Buffer.from(title || "", "base64").toString("utf8")
	const schema = useRef({
		...elements,
		job_ad: { ...elements.job_ad, default_value: job },
	})

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	return (
		<>
			{plain && <p className="... text-2xl">{plain}</p>}
			{description && <Wysiwyg html={description} />}
			<Form
				title={title}
				webformId={webform_id}
				schema={schema.current}
				styles={style}
				buttons={buttons}
			></Form>
		</>
	)
}

export default JobApplicationWidget
