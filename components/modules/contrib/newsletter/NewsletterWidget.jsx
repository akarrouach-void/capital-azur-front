import React from "react"
import get from "lodash.get"
import { Wysiwyg } from "@/ui"
import dynamic from "next/dynamic"
const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "newsletter_webform:newsletter",
	lazy: true,
}

export const NewsletterWebformWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const title = get(data, "extra_field.title", null)
	const description = get(data, "extra_field.intro.value.#text", null)

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	return (
		<div className="my-10">
			<div className="mb-12 text-center">
				{title && (
					<h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
						{title}
					</h2>
				)}
				{description && (
					<div className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
						<Wysiwyg html={description} />
					</div>
				)}
			</div>

			{elements && (
				<Form webformId={webform_id} schema={elements} styles={style} buttons={buttons} />
			)}
		</div>
	)
}

export default NewsletterWebformWidget
