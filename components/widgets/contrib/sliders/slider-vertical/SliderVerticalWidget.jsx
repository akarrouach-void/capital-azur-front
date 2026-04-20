import { Slider, SliderSlides, Image, Button, Heading, Text } from "@/ui"

export const config = {
	id: "vactory_default:40",
}

const SliderVertical = ({ data }) => {
	const slidesData = data.components.map((item) => {
		return {
			title: item?.title,
			content: item?.content,
			image: {
				src: item?.image[0]?._default,
				alt: item?.image[0]?.meta?.alt,
			},
			cta: {
				url: item?.link?.url,
				title: item?.link?.title,
				target: item?.link?.attributes?.target,
				rel: item?.link?.attributes?.rel,
				className: item?.link?.attributes?.class,
				id: item?.link?.attributes?.id,
			},
		}
	})

	const sliderSettings = {
		vertical: true,
		arrows: {
			hideArrowMobile: false,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		dots: {
			hideDotsMobile: true,
			hideDotsTablet: true,
			hideDotsDesktop: true,
		},
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 0,
		},
		breakpoints: {},
	}

	return (
		<Slider sliderSettings={sliderSettings} variant="vertical" className="h-[500px]">
			{slidesData.map((slide, index) => (
				<SliderSlides key={`slide-card-${index}`} className="h-full">
					<div className="group relative h-full overflow-hidden shadow-xl">
						{/* Background Image */}
						<div className="absolute inset-0">
							<Image
								src={slide.image.src}
								alt={slide.image.alt}
								className="h-full w-full object-cover
								"
								fill
							/>
							{/* Dark Overlay */}
							<div className="absolute inset-0 bg-black/30" />
						</div>

						{/* Content Overlay */}
						<div className="relative z-10 flex h-full flex-col items-center justify-center p-4">
							{slide.title && (
								<Heading level={3} className="mb-4 text-center font-bold text-white">
									{slide.title}
								</Heading>
							)}

							{slide.content && (
								<Text className="mb-6 text-center text-white" variant="cardExcerpt">
									{slide.content}
								</Text>
							)}

							{/* Action Button */}
							{slide?.cta?.url && (
								<Button href={slide.cta.url} variant="white" {...slide.cta}>
									{slide.cta.title}
								</Button>
							)}
						</div>
					</div>
				</SliderSlides>
			))}
		</Slider>
	)
}

export default SliderVertical
