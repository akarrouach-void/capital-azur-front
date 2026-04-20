import React from "react"
import {
	Container,
	Heading,
	LocalMediaModal,
	Wysiwyg,
	Flag,
	Badge,
	Icon,
	Button,
	Image,
	FiveStar,
	Text,
} from "@/ui"
import { normalizeSingleNode } from "./normalizer"
import { useRef } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import ImageNotFound from "public/assets/img/image-not-found.png"

const Thumbnail = ({ onClick, image, title }) => {
	return (
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				e.key === "Enter" && onClick()
			}}
			role="button"
			tabIndex={0}
			className="group relative h-full cursor-pointer overflow-hidden rounded-2xl"
		>
			<Image
				src={image?.uri?.value?._default || ImageNotFound?.src}
				alt={image?.meta?.alt || "Image not found"}
				title={title}
				fill
				className="h-full w-full object-cover"
				imageContainerClassName="w-full h-full"
			/>

			<div className="absolute inset-0 bg-black/40 transition-all duration-300 group-hover:bg-black/60" />
			<div className="absolute inset-0 z-20 flex items-center justify-center">
				<div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
					<Icon id="play" className="h-16 w-16 text-white" />
				</div>
			</div>
		</div>
	)
}

const AcademyImage = ({ image, alt = "", ...rest }) => {
	return (
		<div className="relative h-full overflow-hidden rounded-2xl">
			<Image
				src={image?._default || ImageNotFound?.src}
				alt={alt || "Image not found"}
				width={image?.meta?.width || ImageNotFound?.width}
				height={image?.meta?.height || ImageNotFound?.height}
				className="h-full w-full object-cover"
				imageContainerClassName="h-full w-full"
				{...rest}
			/>
		</div>
	)
}

