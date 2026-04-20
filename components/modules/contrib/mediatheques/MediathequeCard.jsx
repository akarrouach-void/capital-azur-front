import { useRef } from "react"

import { Link, Icon, LocalMediaModal, Text, Heading, Badge, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import ImageNotFound from "public/assets/img/image-not-found.png"

const Thumbnail = ({ onClick, image, video, title }) => {
	return (
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				e.key === "Enter" && onClick()
			}}
			role="button"
			tabIndex={0}
			className="group cursor-pointer"
		>
			<Image
				src={image?.uri?.value?._default || ImageNotFound?.src}
				alt={image?.meta?.alt}
				title={title}
				fill
				type="card"
				className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
			/>
			{video && (
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="animate rounded-full bg-white/20 p-4 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/30">
						<Icon id="play" className="h-8 w-8 text-white" />
					</div>
				</div>
			)}
		</div>
	)
}

const CardImage = ({ video, image }) => {
	const videoModalRef = useRef()
	const imageModalRef = useRef()
	let video_id
	if (video) {
		video_id = video.split("v=")[1]
		let videoParamToRemove = video_id?.indexOf("&")
		if (videoParamToRemove != -1) {
			video_id = video_id?.substring(0, videoParamToRemove)
		}
	}

	if (!image) {
		return <></>
	}
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			{video ? (
				<>
					<Thumbnail
						image={image}
						video={video}
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
				<>
					<Thumbnail
						image={image}
						onClick={() => {
							imageModalRef.current.open()
						}}
					/>
					<LocalMediaModal
						ref={imageModalRef}
						sourceId={image}
						type="image"
						closeIcon={<Icon className="h-5 w-5" id="x" />}
						expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
						minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
					/>
				</>
			)}
		</div>
	)
}

export const MediathequeCard = ({
	image,
	video,
	theme,
	date,
	className,
	url,
	title,
	excerpt,
	type,
	...props
}) => {
	const { t } = useI18n()
	return (
		<article
			className={vclsx(
				"flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl",
				className
			)}
			data-type={type}
			{...props}
		>
			<div className="relative w-full flex-shrink-0">
				<CardImage image={image} title={title} video={video} />
				<div className="absolute -bottom-[15px] right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/25">
					<Icon
						id={type === "Photo" ? "picture" : "video-camera"}
						className="h-5 w-5 text-white"
					/>
				</div>
				{theme && (
					<div className="absolute left-4 top-4 flex flex-row items-center">
						<Badge text={theme} size="normal" />
					</div>
				)}
			</div>
			<div className="group relative">
				<Link
					href={url}
					aria-label={`${t("Nx:En savoir plus")}: ${title}`}
					className="flex h-full flex-col items-start p-8"
				>
					{date && (
						<Text
							variant="small"
							className={vclsx("mediatheque-card-date", "mb-3 text-gray-500")}
						>
							{date}
						</Text>
					)}

					<>
						{title && (
							<Heading level="3" variant="cardTitle" className="mb-[18px]">
								{title}
							</Heading>
						)}
						{excerpt && (
							<Text variant="cardExcerpt" className="mb-[25px]">
								{excerpt}
							</Text>
						)}
					</>

					<Text className="mt-auto w-fit" variant="permalink">
						{t("Nx:En savoir plus")}
						<Icon id="arrow-right" className="rtl-icon" width="20" height="20" />
					</Text>
				</Link>
			</div>
		</article>
	)
}
