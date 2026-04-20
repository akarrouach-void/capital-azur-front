import React, { useEffect } from "react"
import { Container, Heading, Wysiwyg, Badge, Text, Image, Flag, Icon } from "@/ui"
import { normalizeNode } from "./normalizer"
import { dlPush } from "@vactorynext/core/lib"
import { useI18n } from "@vactorynext/core/hooks"
import ImageNotFound from "public/assets/img/image-not-found.png"
import Script from "next/script"

const EventNode = ({ node }) => {
	const {
		image,
		title,
		dateStart,
		dateEnd,
		body,
		category,
		city,
		tags,
		isFlagged,
		hasFlag,
		id,
	} = normalizeNode(node)
	const { t } = useI18n()

	const currentDomain = typeof window !== "undefined" ? window.location.origin : ""
	const path = node.path.alias

	const eventNodeSchema = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: title,
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
		startDate: dateStart,
		endDate: dateEnd,
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		location: city
			? {
					"@type": "Place",
					name: city,
				}
			: undefined,
		organizer: {
			"@type": "Organization",
			name: "Vactory",
			url: currentDomain,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${currentDomain}${path}`,
		},
	}

	// trigger data layer event when visiting a event node
	useEffect(() => {
		dlPush("Événement à venir", {
			Titre: title,
			Catégorie: category,
			Ville: city,
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

							{/* Event Meta */}
							<div className="mb-6 flex flex-wrap items-center justify-center gap-4">
								{category && (
									<Badge
										text={category}
										className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
									/>
								)}

								{city && (
									<div className="flex items-center gap-2 text-gray-600">
										<Icon id="locator" className="h-4 w-4" />
										<Text variant="small" className="font-medium text-gray-600">
											{city}
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
							{dateStart && dateEnd && (
								<div className="mb-8 flex items-center justify-center gap-2 text-gray-600">
									<Icon id="calendar" className="h-4 w-4" />
									<Text variant="small" className="font-medium text-gray-600">
										{t("Nx:Du")} {dateStart} {t("Nx:Au")} {dateEnd}
									</Text>
								</div>
							)}

							{/* Tags Section */}
							{!!tags.length && (
								<div className="mb-8 flex flex-wrap items-center justify-center gap-2">
									{tags.map((tag, index) => (
										<Badge
											key={index}
											text={tag}
											className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
										/>
									))}
								</div>
							)}

							{/* Hero Image */}

							<div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">
								<div className="aspect-[16/9] bg-gray-100">
									<Image
										src={image?.uri?.value?._default || ImageNotFound?.src}
										alt={image?.meta?.alt || "Image not found"}
										title={title || "Image not found"}
										width={image?.meta?.width || ImageNotFound?.width}
										height={image?.meta?.height || ImageNotFound?.height}
										className="h-full w-full object-cover"
										imageContainerClassName="h-full w-full"
									/>
								</div>
							</div>
						</div>

						{/* Content Section */}
						<div className="rounded-2xl bg-white p-6 shadow-xl lg:p-10">
							{body && <Wysiwyg html={body} className="prose" />}
						</div>
					</article>
				</Container>
			</div>
			{/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
			<Script id="event-schema" type="application/ld+json" strategy="beforeInteractive">
				{JSON.stringify(eventNodeSchema)}
			</Script>
		</>
	)
}

export const config = {
	id: "node--vactory_event",
	params: {
		fields: {
			"node--vactory_event":
				"drupal_internal__nid,body,field_vactory_media,field_vactory_taxonomy_1,field_vactory_taxonomy_2,field_vactory_date_interval,field_vactory_tags,vcc_normalized,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--vactory_event_category": "name",
			"taxonomy_term--vactory_event_citys": "name",
			"taxonomy_term--tags": "name",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_vactory_taxonomy_1,field_vactory_taxonomy_2,field_vactory_tags,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default EventNode
