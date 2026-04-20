import { Wysiwyg } from "@/ui"

export const Content = ({ content }) => {
	return <Wysiwyg html={content.value["#text"]} />
}
