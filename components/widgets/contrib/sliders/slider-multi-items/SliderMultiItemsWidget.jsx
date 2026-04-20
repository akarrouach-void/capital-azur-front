import { useRef, useState } from "react"
import { Slider, SliderSlides, LocalMediaModal, Icon, Image, Heading } from "@/ui"

export const config = {
	id: "vactory_default:38",
}

const Slide = ({ slide, onVideoClick }) => {
	return (
		<>
			<div
				onClick={() => {
					onVideoClick(slide.video)
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") onVideoClick(slide.video)
				}}
				role="button"
				tabIndex={0}
				className="group relative h-[250px] w-full overflow-hidden rounded-xl"
			>
				{/* Background Image */}
				<Image
					{...slide.image}
					alt={slide?.image?.alt}
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				{/* Overlay gradients */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

				{/* Video title */}
				<div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-6 py-6">
					<Heading className="text-white" level={3} variant={6}>
						{slide.videoTitle}
					</Heading>
				</div>

				{/* Play button */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="relative">
						{/* Glow effect */}
						<div className="absolute -inset-4 rounded-full bg-white/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />

						{/* Play button */}
						<div className="relative rounded-full border border-white/30 bg-white/20 p-4 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
							<Icon className="h-8 w-8 text-white" id="play" />
						</div>

						{/* Pulse ring */}
						<div className="absolute inset-0 animate-pulse rounded-full border-2 border-white/40" />
					</div>
				</div>

				{/* Hover overlay */}
				<div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</div>
		</>
	)
}
const SliderMultiItems = ({ data }) => {
	const [currentVideoId, setCurrentVideoId] = useState(null)
	const videoModalRef = useRef()

	const handleVideoClick = (videoId) => {
		setCurrentVideoId(videoId)
		videoModalRef.current.open()
	}

	const slidesData = data.components.map((item) => {
		return {
			image: {
				src: item?.image[0]._default,
				width: item?.image[0].meta.width,
				height: item?.image[0].meta.height,
				alt: item?.image[0].meta.alt,
				title: item?.image[0].meta.title,
			},
			video: item?.video,
			title: item?.titleVideo,
			videoTitle: item?.titleVideo,
		}
	})

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		loop: true,
		initial: 0,
		mode: "snap",
		breakpoints: {
			"(min-width: 768px)": {
				slides: { origin: "center", perView: 3, spacing: 15 },
			},
			"(max-width: 768px)": {
				slides: { perView: 2, spacing: 10 },
			},
			"(max-width: 500px)": {
				slides: { perView: 1, spacing: 10 },
			},
		},
	}

	return (
		<>
			<Slider sliderSettings={sliderSettings}>
				{slidesData.map((slide, index) => {
					return (
						<SliderSlides key={index}>
							<Slide
								key={`slide-cover-${index}`}
								slide={slide}
								onVideoClick={handleVideoClick}
							/>
						</SliderSlides>
					)
				})}
			</Slider>

			{/* Global video modal - renders at top level */}
			<LocalMediaModal
				ref={videoModalRef}
				sourceId={currentVideoId}
				closeIcon={<Icon className="h-6 w-6 text-white" id="x" />}
				expenderIcon={<Icon className="h-6 w-6 text-white" id="arrows-expand" />}
				minimizerIcon={<Icon className="h-6 w-6 text-white" id="minus" />}
			/>
		</>
	)
}
export default SliderMultiItems
