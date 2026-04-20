import { Heading, Wysiwyg } from "@/ui"

export const GlossaryItem = ({ title, body }) => {
	return (
		<div>
			<Heading level="2" variant="2" className="mb-2">
				{title}
			</Heading>
			<Wysiwyg html={body} className="prose max-w-none pl-4" />
		</div>
	)
}
