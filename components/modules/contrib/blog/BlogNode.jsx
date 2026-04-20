import React, { useEffect } from "react"
//import { Vcc } from "./Vcc"
import { Badge, Container, Heading, Wysiwyg, Image, Flag, Icon, Text } from "@/ui"
import { normalizeNode } from "./normalizer"
import { Comments } from "@/comments"
import { dlPush } from "@vactorynext/core/lib"
import { useI18n } from "@vactorynext/core/hooks"
import ImageNotFound from "public/assets/img/image-not-found.png"
import Script from "next/script"

const BlogNode = ({ node }) => {
	const { image, title, body, category, date, isFlagged, hasFlag, id } =
		normalizeNode(node)
	const { t } = useI18n()

	const currentDomain = typeof window !== "undefined" ? window.location.origin : ""
	const path = node.path.alias

	const blogNodeSchema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		description: body,
		image: image?.uri?.value?._default
			? {
					"@type": "ImageObject",
					url: image.uri.value._default,
					width: image?.meta?.width,
					height: image?.meta?.height,
					...(image?.meta?.alt && { caption: image.meta.alt }),
				}
			: undefined,
		datePublished: date,
		publisher: {
			"@type": "Organization",
			name: "Vactory",
			logo: {
				"@type": "ImageObject",
				url: `${currentDomain}/logo.png`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${currentDomain}${path}`,
		},
		articleSection: category,
	}

	// trigger data layer event when visiting a blog post
	useEffect(() => {
		dlPush("Consultation article", {
			"Titre article": title,
			"Catégorie article": category,
			"Date article": date,
			"URL article": window.location.href,
			"Commentaires article": node?.internal_comment?.contributions,
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

							{/* Article Meta */}
							<div className="mb-8 flex flex-wrap items-center justify-center gap-4">
								{category && (
									<Badge
										text={category}
										className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
									/>
								)}

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
											module="default_flag"
											className="cursor-pointer transition-colors hover:text-red-500"
											isFlagged={isFlagged}
										/>
										<span className="text-sm font-medium">
											{t("Nx:Ajouter a ma liste")}
										</span>
									</div>
								)}
							</div>

							{/* Hero Image */}

							<div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">
								<div className="aspect-[16/9] bg-gray-100">
									<Image
										src={image?.uri?.value?._default || ImageNotFound?.src}
										alt={image?.meta?.alt || "Image not found"}
										title={title || "Image not found"}
										className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
										fill
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
							</div>
						</div>

						{/* Content Section */}
						<div className="rounded-2xl bg-white p-6 shadow-xl lg:p-10">
							{body && <Wysiwyg html={body} className="prose" />}
						</div>

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
			<Script id="blog-schema" type="application/ld+json" strategy="beforeInteractive">
				{JSON.stringify(blogNodeSchema)}
			</Script>
		</>
	)
}

export const config = {
	id: "node--vactory_blog",
	params: {
		fields: {
			"node--vactory_blog":
				"body,created,field_vactory_excerpt,field_vactory_media,field_blog_category,field_blog_tags,internal_comment,vcc_normalized,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--field_blog_category": "name",
			"taxonomy_term--field_blog_tags": "name",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_blog_category,field_blog_tags,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default BlogNode
