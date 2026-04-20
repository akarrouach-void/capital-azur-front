import React from "react"
import get from "lodash.get"
import { Link, Wysiwyg, Heading, Text } from "@/ui"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_news:pre-filtered-block",
}

const PreFiletredContainer = ({ data }) => {
	const response = deserialise(get(data, "components.0.collection.data", {}))
	const title = get(data, "components.0.title", "")
	const raw_description = get(data, "components.0.description.value.#text", null)
	const description = <Wysiwyg html={raw_description} />
	const posts = normalizeNodes(response.data)
	const viewMoreLink = {
		title: get(data, "components.0.link.title", null),
		url: get(data, "components.0.link.url", null),
		className: get(data, "components.0.link.attributes.class", null),
		id: get(data, "components.0.link.attributes.id", null),
		rel: get(data, "components.0.link.attributes.rel", null),
		target: get(data, "components.0.link.attributes.target", null),
	}

	const { t } = useI18n()

	return (
		<div className="relative">
			<div className="relative mx-auto max-w-7xl">
				{!!title && (
					<Heading variant="3" level="2" className="mb-5 text-center">
						{title}
					</Heading>
				)}
				{raw_description.length > 0 && (
					<Text className="mx-auto max-w-2xl text-xl text-gray-500">{description}</Text>
				)}
				<div className="mx-auto mt-12 grid max-w-lg gap-5 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<React.Fragment key={post.id}>
							<NewsCard {...post} viewMoreLink={viewMoreLink?.url} />
						</React.Fragment>
					))}
				</div>
				{viewMoreLink.url && (
					<div className="mt-10 text-center">
						<Link
							href={viewMoreLink.url}
							className={viewMoreLink.className}
							variant={"btnPrimary"}
							id={viewMoreLink.id}
							rel={viewMoreLink.rel}
							target={viewMoreLink.target}
						>
							{viewMoreLink.title ? viewMoreLink.title : t("Nx:Voir plus")}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export default PreFiletredContainer
