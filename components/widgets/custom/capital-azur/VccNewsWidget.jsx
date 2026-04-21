import { Container, Heading, Image, Link, Wysiwyg } from "@/ui"
import { deserialise } from "kitsu-core"
import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const config = {
	id: "capital_azur_decoupled:news-vcc",
}

const formatDate = (value) => {
	if (!value) return ""
	const d = new Date(value)
	if (isNaN(d.getTime())) return value
	const dd = String(d.getDate()).padStart(2, "0")
	const mm = String(d.getMonth() + 1).padStart(2, "0")
	const yyyy = d.getFullYear()
	return `${dd}/${mm}/${yyyy}`
}

const normalizeNews = (nodes) =>
	(nodes || []).map((post) => ({
		id: post.drupal_internal__nid,
		title: get(post, "title", ""),
		url: get(post, "path.alias", "#"),
		excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 120),
		category: get(post, "field_vactory_news_theme.[0].name", ""),
		date: formatDate(get(post, "field_vactory_date", null)),
		image: {
			src: post?.field_vactory_media?.thumbnail?.uri?.value?._default,
			width: post?.field_vactory_media?.thumbnail?.meta?.width,
			height: post?.field_vactory_media?.thumbnail?.meta?.height,
			alt: post?.field_vactory_media?.thumbnail?.meta?.alt || post?.title,
		},
	}))

const CrossContentNews = ({ data }) => {
	const block = data?.components?.[0] || {}
	const response = deserialise(block?.collection?.data)
	const items = normalizeNews(response?.data)

	if (!items.length) return null

	const title = block?.title || ""
	const introHtml = block?.intro?.value?.["#text"] || ""
	const linkUrl = block?.link?.url || null
	const linkTitle = block?.link?.title || null

	return (
		<div className="px-6 py-20">
			<Container className="mx-auto max-w-6xl">
				{(title || introHtml) && (
					<div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-center">
						<div>
							{title && (
								<div className="flex items-center gap-4">
									<span className="bg-mainHover block h-[3px] w-12 shrink-0" />
									<Heading
										level={2}
										className="text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[38px]"
									>
										{title}
									</Heading>
								</div>
							)}
							{introHtml && (
								<Wysiwyg
									html={introHtml}
									className="max-w-3xl leading-relaxed text-gray-600"
								/>
							)}
						</div>
						{linkUrl && linkTitle && (
							<Link href={linkUrl} variant="permalink">
								{linkTitle}
							</Link>
						)}
					</div>
				)}

				<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
						>
							{item.image.src && (
								<Link
									href={item.url}
									className="block aspect-[16/9] shrink-0 overflow-hidden"
								>
									<Image
										src={item.image.src}
										width={item.image.width}
										height={item.image.height}
										alt={item.image.alt}
										className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
									/>
								</Link>
							)}

							<div className="flex flex-1 flex-col p-8">
								<div className="mb-4 flex items-center gap-3">
									{item.category && (
										<span className="bg-button inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
											{item.category}
										</span>
									)}
									{item.date && (
										<span className="text-sm font-medium text-gray-400">{item.date}</span>
									)}
								</div>

								{item.title && (
									<h3 className="text-button mb-4 text-[20px] font-bold leading-snug">
										<Link
											href={item.url}
											className="hover:text-mainHover transition-colors"
										>
											{item.title}
										</Link>
									</h3>
								)}

								{item.excerpt && (
									<p className="mb-6 text-[15px] leading-relaxed text-gray-500">
										{item.excerpt}
									</p>
								)}

								<div className="mt-auto">
									<a
										href={item.url}
										className="text-mainHover group relative inline-block pb-1 text-sm font-extrabold uppercase tracking-widest transition hover:text-blue-800"
									>
										Lire plus
										<span className="bg-mainHover absolute bottom-0 left-0 h-[2px] w-full origin-left transform transition-transform group-hover:scale-x-110" />
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			</Container>
		</div>
	)
}

export default CrossContentNews
