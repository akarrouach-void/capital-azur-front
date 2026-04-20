import { useEffect, useState } from "react"
import get from "lodash.get"
import dynamic from "next/dynamic"
import ReactStars from "react-stars"
import { Wysiwyg, Heading, Link, Icon } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import Cookies from "js-cookie"

const Form = dynamic(() => import("@/form").then((mod) => mod.Form), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export const config = {
	id: "vactory_ux_notes:ux_note_form",
}

const UxNoteFormWidget = (data) => {
	const { t } = useI18n()
	const displayTimeout = get(data, "data.components.0.group_rating_experience.timeout", 0)
	const step_1_title = get(data, "data.components.0.group_rating_experience.title", "")
	const step_1_description = get(
		data,
		"data.components.0.group_rating_experience.description.value.#text",
		""
	)
	const webform_id = get(data, "data.components.0.group_ux_note_form.webform.id", null)
	const schema = get(data, "data.components.0.group_ux_note_form.webform.elements", null)
	const last_step_title = get(data, "data.components.0.group_confirm_form.title", "")
	const last_step_description = get(
		data,
		"data.components.0.group_confirm_form.description.value.#text",
		""
	)
	const last_step_url = get(data, "data.components.0.group_confirm_form.link", "")
	const [showWidget, setShowWidget] = useState(false)
	const [rate, setRate] = useState(true)
	const [next, setNext] = useState(0)
	const [step1, setStep1] = useState(true)
	const [elements, setElements] = useState(schema)
	const [note, setNote] = useState(0)

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (Cookies.get("UserHasRated") === undefined) {
				setShowWidget(true)
			}
		}, displayTimeout * 1000)

		return () => clearTimeout(timeout)
	}, [])
	const ratingChanged = (note) => {
		setNote(note)
		setElements((prevElements) => ({
			...prevElements,
			note: { ...prevElements.note, default_value: note },
		}))
		setRate(false)
		setNext(2)
	}

	const handleFormSubmit = () => {
		setStep1(false)
		setNext(3)
		Cookies.set("UserHasRated", true, { expires: 365 })
	}

	const handleCloseWidget = () => {
		setShowWidget(false)
	}

	return (
		<>
			{showWidget && (
				<div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-40 pb-6 md:pr-6 max-md:px-2">
					<div className="relative z-50 max-w-md rounded-b border-t-4 border-primary-500 bg-white p-8  shadow-lg">
						<div className="absolute right-0 top-0 cursor-pointer pr-4 pt-3">
							<Icon
								id="x"
								width="16px"
								height="16px"
								className="animate text-gray hover:rotate-180 hover:text-primary-500"
								onClick={handleCloseWidget}
							/>
						</div>
						{step1 && (
							<div>
								{step_1_title && (
									<Heading variant="3" level="2">
										{step_1_title}
									</Heading>
								)}
								{step_1_description && (
									<Wysiwyg html={step_1_description} className="prose mb-5 max-w-none" />
								)}
								{rate && (
									<ReactStars
										count={5}
										onChange={ratingChanged}
										size={24}
										activeColor="#ffd700"
									/>
								)}
							</div>
						)}
						{next === 2 && (
							<div>
								<ReactStars
									count={5}
									size={24}
									activeColor="#ffd700"
									value={note}
									edit={false}
								/>
								{elements && (
									<Form
										webformId={webform_id}
										schema={elements}
										confirmeSubmit={() => {
											handleFormSubmit()
										}}
									/>
								)}
							</div>
						)}
						{next === 3 && (
							<div>
								<Heading variant="3" level="2">
									{last_step_title}
								</Heading>
								{last_step_description && (
									<Wysiwyg html={last_step_description} className="prose max-w-none" />
								)}
								{last_step_url.url && (
									<div className="mt-auto">
										<Link
											href={last_step_url.url || "#."}
											variant="permalink"
											aria-label={`En savoir plus: ${last_step_url?.title}`}
										>
											{last_step_url?.title
												? last_step_url?.title
												: t("Nx:En savoir plus")}
										</Link>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default UxNoteFormWidget
