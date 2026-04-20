import { Heading, Link, Text, Container } from "@/ui"
import { normalizeNodes } from "./normalizer"

import { drupal } from "@vactorynext/core/drupal"

export const config = {
	id: "vactory_help_center:cross-content",
}

const HelpCenterCrossContentWidget = ({ data }) => {
	const deserialized = drupal.deserialize(data?.components[0]?.collection?.data)

	const props = {
		title: data?.components?.[0]?.title,
		intro: data?.components?.[0]?.description,
		nodes: normalizeNodes(deserialized?.data || []),
	}

	if (props?.nodes?.length <= 0) return null
	return <CrossContent {...props} />
}

export const CrossContent = ({ title, intro, nodes }) => {
	return (
		<Container spacing="small_space" layout="full">
			{title && (
				<Heading level="2" className="mb-8 text-center">
					{title}
				</Heading>
			)}

			{intro && (
				<Text variant="intro" as="div">
					{intro}
				</Text>
			)}

			{nodes?.length > 0 && (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{nodes.map((node) => (
						<div key={node.id} className="overflow-hidden rounded-lg bg-white shadow-md">
							<Link href={node.url} className="block transition-opacity hover:opacity-75">
								<div className="p-6">
									<Heading level="3" className="mb-2 text-lg font-semibold">
										{node.title}
									</Heading>
									{node.section && (
										<div className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
											{node.section}
										</div>
									)}
									{node.description && (
										<Text className="mb-4 text-gray-600">{node.description}</Text>
									)}
								</div>
							</Link>
						</div>
					))}
				</div>
			)}
		</Container>
	)
}

export default HelpCenterCrossContentWidget
