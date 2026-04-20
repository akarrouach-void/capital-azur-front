import { useState } from "react"
import { Slider, SliderSlides, Button, Heading, Image, Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { stripHtml } from "@vactorynext/core/lib"
import get from "lodash.get"
import truncate from "truncate"

export const config = {
	id: "vactory_default:43",
}

const Slide = ({ slideIndex, currentSlide, slide }) => {
	return (
		<div
			className={vclsx(
				slideIndex === currentSlide ? "max-h-[600px]" : "max-h-[400px]",
				"animate relative h-full flex-1 overflow-hidden rounded-xl"
			)}
		>
			{slideIndex === currentSlide && (
				<div className="absolute inset-0 z-10 mx-5 flex flex-col items-center justify-center gap-4 lg:mx-10">
					<Heading level={3} variant="4" className="text-center text-white">
						{slide.title}
					</Heading>
					<Text className="text-center text-white lg:text-xl">{slide.content}</Text>

					{slide.link.href && slide.link.title && (
						<Button href={slide.link.href} variant="white">
							{slide.link.title}
						</Button>
					)}
				</div>
			)}
			<div className="absolute inset-0">
				<div className="z-9 absolute inset-0 bg-black/30"></div>
				{slide.image.src && (
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className="h-full w-full object-cover"
					/>
				)}
			</div>
		</div>
	)
}

const SliderCurvey = ({ data }) => {
	const [currentSlide, setCurrentSlide] = useState(0)

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
		}
	})

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		breakpoints: {
			"(min-width: 800px)": {
				slides: {
					origin: "center",
					perView: 1.7,
					spacing: 15,
				},
			},
			"(max-width: 800px)": {
				slides: { origin: "center", perView: 1.2, spacing: 10 },
			},
		},
	}

	const onSlideChange = (childSliderCurrent) => {
		// Update the parent's state when the child's state changes
		setCurrentSlide(childSliderCurrent)
	}

	return (
		<>
			<Slider
				sliderSettings={sliderSettings}
				onCurrentSlideChange={onSlideChange}
				className="h-[550px]"
			>
				{slidesData.map((slide, index) => {
					return (
						<SliderSlides
							key={index}
							className="flex shrink-0 items-center justify-center"
						>
							<Slide slideIndex={index} currentSlide={currentSlide} slide={slide} />
						</SliderSlides>
					)
				})}
			</Slider>
		</>
	)
}

export default SliderCurvey
