import React from "react"
import { Button, Wysiwyg, Heading } from "@/ui"
import { BlogCard } from "./BlogCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"

export const config = {
	id: "vactory_blog:three-columns",
}

const ThreeColumnsContainer = ({ data }) => {
	const response = deserialise(data?.components?.[0]?.collection?.data)
	const title = data?.components?.[0]?.title
	const description = data?.components?.[0]?.description?.value?.["#text"] ? (
		<Wysiwyg
			html={data?.components?.[0]?.description?.value?.["#text"]}
			className="prose"
		/>
	) : null
	const link = data?.components?.[0]?.link?.url
	const link_label = data?.components?.[0]?.link?.title
	const posts = normalizeNodes(response.data)

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
				{posts.map((post) => (
					<React.Fragment key={post.id}>
						<BlogCard {...post} />
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
