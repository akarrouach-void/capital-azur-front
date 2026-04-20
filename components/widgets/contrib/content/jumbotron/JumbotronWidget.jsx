import { Text, Heading, Button } from "@/ui"

export const config = {
	id: "vactory_default:1",
	lazy: false,
}

export const Jumbotron = ({
	title,
	description,
	lead,
	link_url,
	link_attributes,
	link_title,
}) => {
	return (
		<div className="rounded-lg bg-gray-50 p-10 shadow-lg hover:shadow-xl">
			{title && (
				<Heading level="3" variant="3" className="mb-5">
					{title}
				</Heading>
			)}
			{lead && (
				<Text className="mb-5 divide-y divide-gray-300 text-gray-500">{lead}</Text>
			)}
			{description && <Text className="mb-8">{description}</Text>}
			{link_title && link_url && (
				<Button
					href={link_url}
					{...link_attributes}
					variant="gradient"
					className="mr-auto w-fit whitespace-nowrap"
				>
					{link_title}
				</Button>
			)}
		</div>
	)
}

const JumbotronContainer = (data) => {
	const props = {
		title: data.data.components[0].title,
		description: data.data.components[0].description,
		lead: data.data.components[0].lead,
		link_title: data.data.components[0].link.title,
		link_url: data.data.components[0].link.url,
		link_attributes: {
			id: data.data.components[0].link.attributes.id,
			target: data.data.components[0].link.attributes.target,
			rel: data.data.components[0].link.attributes.rel,
			className: data.data.components[0].link.attributes.class,
		},
	}
	return <Jumbotron {...props} />
}

export default JumbotronContainer
