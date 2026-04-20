import { Wysiwyg, Heading, Button } from "@/ui"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"

export const config = {
	id: "vactory_news:three-columns",
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
	const posts = normalizeNodes(response.data)
	const viewMoreLink = {
		title: data?.components?.[0]?.link?.title,
		url: data?.components?.[0]?.link?.url,
		className: data?.components?.[0]?.link?.attributes?.class,
		id: data?.components?.[0]?.link?.attributes?.id,
		rel: data?.components?.[0]?.link?.attributes?.rel,
		target: data?.components?.[0]?.link?.attributes?.target,
	}

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
				{posts.map((node) => (
					<NewsCard {...node} viewMoreLink={viewMoreLink?.url} key={node.id} />
				))}
			</div>
			{viewMoreLink?.url ? (
				<div className="mt-10 flex justify-center">
					<Button
						variant="gradient"
						href={viewMoreLink.url}
						className={viewMoreLink.className}
						id={viewMoreLink.id}
						rel={viewMoreLink.rel}
						target={viewMoreLink.target}
					>
						{viewMoreLink?.title}
					</Button>
				</div>
			) : null}
		</div>
	)
}

export default ThreeColumnsContainer
