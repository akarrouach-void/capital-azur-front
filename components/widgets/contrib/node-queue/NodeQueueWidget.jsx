import React from "react"
import { deserialise } from "kitsu-core"
import get from "lodash.get"
import { Button, Link, Wysiwyg, Heading, Text } from "@/ui"
import { normalizeNodes } from "./normalizer"
import { Card } from "./Card"

const NodeQueue = ({ data }) => {
	const title = get(data, "extra_field.title", "")
	const raw_description = get(data, "extra_field.description.value.#text", null)
	const description = <Wysiwyg html={raw_description} />
	const link = get(data, "extra_field.link.url", null)
	const link_label = get(data, "extra_field.link.title", "")
	let nodes = []
	data?.components.map((item) => {
		const items = deserialise(get(item, "nodes.data", {}))
		nodes = [...nodes, ...items?.data]
	})

	nodes = normalizeNodes(nodes)
	return (
		<div className="relative">
			<div className="relative mx-auto max-w-7xl">
				<div className="text-center">
					{title && (
						<Heading variant="3" level="2" className="mb-5 text-center">
							{title}
						</Heading>
					)}
					{raw_description.length > 0 && (
						<Text as="div" className="mx-auto max-w-2xl text-xl text-gray-500">
							{description}
						</Text>
					)}
				</div>
				{nodes.length > 0 && (
					<div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
						{nodes.map((post) => (
							<React.Fragment key={post.id}>
								<Card {...post} />
							</React.Fragment>
						))}
					</div>
				)}
				{link && (
					<div className="mt-12 flex justify-center">
						<Link href={link}>
							<Button>{link_label}</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export const config = {
	id: "vactory_dynamic_field_decoupled:node-queue",
}

export default NodeQueue
