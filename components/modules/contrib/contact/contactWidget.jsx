import React from "react"
import get from "lodash.get"
import { Wysiwyg } from "@/ui"
import { Link } from "@/ui"
import dynamic from "next/dynamic"
const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "vactory_contact:contact",
	lazy: true,
}

export const WebformWidgetContainer = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	// const component = get(data, 'components.0.component', null);
	const title = get(data, "extra_field.title", null)
	const description = get(data, "extra_field.intro.value.#text", null)
	const link = get(data, "extra_field.link.url", null)
	const link_label = get(data, "extra_field.link.title", null)

	const autosave = get(data, "components.0.webform.autosave", null)

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	return (
		<div className="my-10">
			{title ||
				(description && (
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
				))}

			{elements && (
				<Form
					webformId={webform_id}
					schema={elements}
					styles={style}
					buttons={buttons}
					autoSaveSettings={autosave}
				/>
			)}

			{link && (
				<div className="mt-12 flex justify-center">
					<Link
						href={link}
						className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						{link_label}
					</Link>
				</div>
			)}
		</div>
	)
}

export default WebformWidgetContainer
