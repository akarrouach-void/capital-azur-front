import dynamic from "next/dynamic"
import get from "lodash.get"
import { useState } from "react"

export const config = {
	id: "capital_azur_decoupled:contact-form",
	lazy: true,
}

const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export default function ContactUsWidget({ data }) {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})

	const title = get(data, "extra_field.title", "")
	const description = get(data, "extra_field.description", "")

	const [isSuccess, setIsSuccess] = useState(false)

	if (style !== "") style = JSON.parse(style)

	if (buttons !== "") buttons = JSON.parse(buttons)

	return (
		<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			{title && (
				<h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
			)}
			{description && <p className="mb-12 mt-4 text-lg text-gray-500">{description}</p>}

			{isSuccess && (
				<div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
					Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs
					délais.
				</div>
			)}

			{elements && (
				<Form
					webformId={webform_id}
					schema={elements}
					styles={style}
					buttons={buttons}
					handleSubmitRedirection={false}
					reset={true}
					onSuccess={() => setIsSuccess(true)}
				/>
			)}
		</div>
	)
}
