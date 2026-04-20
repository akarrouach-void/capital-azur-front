import { Heading, Button, Text } from "@/ui"

export const ServiceCard = ({
	title,
	link_title,
	link_url,
	link_attributes,
	description,
}) => {
	return (
		<div className="flex h-full flex-col rounded-lg bg-white p-5 shadow-lg hover:shadow-xl">
			<Heading level="5" variant="5" className="!mb-5 border-b pb-4">
				{title}
			</Heading>
			{description && <Text className="mb-5">{description}</Text>}
			{link_title && link_url && (
				<Button href={link_url} {...link_attributes} variant="gradient">
					{link_title}
				</Button>
			)}
		</div>
	)
}
