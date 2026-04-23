import { Container, Heading, Image, Wysiwyg } from "@/ui"
import { deserialise } from "kitsu-core"
import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const config = {
	id: "capital_azur_decoupled:insights",
}

const formatDate = (value) => {
	if (!value) return ""
	const d = new Date(value)
	if (isNaN(d.getTime())) return value
	const dd = String(d.getDate()).padStart(2, "0")
	const mm = String(d.getMonth() + 1).padStart(2, "0")
	const yy = String(d.getFullYear()).slice(-2)
	return `${dd}/${mm}/${yy}`
}

const normalizeNews = (nodes) =>
	(nodes || []).map((post) => ({
		id: post.drupal_internal__nid,
		title: get(post, "title", ""),
		url: get(post, "path.alias", "#"),
		excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 100),
		category: get(post, "field_vactory_news_theme.[0].name", ""),
		date: formatDate(get(post, "field_vactory_date", null)),
		image: {
			src: post?.field_vactory_media?.thumbnail?.uri?.value?._default,
			width: post?.field_vactory_media?.thumbnail?.meta?.width,
			height: post?.field_vactory_media?.thumbnail?.meta?.height,
			alt: post?.field_vactory_media?.thumbnail?.meta?.alt || post?.title,
		},
	}))

const InsightsWidget = ({ data }) => {
	const block = data?.components?.[0] || {}
	const response = deserialise(block?.collection?.data)
	const items = normalizeNews(response?.data)

	const sectionTitle = block?.title || ""
	const sectionDescriptionHtml = block?.description?.value?.["#text"] || ""
	const globalLinkUrl = block?.link?.url || null
	const globalLinkTitle = block?.link?.title || null

	return (
		<div className="px-6 py-20">
			<Container className="mx-auto max-w-6xl">
				<div className="mb-16 flex flex-col items-center gap-5 text-center">
					<div className="flex items-center gap-4">
						<span className="block h-[3px] w-12 shrink-0 bg-mainHover" />
						{sectionTitle && (
							<Heading
								level={2}
								className="text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[38px]"
							>
								{sectionTitle}
							</Heading>
						)}
					</div>
					{sectionDescriptionHtml && (
						<Wysiwyg
							html={sectionDescriptionHtml}
							className="mt-4 max-w-3xl text-[17px] leading-relaxed text-gray-600 md:text-[19px]"
						/>
					)}
				</div>

				<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
						>
							{item.image.src && (
								<a href={item.url} className="block shrink-0">
									<Image
										src={item.image.src}
										width={item.image.width}
										height={item.image.height}
										alt={item.image.alt}
										className="h-56 w-full object-cover object-center"
									/>
								</a>
							)}

							<div className="flex flex-1 flex-col p-8">
								<div className="mb-4 flex items-center gap-4">
									{item.category && (
										<span className="inline-block rounded-full bg-button px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
											{item.category}
										</span>
									)}
									{item.date && (
										<span className="text-sm font-medium text-gray-400">{item.date}</span>
									)}
								</div>

								{item.title && (
									<h3 className="mb-8 text-[22px] font-bold leading-snug">
										<a href={item.url} className="transition-colors hover:text-mainHover">
											{item.title}
										</a>
									</h3>
								)}

								<div className="mt-auto">
									<a
										href={item.url}
										className="group relative inline-block pb-1 text-sm font-extrabold uppercase tracking-widest text-mainHover transition hover:text-blue-800"
									>
										LIRE PLUS
										<span className="absolute bottom-0 left-0 h-[2px] w-full origin-left transform bg-mainHover transition-transform group-hover:scale-x-110" />
									</a>
								</div>
							</div>
						</div>
					))}
				</div>

				{globalLinkUrl && globalLinkTitle && (
					<div className="flex justify-center">
						<a
							href={globalLinkUrl}
							className="inline-block rounded-lg border-2 border-mainHover bg-transparent px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-mainHover transition-colors duration-300 hover:bg-mainHover hover:text-white"
						>
							{globalLinkTitle}
						</a>
					</div>
				)}
			</Container>
		</div>
	)
}

export default InsightsWidget
