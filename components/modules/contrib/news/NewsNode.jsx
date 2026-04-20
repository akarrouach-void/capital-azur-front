import { Container, Text, Badge, Wysiwyg, Image, Flag, Heading, Icon } from "@/ui"
import { NextPrev } from "../next-prev/nextPrev"
import { normalizeNode } from "./normalizer"
import { Comments } from "@/comments"
import { useEffect } from "react"
import { dlPush } from "@vactorynext/core/lib"
import { useRouter } from "next/router"
import { useI18n } from "@vactorynext/core/hooks"
import ImageNotFound from "public/assets/img/image-not-found.png"
import Script from "next/script"

const NewsNode = ({ node }) => {
	const router = useRouter()
	const normalizedNode = normalizeNode(node)
	const {
		title,
		id,
		image,
		image_alt,
		category,
		date,
		excerpt,
		body,
		isFlagged,
		hasFlag,
	} = normalizedNode

	const nextPrevInfo = {
		nid: node.drupal_internal__nid,
		resource: "vactory_news",
		queryParams: {
			fields: {
				"node--vactory_news": "title,path,field_vactory_media,field_vactory_news_theme",
				"media--image": "thumbnail",
				"file--image": "uri",
				"taxonomy_term--vactory_news_theme": "name",
			},
			include:
				"field_vactory_media,field_vactory_media.thumbnail,field_vactory_news_theme",
		},
	}
	const { t } = useI18n()

	const currentDomain = typeof window !== "undefined" ? window.location.origin : ""
	const path = node.path.alias

	const newsNodeSchema = {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		headline: title,
		datePublished: date,
		publisher: {
			"@type": "Organization",
			name: "Vactory",
			logo: {
				"@type": "ImageObject",
				url: `${currentDomain}/logo.png`,
			},
		},
		description: excerpt, // Optional
		image: image?.src // Optional
			? {
					"@type": "ImageObject",
					url: image.src,
					width: image.width,
					height: image.height,
					...(image_alt && { caption: image_alt }),
				}
			: undefined,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${currentDomain}${path}`,
		},
		articleSection: category, // Optional
	}

	useEffect(() => {
		// trigger data layer event when visiting a new post
		dlPush("Consultation News", {
			"Titre News": excerpt,
			"Catégorie News": category,
			"Date News": date,
			"URL News": `/${router.locale}/${router.asPath}`,
			"Commentaires News": node?.internal_comment?.contributions,
		})
	}, [])

	return (
		<>
			<div className="min-h-screen">
				<Container className="py-8 lg:py-16">
					<article className="mx-auto max-w-4xl">
						{/* Header Section */}
						<div className="mb-6 lg:mb-12">
							<Heading level={2} variant={3} className="mb-8 text-center text-gray-900">
								{title}
							</Heading>

							{/* Hero Image */}

							<div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">
								<div className="aspect-[16/9] bg-gray-100">
									<Image
										src={image?.src || ImageNotFound?.src}
										alt={image_alt || "Image not found"}
										width={image?.width || ImageNotFound?.width}
										height={image?.height || ImageNotFound?.height}
										className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
							</div>

							{/* Article Meta */}
							<div className="mb-8 flex flex-wrap items-center justify-center gap-4">
								<Badge
									text={category}
									className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
								/>

								{date && (
									<div className="flex items-center gap-2 text-gray-600">
										<Icon id="calendar" className="h-4 w-4" />
										<Text variant="small" className="font-medium text-gray-600">
											{date}
										</Text>
									</div>
								)}

								{hasFlag && (
									<div className="flex items-center gap-2 text-gray-600">
										<Flag
											id={id}
											module="favorite_news"
											className="cursor-pointer transition-colors hover:text-red-500"
											isFlagged={isFlagged}
										/>
										<span className="text-sm font-medium">
											{t("Nx:Ajouter a ma liste")}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Content Section */}
						<div className="rounded-2xl bg-white p-5 shadow-xl lg:p-10 lg:text-base">
							{excerpt && (
								<div className="mb-8">
									<Wysiwyg html={excerpt} className="prose" />
								</div>
							)}

							{body && <Wysiwyg html={body} className="prose" />}
						</div>

						{/* Navigation */}
						<NextPrev {...nextPrevInfo} />

						{/* Comments Section */}
						<Comments
							entity_id={node.id}
							content_type="vactory_news"
							field_name="comment"
							settings={node?.internal_comment}
							btn_label="poster un commentaire"
						/>
					</article>
				</Container>
			</div>
			{/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
			<Script id="news-schema" type="application/ld+json" strategy="beforeInteractive">
				{JSON.stringify(newsNodeSchema)}
			</Script>
		</>
	)
}

export const config = {
	id: "node--vactory_news",
	params: {
		fields: {
			"node--vactory_news":
				"body,created,field_vactory_excerpt,field_vactory_media,field_vactory_news_theme,field_vactory_date,vcc_normalized,internal_comment,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--vactory_news_theme": "name",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_vactory_news_theme,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default NewsNode