const AcademyNode = ({ node }) => {
	const {
		title,
		image,
		duree,
		excerpt,
		instructor,
		video,
		theme,
		tags,
		langue,
		date,
		document,
		id,
		isFlagged,
		hasFlag,
		vote,
	} = normalizeSingleNode(node, false)
	const videoModalRef = useRef()
	const { t } = useI18n()
	let video_id
	if (video) {
		if (video.includes("youtu.be/")) {
			video_id = video.split("youtu.be/")[1]
		} else {
			video_id = video.split("v=")[1]
		}
		let videoParamToRemove = video_id?.indexOf("&")
		if (videoParamToRemove != -1) {
			video_id = video_id.substring(0, videoParamToRemove)
		}
	}

	return (
		<div className="min-h-screen">
			<Container className="py-8 lg:py-16">
				<article className="mx-auto max-w-4xl">
					{/* Header Section */}
					<div className="mb-6 lg:mb-12">
						{title && (
							<Heading level={2} variant={3} className="mb-8 text-center text-gray-900">
								{title}
							</Heading>
						)}

						{/* Academy Meta */}
						<div className="mb-8 flex flex-wrap items-center justify-center gap-4">
							{theme && (
								<Badge
									text={theme}
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
						</div>

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
					</div>

					{/* Media & Details Section */}
					<div className="mb-8 rounded-2xl bg-white p-6 shadow-xl lg:p-10">
						<div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center lg:gap-12">
							{/* Media Section */}
							<div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
								{video ? (
									<>
										<Thumbnail
											image={image}
											title={title}
											onClick={() => {
												videoModalRef.current.open()
											}}
										/>
										<LocalMediaModal
											ref={videoModalRef}
											sourceId={video_id}
											closeIcon={<Icon className="h-5 w-5" id="x" />}
											expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
											minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
										/>
									</>
								) : (
									<AcademyImage
										image={image?.uri?.value}
										width={image?.meta?.width}
										height={image?.meta?.height}
										alt={title}
									/>
								)}
							</div>

							{/* Course Details */}
							<div className="space-y-6">
								{langue && (
									<div className="flex items-start gap-3">
										<Icon id="grid" className="mt-1 h-5 w-5 text-blue-600" />
										<div>
											<Text className="mb-1 font-semibold text-gray-900">
												{t("Nx:Langue:")}
											</Text>
											<Wysiwyg html={langue} className="prose prose-sm" />
										</div>
									</div>
								)}

								{duree && (
									<div className="flex items-start gap-3">
										<Icon id="clock" className="mt-1 h-5 w-5 text-blue-600" />
										<div>
											<Text className="mb-1 font-semibold text-gray-900">
												{t("Nx:Durée:")}
											</Text>
											<Wysiwyg html={duree} className="prose prose-sm" />
										</div>
									</div>
								)}

								{instructor && (
									<div className="flex items-start gap-3">
										<Icon id="user" className="mt-1 h-5 w-5 text-blue-600" />
										<div>
											<Text className="mb-1 font-semibold text-gray-900">
												{t("Nx:Animé par:")}
											</Text>
											<Wysiwyg html={instructor} className="prose prose-sm" />
										</div>
									</div>
								)}

								{/* Rating Section */}
								<div className="flex items-start gap-3">
									<Icon id="favorite-star" className="h-5 w-5 text-yellow-500" />
									<div>
										<Text className="mb-2 font-semibold text-gray-900">
											{t("Nx:Évaluation")}
										</Text>
										<FiveStar
											id={id}
											entity="node"
											icon="favorite-star"
											allowvote={true}
											rate={vote}
										/>
									</div>
								</div>

								{/* Favorite Flag */}
								{hasFlag && (
									<div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
										<Flag
											id={id}
											module="favorite_academy"
											className="cursor-pointer transition-colors hover:text-red-500"
											isFlagged={isFlagged}
										/>
										<Text className="text-sm font-medium text-gray-700">
											{t("Nx:Ajouter a ma liste")}
										</Text>
									</div>
								)}
							</div>
						</div>

						{/* Course Description */}
						{excerpt && (
							<div className="mt-8 border-t border-gray-200 pt-8">
								<div className="mb-6">
									<Heading level={3} variant={6} className="mb-2 text-gray-900">
										{t("Nx:Description du cours")}
									</Heading>
									<div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
								</div>
								<Wysiwyg html={excerpt} className="prose" />
							</div>
						)}
					</div>

					{/* Download Section */}
					{document && (
						<div className="rounded-2xl bg-gray-50 p-6 lg:p-8">
							<div className="mb-6">
								<Heading level={3} variant={6} className="mb-2 text-gray-900">
									{t("Nx:Ressources")}
								</Heading>
								<div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
							</div>

							<Button
								href={document}
								download
								target="_blank"
								variant="gradient"
								size="large"
								icon={<Icon id="download" className="h-5 w-5" />}
							>
								{t("Nx:Télécharger le document")}
							</Button>
						</div>
					)}
				</article>
			</Container>
		</div>
	)
}

export const config = {
	id: "node--vactory_academy",
	params: {
		fields: {
			"node--vactory_academy":
				"title,field_vactory_date,field_vactory_excerpt,field_academy_duree,field_vactory_instructor,field_vactory_media,field_vactory_academy_langue,field_vactory_media_document,field_vactory_theme,field_vactory_youtube_videos,field_vactory_file_multiple,field_vactory_tags,field_vactory_youtube_media,vote,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"taxonomy_term--vactory_academy_themes": "name",
			"taxonomy_term--tags": "name",
			"user--user":
				"drupal_internal__uid,display_name,created,field_about_the_author,field_date_of_birth,field_first_name,field_last_name,field_telephone",
			"media--image": "thumbnail",
			"file--image": "uri",
			"file--document": "uri",
			"media--file": "field_media_file",
			"taxonomy_term--vactory_news_theme": "name",
			"media--remote_video": "field_media_oembed_video",
		},
		include:
			"field_vactory_instructor,field_vactory_theme,field_vactory_media,field_vactory_media.thumbnail,field_vactory_media_document.field_media_file,field_vactory_file_multiple,field_vactory_tags,field_vactory_youtube_media,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default AcademyNode
