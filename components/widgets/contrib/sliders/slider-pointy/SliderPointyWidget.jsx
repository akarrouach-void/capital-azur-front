import { useState } from "react"
import { Heading, Button, Image, Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const config = {
	id: "vactory_default:37",
}

// Reusable content component for slide text and button
const SlideContent = ({ slide, isActive, isMobile = false }) => {
	const contentClasses = vclsx(
		isActive ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
		isMobile
			? "animate flex flex-col items-center justify-center"
			: "duration-800 absolute inset-0 z-20 flex flex-col items-center justify-center p-12 transition-all delay-300 ease-out"
	)

	return (
		<div className={contentClasses}>
			{slide.title && (
				<Heading
					level={2}
					className="mb-4 max-w-lg text-center text-white drop-shadow-lg lg:mb-6 "
				>
					{slide.title}
				</Heading>
			)}
			{slide.content && (
				<Text
					variant="quote"
					className="mb-6 max-w-md text-center text-white/90 drop-shadow-md"
				>
					{slide.content}
				</Text>
			)}
			{slide.link.href && slide.link.title && (
				<Button
					href={slide.link.href}
					variant="white"
					size={isMobile ? "normal" : undefined}
				>
					{slide.link.title}
				</Button>
			)}
		</div>
	)
}

// Desktop slide layout with alternating positions
const DesktopSlide = ({ slide, slideId, isActive }) => {
	return (
		<div className="relative hidden h-full w-full lg:flex">
			{/* Content Section */}
			<div
				style={{ backgroundColor: slide.background }}
				className={vclsx(
					"absolute top-0 h-full w-1/2 overflow-hidden transition-all duration-1000 ease-in-out",
					slideId % 2 === 0 ? "left-0" : "right-0"
				)}
			>
				{/* Gradient overlay for better text readability */}
				<div className="absolute inset-0 z-10 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
				<SlideContent slide={slide} isActive={isActive} />
			</div>

			{/* Image Section */}
			<div
				className={vclsx(
					"absolute top-0 h-full w-1/2 overflow-hidden transition-all duration-1000 ease-in-out",
					slideId % 2 === 0 ? "right-0" : "left-0"
				)}
			>
				<div
					className={vclsx(
						isActive ? "scale-100 opacity-100" : "scale-110 opacity-80",
						"absolute inset-0 transition-all duration-1000 ease-out"
					)}
				>
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className="h-full w-full object-cover"
						imageContainerClassName="h-full"
					/>
				</div>
				{/* Subtle overlay for depth */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
			</div>
		</div>
	)
}

// Mobile slide layout with full-screen image and overlaid content
const MobileSlide = ({ slide, isActive }) => {
	return (
		<div className="h-full w-full lg:hidden">
			{/* Background Image */}
			<div className="absolute inset-0 overflow-hidden">
				<div
					className={vclsx(
						isActive ? "scale-100 opacity-100" : "scale-110 opacity-90",
						"absolute inset-0 transition-all duration-1000 ease-out"
					)}
				>
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className="h-full w-full object-cover"
						imageContainerClassName="h-full"
					/>
				</div>
				{/* Mobile overlay for better text readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
			</div>

			{/* Content Overlay */}
			<div className="relative z-20 flex h-full flex-col items-center justify-center p-6 text-center">
				<SlideContent slide={slide} isActive={isActive} isMobile />
			</div>
		</div>
	)
}

// Main slide component that combines desktop and mobile layouts
const Slide = ({ activeSlide, slideId, slide }) => {
	const isActive = activeSlide === slideId

	return (
		<div
			className={vclsx(
				isActive ? "opacity-100" : "opacity-0",
				"absolute inset-0 transition-opacity duration-500 ease-in-out"
			)}
		>
			<DesktopSlide slide={slide} slideId={slideId} isActive={isActive} />
			<MobileSlide slide={slide} isActive={isActive} />
		</div>
	)
}

// Navigation component with numbered buttons and progress bar
const SliderNavigation = ({ slidesData, activeSlide, onSlideChange }) => {
	return (
		<div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2">
			{/* Numbered Navigation Buttons */}
			<div className="flex items-center gap-1">
				{slidesData.map((_, index) => (
					<button
						key={index}
						onClick={() => onSlideChange(index)}
						className={vclsx(
							"animate flex h-10 w-10 items-center justify-center rounded-lg border-white/20 lg:h-12 lg:w-12 max-lg:border-2",
							activeSlide === index
								? "bg-white/90 text-gray-900 shadow-md"
								: "bg-black/40 text-white hover:bg-black/60"
						)}
						aria-label={`Go to slide ${index + 1}`}
					>
						<span className="text-sm font-semibold lg:text-base">{index + 1}</span>
					</button>
				))}
			</div>

			{/* Progress Indicator */}
			<div className="mt-3 flex justify-center">
				<div
					className="h-1 overflow-hidden rounded-full bg-white/20"
					style={{ width: `${slidesData.length * 24}px` }}
				>
					<div
						className="animate h-full rounded-full bg-white"
						style={{
							width: `${((activeSlide + 1) / slidesData.length) * 100}%`,
							transform: "translateZ(0)", // Hardware acceleration
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export const SliderPointy = ({ data }) => {
	const slidesData = data.components.map((item) => {
		return {
			title: get(item, "title", null),
			content: truncate(stripHtml(get(item, "content.value['#text']", "")), 300),
			link: {
				href: get(item, "link.url", null),
				title: get(item, "link.title", null),
				id: get(item, "link.attributes.id", ""),
				className: get(item, "link.attributes.class", ""),
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
			background: get(item, "background_color", null),
		}
	})

	const [activeSlide, setActiveSlide] = useState(0)

	return (
		<div className="relative h-[550px] w-full overflow-hidden rounded-2xl bg-gray-50 shadow-2xl md:h-[600px] lg:h-[600px]">
			{/* Slides container with enhanced styling */}
			<div className="absolute inset-0 overflow-hidden rounded-2xl">
				{slidesData.map((slide, index) => {
					return (
						<Slide key={index} slideId={index} activeSlide={activeSlide} slide={slide} />
					)
				})}
			</div>

			<SliderNavigation
				slidesData={slidesData}
				activeSlide={activeSlide}
				onSlideChange={setActiveSlide}
			/>
		</div>
	)
}

export default SliderPointy
