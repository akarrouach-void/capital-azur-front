import { YouTubeGetID, vclsx } from "@vactorynext/core/utils"
import { useEffect, useState } from "react"
import { useMedia } from "@vactorynext/core/hooks"
import YouTube from "react-youtube"
import { Slider, SliderSlides, Button, Image, Icon, MotionTrim, Heading } from "@/ui"
import get from "lodash.get"
import { motion, useAnimation } from "framer-motion"
import Cookies from "js-cookie"

export const config = {
	id: "vactory_default:46",
}

const SliderFullBackground = ({ data }) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const isMobile = useMedia("(max-width: 640px)", true)
	const [height, setHeight] = useState(600)

	const props = {
		sliderSettings: {
			autoPlay: get(data, "extra_field.group_gonfig.autoLoop", false),
			playSpeed: get(data, "extra_field.group_gonfig.loopSpeed", 5000),
			hideArrowMobile: get(data, "extra_field.group_gonfig.hideArrowMobile", false),
			hideArrowTablet: get(data, "extra_field.group_gonfig.hideArrowTablet", false),
			hideArrowDesktop: get(data, "extra_field.group_gonfig.hideArrowDesktop", false),
			hideDots: get(data, "extra_field.group_gonfig.hideDots", false),
		},
		slides: data?.components?.map((slide, index) => {
			return {
				id: index,
				title: get(slide, "title", null),
				content: get(slide, "content", null),
				link: {
					href: get(slide, "link.url", null),
					title: get(slide, "link.title", null),
					id: get(slide, "link.attributes.id", ""),
					className: get(slide, "link.attributes.class", ""),
					rel: get(slide, "link.attributes.rel", null),
					target: get(slide, "link.attributes.target", null),
				},
				video: get(slide, "video", null),
				image: {
					src: get(slide, "image[0]._default", null),
					width: get(slide, "image[0].meta.width", null),
					height: get(slide, "image[0].meta.height", null),
					alt: get(slide, "image[0].meta.alt", null),
					title: get(slide, "image[0].meta.title", null),
				},
				imageMobile: {
					src: get(slide, "image_mobile[0]._default", null),
					width: get(slide, "image_mobile[0].meta.width", null),
					height: get(slide, "image_mobile[0].meta.height", null),
					alt: get(slide, "image_mobile[0].meta.alt", null),
					title: get(slide, "image_mobile[0].meta.title", null),
				},
			}
		}),
	}

	const sliderSettings = {
		arrows: {
			hideArrowMobile: props?.sliderSettings?.hideArrowMobile,
			hideArrowTablet: props?.sliderSettings?.hideArrowTablet,
			hideArrowDesktop: props?.sliderSettings?.hideArrowDesktop,
		},
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 0,
		},
		breakpoints: {},
	}

	const sliderPlugins = [
		(slider) => {
			slider.on("created", () => {})
			slider.on("dragStarted", () => {})
			slider.on("animationEnded", () => {})
			slider.on("updated", () => {})
		},
	]

	const onSlideChange = (childSliderCurrent) => {
		// Update the parent's state when the child's state changes
		setCurrentSlide(childSliderCurrent)
	}

	const calculateYoutubeFrameheight = () => {
		if (typeof window !== "undefined") {
			let width = window.innerWidth
			setHeight(width / (16 / 9))
		}
	}

	// useEffect(() => {
	// 	if (youtubePlayer.current && !isMobile) {
	// 		youtubePlayer.current.forEach((player, index) => {
	// 			if (index == currentSlide) {
	// 				if (youtubePlayer.current[index]) {
	// 					player.target.playVideo()
	// 				}
	// 			} else {
	// 				if (youtubePlayer.current[index]) {
	// 					player.target.pauseVideo()
	// 				}
	// 			}
	// 		})
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [youtubePlayer.current, currentSlide])

	useEffect(() => {
		if (window !== "undefined") {
			calculateYoutubeFrameheight()
			window.addEventListener("resize", () => {
				calculateYoutubeFrameheight()
			})
		}
	}, [])

	const ArrowIconNext = () => (
		<Icon
			id="chevron-right"
			className="rtl-icon animate absolute h-4 w-4 text-white group-hover:scale-110"
		/>
	)
	const ArrowIconPrev = () => (
		<Icon
			id="chevron-left"
			className="rtl-icon animate absolute h-4 w-4 text-white group-hover:scale-110"
		/>
	)

	return (
		<>
			<Slider
				sliderSettings={sliderSettings}
				sliderPlugins={sliderPlugins}
				variant="fullBackground"
				onCurrentSlideChange={onSlideChange}
				className=""
				arrowIconNext={<ArrowIconNext />}
				arrowIconPrev={<ArrowIconPrev />}
			>
				{props.slides.map((slide, index) => {
					return (
						<SliderSlides key={index} className="shrink-0">
							<Slide
								currentSlide={currentSlide}
								slideIndex={index}
								slide={slide}
								isMobile={isMobile}
								height={height}
							/>
						</SliderSlides>
					)
				})}
			</Slider>
		</>
	)
}

