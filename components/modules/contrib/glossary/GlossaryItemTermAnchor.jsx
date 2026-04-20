import { Heading, Wysiwyg } from "@/ui"

export const GlossaryItemTermAnchor = ({ title, body, section }) => {
	return (
		<div id={section}>
			<Heading level="4" variant="6" className="mb-2">
				{title}
			</Heading>
			<Wysiwyg html={body} className="prose max-w-none pl-4" />
		</div>
	)
}
