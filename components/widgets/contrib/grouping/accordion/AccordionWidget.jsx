import { Wysiwyg } from "@/ui"

import { Accordions } from "./Accordions"

export const config = {
	id: "vactory_default:2",
	lazy: false,
}

const AccordionContainer = ({ data }) => {
	const props = {
		title: data?.extra_field?.bigtitle,
		intro: data?.extra_field?.intro,
		questions:
			data?.components?.map((question, index) => {
				return {
					id: index,
					button: question?.title,
					panel: question?.description?.value["#text"] ? (
						<Wysiwyg
							html={question?.description?.value["#text"]}
							className="prose max-w-none"
						/>
					) : null,
				}
			}) || [],
	}
	return <Accordions {...props} />
}

export default AccordionContainer
