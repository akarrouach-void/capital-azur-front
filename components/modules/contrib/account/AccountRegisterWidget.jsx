import { useEffect } from "react"
import get from "lodash.get"
import { Wysiwyg, Link, Heading } from "@/ui"
import { Form } from "@/form"
import { dlPush } from "@vactorynext/core/lib"
import { useAccount } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_decoupled_espace_prive:signup",
	lazy: true,
}

/**
 * Delete nested key inside object.
 */
function deleteNestedKey(obj, keyToDelete) {
	for (let prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			if (prop === keyToDelete) {
				delete obj[prop]
			} else if (typeof obj[prop] === "object") {
				deleteNestedKey(obj[prop], keyToDelete)
			}
		}
	}
}

export const AccountRegisterWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	const buttons = get(data, "components.0.webform.elements.buttons", {})
	const title = get(data, "extra_field.title", null)
	const description = get(data, "extra_field.intro.value.#text", null)
	const link = get(data, "extra_field.link.url", null)
	const link_label = get(data, "extra_field.link.title", null)
	const user_registration_password = get(
		data,
		"components.0.singup_config.user_registration_password",
		"with-pass"
	)
	const { isAuthenticated } = useAccount()

	// Password is not required when Drupal register_pending_approval is on.
	if (user_registration_password === "default") {
		deleteNestedKey(elements, "pass")
	}

	useEffect(() => {
		// trigger data layer event when visiting a a register form
		dlPush("Affichage formulaire inscription")
	}, [])

	if (isAuthenticated) {
		return <h1>Already logged in</h1>
	}

	return (
		<div className="flex min-h-full flex-col justify-center rounded-xl bg-white px-5 py-10 md:px-6 md:py-12">
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

			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
					{elements && (
						<Form
							webformId={webform_id}
							schema={elements}
							buttons={buttons}
							styles={{
								submitButton: { className: "w-full mt-5" },
							}}
						/>
					)}
				</div>

				{link && (
					<div className="flex justify-center">
						<Link href={link} className="text-xs text-primary-500 hover:text-primary-700">
							{link_label}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export default AccountRegisterWidget
