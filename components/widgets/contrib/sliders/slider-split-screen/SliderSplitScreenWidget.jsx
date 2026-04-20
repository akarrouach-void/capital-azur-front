import { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import { Button, Heading, Icon, Image, Wysiwyg } from "@/ui"
import { useRTLDirection } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:42",
}

const SlideContent = ({ slideId, currentSlide, title, subTitle, content, link }) => {
	return (
		<div
			className={vclsx(
				slideId === currentSlide ? "opacity-1 z-[3]" : "z-[1] opacity-0",
				"animate absolute left-0 top-0 flex h-full w-full items-center"
			)}
		>
			<div className="text-white">
				{title && (
					<Heading level={3} className="mb-4 font-semibold">
						{title}
					</Heading>
				)}
				{subTitle && (
					<Heading level={5} className="mb-5 font-semibold">
						{subTitle}
					</Heading>
				)}
				{content && content}
				{link.href && link.title && (
					<Button variant="white" href={link.href} className="mt-4">
						{link.title}
					</Button>
				)}
			</div>
		</div>
	)
}

const SlideImage = ({ slideId, currentSlide, image, imageMobile }) => {
	return (
		<>
			{/* Desktop Image */}
			<Image
				{...image}
				alt={image?.alt}
				className={vclsx(
					slideId === currentSlide ? "opacity-1" : "opacity-0",
					"animate absolute top-0 h-full w-full object-cover",
					imageMobile?.src ? "hidden md:block" : "block"
				)}
			/>

			{/* Mobile Image - only show if mobile image exists */}
			{imageMobile?.src && (
				<Image
					{...imageMobile}
					alt={imageMobile?.alt || image?.alt}
					className={vclsx(
						slideId === currentSlide ? "opacity-1" : "opacity-0",
						"animate absolute top-0 block h-full w-full object-cover md:hidden"
					)}
				/>
			)}
		</>
	)
}

const Indicators = ({ currentSlide, totalSlides }) => {
	return (
		<div className="flex items-center text-white">
			<span className="text-sm">{currentSlide}</span>
			<span className="mx-3 text-xl">/</span>
			<span className="text-sm">{totalSlides}</span>
		</div>
	)
}

const Navigation = ({ slider }) => {
	const handleNext = () => {
		slider.current.next()
	}
	const handlePrev = () => {
		slider.current.prev()
	}
	return (
		<div className="flex gap-x-2">
			<button
				className="animate flex h-12 w-12 items-center justify-center rounded-full bg-black/50 hover:bg-black"
				onClick={handlePrev}
				aria-label="navigation button"
			>
				<Icon id="chevron-left" className="rtl-icon h-4 w-4 text-white" />
			</button>
			<button
				className="animate flex h-12 w-12 items-center justify-center rounded-full bg-black/50 hover:bg-black"
				onClick={handleNext}
				aria-label="navigation button"
			>
				<Icon id="chevron-right" className="rtl-icon h-4 w-4 text-white" />
			</button>
		</div>
	)
}

const SliderSplitScreen = ({ data }) => {
	const slidesData = data.components.map((item) => {
		return {
			title: item?.title,
			subTitle: item?.second_title,
			content: item?.content?.value?.["#text"] ? (
				<Wysiwyg className="prose text-white" html={item?.content?.value?.["#text"]} />
			) : null,
			image: {
				src: item?.image?.[0]?._default,
				width: item?.image?.[0]?.meta?.width,
				height: item?.image?.[0]?.meta?.height,
				alt: item?.image?.[0]?.meta?.alt,
				title: item?.image?.[0]?.meta?.title,
			},
			image_mobile: {
				src: item?.image_mobile?.[0]?._default || null,
				width: item?.image_mobile?.[0]?.meta?.width || null,
				height: item?.image_mobile?.[0]?.meta?.height || null,
				alt: item?.image_mobile?.[0]?.meta?.alt || null,
				title: item?.image_mobile?.[0]?.meta?.title || null,
			},
			link: {
				href: item?.link?.url,
				title: item?.link?.title,
				id: item?.link?.attributes?.id,
				className: item?.link?.attributes?.class,
				rel: item?.link?.attributes?.rel,
				target: item?.link?.attributes?.target,
			},
		}
	})

	const isRTLDirection = useRTLDirection()
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const [refCallback, slider] = useKeenSlider({
		loop: true,
		rtl: isRTLDirection,
		slides: slidesData.length,
		created() {
			setLoaded(true)
		},
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel)
		},
	})

	return (
		<div
			ref={refCallback}
			className="keen-slider relative h-[700px] bg-gradient-to-b from-black to-gray-800 lg:h-[600px]"
		>
			<div className="absolute left-0 right-0 top-0 z-[3] flex h-full w-full flex-col justify-center p-8 lg:w-1/2 max-lg:pb-3">
				{/* Dark overlay for mobile text readability */}
				<div className="absolute inset-0 bg-black/60 lg:hidden"></div>

				<div className="relative z-[1] flex-grow">
					{slidesData.map((slide, index) => {
						return (
							<SlideContent
								key={index}
								slideId={index}
								currentSlide={currentSlide}
								title={slide.title}
								subTitle={slide.subTitle}
								content={slide.content}
								link={slide.link}
							/>
						)
					})}
				</div>

				{loaded && slider && (
					<div className="relative z-50 flex w-full shrink-0 items-center justify-between">
						<div className="flex items-center gap-x-5">
							<Indicators
								currentSlide={currentSlide + 1}
								totalSlides={slider.current?.options?.slides}
							/>
						</div>
						<Navigation slider={slider} />
					</div>
				)}
			</div>

			<div className="absolute right-0 top-0 h-full w-full lg:w-1/2">
				<div className="relative h-full w-full">
					{slidesData.map((slide, index) => {
						return (
							<SlideImage
								key={index}
								slideId={index}
								currentSlide={currentSlide}
								image={slide.image}
								imageMobile={slide.image_mobile}
							/>
						)
					})}
				</div>
				<div className="absolute right-0 top-0 h-full w-full bg-black bg-opacity-[.2] lg:hidden"></div>
			</div>
		</div>
	)
}

export default SliderSplitScreen
