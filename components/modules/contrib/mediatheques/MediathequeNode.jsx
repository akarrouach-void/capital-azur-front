import {
	Container,
	Badge,
	Icon,
	LocalMediaModal,
	Wysiwyg,
	Heading,
	Image,
	Button,
} from "@/ui"
import { Vcc } from "./Vcc"
import { normalizeNode } from "./normalizer"
import { useRef } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import ImageNotFound from "public/assets/img/image-not-found.png"

const Thumbnail = ({ onClick, image }) => {
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
				title={image?.meta?.title || "Image not found"}
				width={image?.meta?.width || ImageNotFound?.width}
				height={image?.meta?.height || ImageNotFound?.height}
				className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

const MediathequeNode = ({ node }) => {
	const { title, image, video, category, tags, date, excerpt, body, document } =
		normalizeNode(node)
	const videoModalRef = useRef()
	const { t } = useI18n()

	let video_id
	if (video) {
		video_id = video.split("v=")[1]
		let videoParamToRemove = video_id?.indexOf("&")
		if (videoParamToRemove != -1) {
			video_id = video_id?.substring(0, videoParamToRemove)
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

						{/* Metadata Section */}
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
									<span className="text-sm font-medium">{date}</span>
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

					{/* Media & Content Section */}
					<div className="rounded-2xl bg-white p-6 shadow-xl lg:p-10">
						<div className="mb-8 grid gap-8 md:grid-cols-2 md:items-center lg:gap-12">
							{/* Media Section */}
							<div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
								{video ? (
									<>
										<Thumbnail
											image={image}
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
									<Image
										src={image?.uri?.value?._default || ImageNotFound?.src}
										alt={image?.meta?.alt || "Image not found"}
										title={image?.meta?.title || "Image not found"}
										width={image?.meta?.width || ImageNotFound?.width}
										height={image?.meta?.height || ImageNotFound?.height}
										className="animate object-cover hover:scale-105"
									/>
								)}
							</div>

							{/* Excerpt */}
							{excerpt && <Wysiwyg html={excerpt} className="prose" />}
						</div>

						{/* Body Content */}
						{body && <Wysiwyg html={body} className="prose" />}
					</div>

					{/* Download Section */}
					{(document || image) && (
						<div className="mt-8 rounded-2xl bg-gray-50 p-6 lg:p-8">
							<div className="mb-4">
								<h3 className="mb-2 text-xl font-bold text-gray-900">Téléchargements</h3>
								<div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
							</div>

							<div className="flex flex-wrap gap-4">
								{document && (
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
								)}
								{image && (
									<Button
										href={image.uri.value._default}
										download
										target="_blank"
										variant="gradient"
										size="large"
										icon={<Icon id="download" className="h-5 w-5" />}
									>
										{t("Nx:Télécharger l'image")}
									</Button>
								)}
							</div>
						</div>
					)}

					{/* VCC Section */}
					{node.vcc_normalized && (
						<div className="mt-8 rounded-2xl bg-white p-6 shadow-xl lg:p-8">
							<Vcc data={node?.vcc_normalized} />
						</div>
					)}
				</article>
			</Container>
		</div>
	)
}

export const config = {
	id: "node--vactory_mediatheque",
	params: {
		fields: {
			"node--vactory_mediatheque":
				"field_body,field_vactory_excerpt,field_vactory_media,field_vactory_tags,field_mediatheque_date,field_mediatheque_theme,field_mediatheque_video,field_vactory_media_document,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"file--document": "uri",
			"media--file": "name,field_media_file",
			"taxonomy_term--mediatheque_theme_albums": "name",
			"media--remote_video": "field_media_oembed_video",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_vactory_tags,field_mediatheque_theme,field_mediatheque_video,field_vactory_media_document,field_vactory_media_document.field_media_file,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default MediathequeNode