const Slide = ({ slide, slideIndex, currentSlide, isMobile, height }) => {
	const isLiveMode = Cookies.get("isLiveMode") === "true"

	const [videoIsReady, setVideoIsReady] = useState(false)

	let video_id
	if (slide.video) {
		video_id = YouTubeGetID(slide.video)
	}

	const cardAnimationControls = useAnimation()

	useEffect(() => {
		if (currentSlide == slideIndex) {
			cardAnimationControls.start("animate")
		} else {
			cardAnimationControls.start("initial")
		}
	}, [currentSlide])

	return (
		<div
			style={{
				height: `${isMobile ? height + 300 : height}px`,
				maxHeight: "600px",
				transform: "translate3d(0,0,0)",
			}}
			className="relative flex w-full items-center justify-center overflow-hidden"
		>
			{video_id && !isMobile ? (
				<>
					<YouTube
						id={video_id}
						style={{ height: `${height + 300}px` }}
						opts={{
							playerVars: {
								playlist: video_id,
								loop: 1,
								autoplay: 1,
								controls: 0,
								mute: 1,
								rel: 0,
							},
						}}
						onPlay={() => {
							setVideoIsReady(true)
						}}
						videoId={video_id}
						iframeClassName="w-full h-full"
						className="absolute bottom-0 left-0 top-0 my-auto h-full w-full"
					/>
					{!videoIsReady && (
						<Image
							src={
								isMobile && slide.imageMobile.src
									? slide.imageMobile.src
									: slide.image.src
							}
							alt={
								isMobile && slide.imageMobile.alt
									? slide.imageMobile.alt
									: slide.image.alt
							}
							className="absolute right-0 top-0 object-cover"
							fill
						/>
					)}
				</>
			) : (
				<Image
					src={
						isMobile && slide.imageMobile.src ? slide.imageMobile.src : slide.image.src
					}
					alt={
						isMobile && slide.imageMobile.alt ? slide.imageMobile.alt : slide.image.alt
					}
					className="absolute right-0 top-0 object-cover"
					fill
				/>
			)}

			<div className="relative h-full w-full">
				{/* layer overlay */}
				<div className="absolute right-0 top-0 h-full w-full bg-black bg-opacity-50 "></div>
				{/* video background */}
				<div className="relative flex h-full w-full items-center justify-center ">
					<motion.div
						variants={{
							initial: {
								scale: 0.75,
								// y: 40,
								opacity: 0,
							},
							animate: {
								scale: 1,
								// y: 0,
								opacity: 1,
								transition: {
									duration: 0.5,
									delayChildren: 0.2,
									staggerChildren: 0.2,
								},
							},
						}}
						initial="initial"
						animate={cardAnimationControls}
						className="relative flex w-full flex-col items-center justify-center px-8 py-16 md:w-3/4 lg:w-1/2"
					>
						{slide.title && (
							<Heading
								className="mb-6 text-center text-4xl font-bold leading-tight text-white md:text-6xl"
								level={2}
								variant="none"
							>
								{slide.title}
							</Heading>
						)}
						{slide.content && (
							<motion.div
								variants={{
									initial: {
										opacity: 0,
									},
									animate: {
										opacity: 1,
										transition: {
											delayChildren: 0.5,
											staggerChildren: 0.04,
										},
									},
								}}
								initial="initial"
								animate={cardAnimationControls}
							>
								<motion.p className="mb-12 flex flex-wrap justify-center text-center text-base text-white md:text-xl">
									{isLiveMode ? slide.content : <MotionTrim>{slide.content}</MotionTrim>}
								</motion.p>
							</motion.div>
						)}
						{slide.link.href && (
							<motion.div
								variants={{
									initial: {
										opacity: 0,
										y: 20,
									},
									animate: {
										opacity: 1,
										y: 0,
										transition: {
											// duration: "2s",
											type: "spring",
											damping: 10,
										},
									},
								}}
							>
								<Button
									{...slide.link}
									variant="gradient"
									className={vclsx(slide.link.className, "mx-auto inline-block")}
								>
									{slide.link.title}
								</Button>
							</motion.div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	)
}

export default SliderFullBackground
