import React from "react"
import get from "lodash.get"
import { Heading, Wysiwyg } from "@/ui"
import { Link } from "@/ui"
import dynamic from "next/dynamic"
import { useAccount } from "@vactorynext/core/hooks"
const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "vactory_decoupled_webform:webform",
	lazy: true,
}

export const WebformWidgetContainer = ({ data }) => {
	const { isAuthenticated } = useAccount()
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.elements.buttons.actions.actions", {})
	// const component = get(data, 'components.0.component', null);
	const title = get(data, "extra_field.title", null)
	const description = get(data, "extra_field.intro.value.#text", null)
	const link = get(data, "extra_field.link.url", null)
	const link_label = get(data, "extra_field.link.title", null)

	const autosave = get(data, "components.0.webform.autosave", null)

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (typeof buttons === "string" && buttons !== "") {
		try {
			buttons = JSON.parse(buttons)
		} catch (e) {
			console.error("Failed to parse JSON:", e)
			buttons = {}
		}
	}

	// Make sure that captcha field has "Mode admin" checked for this work
	if (isAuthenticated) {
		delete elements.captcha
	}

	return (
		<div className="my-10">
			{(title || description) && (
				<div className="mb-6 flex flex-col items-center gap-3">
					{title && (
						<Heading className="text-center text-gray-900" level={2}>
							{title}
						</Heading>
					)}
					{description && (
						<Wysiwyg
							html={description}
							className="prose !max-w-3xl text-center text-sm text-gray-900"
						/>
					)}
				</div>
			)}

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
