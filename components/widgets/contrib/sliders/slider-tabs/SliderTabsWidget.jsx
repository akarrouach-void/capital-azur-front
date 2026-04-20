import { useState, useEffect } from "react"
import YouTube from "react-youtube"
import { motion, AnimatePresence } from "framer-motion"
import {
	Heading,
	Image,
	Wysiwyg,
	Slider,
	SliderSlides,
	Button,
	Text,
	Container,
} from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
// CSS imported in base slider component (SliderSlide.jsx)

export const config = {
	id: "vactory_default:39",
}

const Slide = ({ slide, height }) => {
	const [videoIsReady, setVideoIsReady] = useState(false)

	return (
		<motion.div
			className="relative h-full w-full overflow-hidden"
			initial={{ opacity: 0.5 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			{/* Background overlay for smooth transitions */}
			<div className="absolute inset-0 z-[1] bg-black/30" />

			{slide.video ? (
				<>
					<div className="absolute bottom-0 left-0 top-0 my-auto h-full w-full">
						<YouTube
							id={slide.video}
							style={{ height: `${height + 300}px` }}
							opts={{
								playerVars: {
									playlist: slide.video,
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
							videoId={slide.video}
							iframeClassName="w-full h-full"
							className="absolute bottom-0 left-0 top-0 my-auto h-full w-full"
						/>
					</div>
					{!videoIsReady && (
						<div className="absolute inset-0">
							<Image
								src={slide.image?.src}
								alt={slide.image?.alt}
								className="absolute inset-0 h-full w-full object-cover"
								fill
							/>
						</div>
					)}
				</>
			) : (
				<div className="absolute inset-0">
					<Image
						src={slide.image?.src}
						alt={slide.image?.alt}
						className="absolute inset-0 h-full w-full object-cover"
						fill
					/>
				</div>
			)}
		</motion.div>
	)
}

const TabSlider = ({ data }) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [sliderKey, setSliderKey] = useState(0)
	const [isManualChange, setIsManualChange] = useState(false)
	const [height, setHeight] = useState(600)

	const slidesData = data.components.map((item, index) => {
		return {
			image: {
				src: item?.image[0]?._default,
				alt: item?.image[0]?.meta?.alt,
				width: item?.image[0]?.meta?.width,
				height: item?.image[0]?.meta?.height,
			},
			video: item?.video ? item?.video : null,
			id: index,
			title: item.title,
			subtitle: item.title_description,
			content: item.content.value["#text"] ? (
				<Wysiwyg html={item.content.value["#text"]} />
			) : null,
			link: {
				title: item.link.title,
				url: item.link.url,
				attributes: item.link.attributes,
			},
		}
	})

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: true,
			hideArrowDesktop: true,
		},
		dots: {
			hideDotsMobile: true,
			hideDotsTablet: true,
			hideDotsDesktop: true,
		},
		drag: false,
		loop: false,
		autoplay: false,
		slides: {
			perView: 1,
			spacing: 0,
		},
		breakpoints: {
			"(min-width: 768px)": {
				slides: {
					perView: 1,
				},
			},
		},
	}

	const handleSlideChange = (slideIndex) => {
		if (!isManualChange) {
			setCurrentSlide(slideIndex)
		}
		setIsManualChange(false)
	}

	const handleTabClick = (index) => {
		setIsManualChange(true)
		setCurrentSlide(index)
		setSliderKey((prev) => prev + 1)
	}

	const calculateYoutubeFrameheight = () => {
		if (typeof window !== "undefined") {
			let width = window.innerWidth
			setHeight(width / (16 / 9))
		}
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			calculateYoutubeFrameheight()
			window.addEventListener("resize", calculateYoutubeFrameheight)
			return () => {
				window.removeEventListener("resize", calculateYoutubeFrameheight)
			}
		}
	}, [])

	return (
		<div className="relative h-[500px] lg:h-[700px]">
			{/* Background Slider */}
			<Slider
				key={sliderKey}
				sliderSettings={{
					...sliderSettings,
					initial: currentSlide,
				}}
				onCurrentSlideChange={handleSlideChange}
				className="h-full"
				variant="fullBackground"
			>
				{slidesData.map((slide, index) => (
					<SliderSlides key={index} className="h-full">
						<Slide slide={slide} height={height} />
					</SliderSlides>
				))}
			</Slider>

			{/* Custom Mobile Arrows */}
			<SliderArrows
				currentSlide={currentSlide}
				slidesData={slidesData}
				handleTabClick={handleTabClick}
			/>

			{/* Content Overlay with Smooth Animations */}
			<Container className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col lg:flex-row">
				{/* Left Side - Tab Navigation (Desktop Only) */}
				<div className="hidden items-center p-4 lg:flex lg:w-1/2 lg:p-8">
					<div className="relative flex w-full flex-col items-start gap-6">
						{/* Background line */}
						<div className="absolute left-0 top-0 h-full w-1 bg-yellow-400/30"></div>

						{/* Moving yellow indicator */}
						<div
							className="absolute left-0 h-[66px] w-1 bg-yellow-400 shadow-lg shadow-yellow-400/50 transition-transform duration-500 ease-out"
							style={{
								transform: `translateY(${currentSlide * (66 + 24)}px)`, // 66px height + 24px gap
							}}
						></div>

						{slidesData.map((tab, index) => (
							<div
								key={tab.id}
								className={vclsx(
									"transform cursor-pointer transition-opacity duration-300 ease-out",
									currentSlide === index ? "opacity-100" : "opacity-70"
								)}
								onClick={() => handleTabClick(index)}
								onKeyDown={(e) => {
									e.key === "Enter" && handleTabClick(index)
								}}
								role="button"
								tabIndex={0}
							>
								<div className="flex items-start gap-3 lg:gap-4">
									<div className="h-[66px] w-1"></div>

									<div className="flex-1">
										<Heading level={3} variant="6" className="text-white">
											{tab.title}
										</Heading>
										{tab.subtitle && (
											<Text className="text-sm text-white lg:text-lg">
												{tab.subtitle}
											</Text>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Content - Full width on mobile, right side on desktop */}
				<div className="flex w-full items-center justify-center p-4 pb-24 lg:w-1/2 lg:p-8 lg:pb-8">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentSlide}
							className="max-w-lg text-center lg:text-left"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: "easeOut" }}
						>
							<Heading level={3} variant="4" className="mb-4 text-white lg:mb-6">
								{slidesData[currentSlide]?.title}
							</Heading>

							<div className="mb-4 text-white lg:mb-8">
								{slidesData[currentSlide]?.content}
							</div>

							{slidesData[currentSlide]?.link?.url ? (
								<Button variant="white" href={slidesData[currentSlide]?.link?.url}>
									{slidesData[currentSlide]?.link?.title}
								</Button>
							) : null}
						</motion.div>
					</AnimatePresence>
				</div>
			</Container>
		</div>
	)
}

const SliderArrows = ({ currentSlide, slidesData, handleTabClick }) => {
	return (
		<div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-4 lg:hidden">
			<button
				onClick={() =>
					handleTabClick(currentSlide > 0 ? currentSlide - 1 : slidesData.length - 1)
				}
				className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 active:scale-95"
				aria-label="Previous slide"
			>
				<svg
					className="h-6 w-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				onClick={() =>
					handleTabClick(currentSlide < slidesData.length - 1 ? currentSlide + 1 : 0)
				}
				className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 active:scale-95"
				aria-label="Next slide"
			>
				<svg
					className="h-6 w-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	)
}

export default TabSlider
