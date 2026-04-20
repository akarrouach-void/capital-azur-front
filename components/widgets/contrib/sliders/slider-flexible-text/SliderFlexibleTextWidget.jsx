import { YouTubeGetID, vclsx } from "@vactorynext/core/utils"
import { useEffect, useState } from "react"
import { useMedia } from "@vactorynext/core/hooks"
import YouTube from "react-youtube"

import {
	Slider,
	SliderSlides,
	Button,
	Wysiwyg,
	Heading,
	Text,
	Image,
	MotionTrim,
} from "@/ui"
import { motion, useAnimation } from "framer-motion"
import get from "lodash.get"
import Cookies from "js-cookie"

export const config = {
	id: "vactory_default:50",
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
		<div className="relative flex h-[650px] w-full items-center justify-center overflow-hidden lg:h-[500px]">
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
							{...slide.image}
							alt={slide?.image?.alt}
							className="absolute right-0 top-0 h-full w-full object-cover"
						/>
					)}
				</>
			) : (
				<Image
					{...slide.image}
					alt={slide?.image?.alt}
					className="absolute right-0 top-0 h-full w-full object-cover"
				/>
			)}

			<div className="relative h-full w-full">
				{/* layer overlay */}
				<div className="absolute right-0 top-0 h-full w-full bg-black bg-opacity-40 "></div>
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
									duration: 0.3,
									delayChildren: 0.2,
									staggerChildren: 0.2,
								},
							},
						}}
						initial="initial"
						animate={cardAnimationControls}
						className={vclsx(
							slide.position === "left"
								? "px-8 py-16 lg:absolute lg:right-[48%] lg:w-1/2 max-lg:text-center rtl:lg:left-0"
								: slide.position === "right"
									? "px-8 py-16 lg:absolute lg:left-[48%] lg:w-1/2 max-lg:text-center rtl:lg:right-0"
									: "px-8 py-16 text-center lg:w-1/2"
						)}
					>
						{slide.title && (
							<motion.div
								variants={{
									initial: {
										opacity: 0,
									},
									animate: {
										opacity: 1,
										transition: {
											delayChildren: 0.5,
											staggerChildren: 0.08,
										},
									},
								}}
								initial="initial"
								animate={cardAnimationControls}
							>
								<Heading
									level={3}
									variant={1}
									className={vclsx(
										"relative mb-14 flex flex-wrap font-bold uppercase !leading-none text-white before:absolute before:bottom-[-32px] before:left-1/2 before:w-14 before:-translate-x-1/2 before:border-b-[8px] before:border-error-500 before:content-[''] lg:before:-bottom-[34px] max-lg:justify-center rtl:before:translate-x-1/2",
										slide.position !== "center"
											? "lg:before:left-1/3"
											: "lg:justify-center"
									)}
								>
									{isLiveMode ? slide.title : <MotionTrim>{slide.title}</MotionTrim>}
								</Heading>
							</motion.div>
						)}
						{slide.content && (
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
								<Text
									as="div"
									className={vclsx(
										"mb-10 text-white",
										slide.position !== "center" && "lg:ml-[120px]"
									)}
								>
									<Wysiwyg html={slide.content} />
								</Text>
								{slide.link.href !== "" && slide.link.title && (
									<Button variant="secondary" {...slide.link}>
										{slide.link.title}
									</Button>
								)}
							</motion.div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	)
}

const SliderFlexibleText = ({ data }) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const isMobile = useMedia("(max-width: 640px)", true)
	const [height, setHeight] = useState(800)

	const props = data?.components.map((item, index) => ({
		id: index,
		title: get(item, "title", null),
		content: get(item, "content.value['#text']", null),
		link: {
			href: get(item, "link.url", null),
			title: get(item, "link.title", null),
			id: get(item, "link.attributes.id", ""),
			className:
				get(item, "link.attributes.class", "") + item?.position !== "center"
					? "lg:ml-[120px]"
					: "",
			rel: get(item, "link.attributes.rel", null),
			target: get(item, "link.attributes.target", null),
		},
		image: {
			src: get(item, "image[0]._default", null),
			width: get(item, "image[0].meta.width", null),
			height: get(item, "image[0].meta.height", null),
			alt: get(item, "image[0].meta.alt", null),
			title: get(item, "image[0].meta.title", null),
		},
		video: get(item, "video.url", null),
		position: get(item, "position", null),
	}))

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: true,
			hideArrowDesktop: true,
		},
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 0,
		},
		initial: 0,
		loop: true,
		breakpoints: {},
	}

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
	// 					player?.target?.playVideo()
	// 				}
	// 			} else {
	// 				if (youtubePlayer.current[index]) {
	// 					player?.target?.pauseVideo()
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

	return (
		<Slider
			sliderSettings={sliderSettings}
			// sliderPlugins={sliderPlugins}
			variant="sliderImageBgVideo"
			onCurrentSlideChange={onSlideChange}
			className="overflow-hidden rounded-xl"
		>
			{props.map((slide, index) => {
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
	)
}
export default SliderFlexibleText
