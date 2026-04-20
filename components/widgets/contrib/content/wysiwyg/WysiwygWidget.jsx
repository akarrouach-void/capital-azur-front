import { Wysiwyg } from "@/ui"

export const config = {
	id: "vactory_default:17",
	lazy: false,
}

const freeContent = (data) => {
	return (
		<>
			{data.data.components[0].content && (
				<Wysiwyg className="mb-4" html={data.data.components[0].content.value["#text"]} />
			)}
		</>
	)
}

export default freeContent
