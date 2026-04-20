import { Wysiwyg } from "@/ui"

export const Markup = ({ field }) => {
	const { markup } = field
	if (markup == undefined) return
	return <Wysiwyg html={markup} />
}
