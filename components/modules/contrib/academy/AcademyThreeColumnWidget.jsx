import React from "react"
import { Button, Wysiwyg, Heading } from "@/ui"
import { AcademyCard } from "./AcademyCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"

export const config = {
	id: "vactory_academy:three-columns",
}

const ThreeColumnsContainer = ({ data }) => {
	const nodes = normalizeNodes(deserialise(data?.components?.[0]?.collection?.data).data)
	const title = data?.components?.[0]?.title
	const description = data?.components?.[0]?.description?.value?.["#text"] ? (
		<Wysiwyg
			className="prose"
			html={data?.components?.[0]?.description?.value?.["#text"]}
		/>
	) : null
	const link = data?.components?.[0]?.link?.url
	const link_label = data?.components?.[0]?.link?.title

	return (
		<div className="relative">
			{(title || description) && (
				<div className="mb-10 text-center">
					{title && (
						<Heading variant="3" level="2" className="mb-5 text-center">
							{title}
						</Heading>
					)}
					{description && description}
				</div>
			)}
			<div className="mx-auto grid max-w-lg gap-5 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
				{nodes.map((node) => (
					<React.Fragment key={node.id}>
						<AcademyCard {...node} />
					</React.Fragment>
				))}
			</div>
			{link ? (
				<div className="mt-10 flex justify-center">
					<Button variant="gradient" href={link}>
						{link_label}
					</Button>
				</div>
			) : null}
		</div>
	)
}

export default ThreeColumnsContainer
