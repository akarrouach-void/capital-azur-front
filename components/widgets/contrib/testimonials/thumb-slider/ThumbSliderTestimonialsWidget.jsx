import { useState } from "react"
import {
	Text,
	Wysiwyg,
	Heading,
	SliderSlides,
	SliderArrows,
	Image,
	Icon,
	SliderDots,
} from "@/ui"
import { vclsx, thumbnailPlugin } from "@vactorynext/core/utils"
import { useRTLDirection } from "@vactorynext/core/hooks"
import get from "lodash.get"
import { useKeenSlider } from "keen-slider/react"
// CSS imported in base slider component (SliderSlide.jsx)

export const config = {
	id: "vactory_default:24",
}

const sliderSettings = {
	arrows: {
		hideArrowMobile: true,
		hideArrowTablet: false,
		hideArrowDesktop: false,
	},
	dots: {
		hideDotsMobile: false,
		hideDotsTablet: true,
		hideDotsDesktop: true,
	},
	rtl: false,
	loop: true,
	disabled: false,
	centred: false,
	initial: 0,
	slides: {
		origin: "auto",
		number: null,
		perView: 1,
		spacing: 16,
	},
	mode: "snap",
	rubberband: true,
	renderMode: "precision",
	defaultAnimation: { duration: 500 },
	vertical: false,
	opacity: false,
}

const thumbsSliderSettings = {
	arrows: {
		hideArrowMobile: false,
		hideArrowTablet: false,
		hideArrowDesktop: false,
	},
	rtl: false,
	loop: false,
	disabled: true,
	centred: true,
	initial: 0,
	slides: {
		origin: "auto",
		number: null,
		perView: 4,
		spacing: 16,
	},
	mode: "snap",
	rubberband: false,
	renderMode: "precision",
	defaultAnimation: { duration: 500 },
	vertical: false,
	opacity: false,
}

export const ThumbSlider = ({
	sliderSettings,
	thumbsSliderSettings,
	sliderClassName,
	thumbSliderClassName,
	slides,
	thumbs,
	variant = "default",
	arrowIconNext,
	arrowIconPrev,
}) => {
	const arrowsSettings = {
		hideArrowMobile: sliderSettings?.arrows?.hideArrowMobile || false,
		hideArrowTablet: sliderSettings?.arrows?.hideArrowTablet || false,
		hideArrowDesktop: sliderSettings?.arrows?.hideArrowDesktop || false,
	}

	const dotsSettings = {
		hideDotsMobile: sliderSettings?.dots?.hideDotsMobile || false,
		hideDotsTablet: sliderSettings?.dots?.hideDotsTablet || false,
		hideDotsDesktop: sliderSettings?.dots?.hideDotsDesktop || false,
	}

	// const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const isRTLDirection = useRTLDirection()
	const [currentSlide, setCurrentSlide] = useState(0)

	const [sliderRef, instanceRef] = useKeenSlider({
		rtl: isRTLDirection,
		loop: sliderSettings?.loop || true,
		disabled: sliderSettings?.disabled || false,
		centred: sliderSettings?.centred || false,
		initial: sliderSettings?.initial || 0,
		slides: {
			origin: sliderSettings?.slides?.origin || "auto",
			number: sliderSettings?.slides?.number || null,
			perView: sliderSettings?.slides?.perView || 1,
			spacing: sliderSettings?.slides?.spacing || 10,
		},
		defaultAnimation: {
			duration: sliderSettings?.defaultAnimation?.duration || 500,
		},
		rubberband: sliderSettings?.rubberband || true,
		renderMode: sliderSettings?.renderMode || "precision",
		vertical: sliderSettings?.vertical || false,
		opacity: sliderSettings?.opacity || false,
		breakpoints: sliderSettings?.breakpoints || null,

		// slideChanged(Slider) {
		// 	setCurrentSlide(Slider.track.details.rel)
		// },
		created() {
			setLoaded(true)
		},
		slideChanged() {
			setCurrentSlide(instanceRef.current.track.details.rel)
		},
	})

	const [thumbnailRef] = useKeenSlider(
		{
			rtl: isRTLDirection,
			loop: thumbsSliderSettings?.loop || true,
			disabled: thumbsSliderSettings?.disabled || false,
			centred: thumbsSliderSettings?.centred || false,
			initial: thumbsSliderSettings?.initial || 0,
			slides: {
				origin: thumbsSliderSettings?.slides?.origin || "auto",
				number: thumbsSliderSettings?.slides?.number || null,
				perView: thumbsSliderSettings?.slides?.perView || 1,
				spacing: thumbsSliderSettings?.slides?.spacing || 10,
			},
			defaultAnimation: {
				duration: thumbsSliderSettings?.defaultAnimation?.duration || 500,
			},
			rubberband: thumbsSliderSettings?.rubberband || true,
			renderMode: thumbsSliderSettings?.renderMode || "precision",
			vertical: thumbsSliderSettings?.vertical || false,
			opacity: thumbsSliderSettings?.opacity || false,
			breakpoints: thumbsSliderSettings?.breakpoints || null,
		},
		[thumbnailPlugin(instanceRef)]
	)

	return (
		<div className="relative">
			<div className="relative mb-10 md:mb-0 md:px-10">
				<div ref={sliderRef} className={vclsx("keen-slider", sliderClassName)}>
					{slides}
				</div>
				{loaded && instanceRef.current && (
					<>
						<SliderArrows
							prev
							arrowsSettings={arrowsSettings}
							onClick={() => instanceRef.current?.prev()}
							variant={variant}
							arrowIconPrev={arrowIconPrev}
						/>

						<SliderArrows
							next
							arrowsSettings={arrowsSettings}
							onClick={() => instanceRef.current?.next()}
							variant={variant}
							arrowIconNext={arrowIconNext}
						/>
					</>
				)}
				<SliderDots
					instanceRef={instanceRef}
					currentSlide={currentSlide}
					className={"k"}
					variant={variant}
					dotsSettings={dotsSettings}
				/>
			</div>

			<div
				ref={thumbnailRef}
				className={vclsx("keen-slider thumbnail", thumbSliderClassName)}
			>
				{thumbs(currentSlide)}
			</div>
		</div>
	)
}

const SliderThumbs = ({ children, className = "", ...props }) => {
	return (
		<div
			className={vclsx("keen-slider__slide keen-slider__thumbs", className)}
			{...props}
		>
			{children}
		</div>
	)
}

const TestemonialSlides = ({ items }) => {
	return (
		<>
			{items.map((item, index) => {
				return (
					<SliderSlides key={index} className="pt-1 md:p-8">
						<div className="relative mx-auto flex h-full flex-col justify-center rounded-lg bg-white p-6 text-center shadow-lg lg:p-10">
							<div className="relative mx-auto mb-6 block h-[100px] w-[100px] overflow-hidden rounded-full border-2 border-white shadow-xl md:hidden">
								<Image
									src={item.image.src}
									fill
									alt={item.image.alt}
									className="h-full w-full object-cover"
								/>
							</div>
							<Wysiwyg html={item.description} className="prose mb-2 max-w-none" />
							<Heading level="3" variant={"4"} className="mt-4 text-center">
								{item.name}
							</Heading>
							<Text className="text-base text-gray-500">{item.role}</Text>
						</div>
					</SliderSlides>
				)
			})}
		</>
	)
}

const TestemonialThumbs = ({ items, currentSlide }) => {
	return (
		<div className="hidden justify-center md:flex">
			{items.map((item, index) => {
				return (
					<SliderThumbs key={index} className={vclsx("mx-3 cursor-pointer")}>
						<div
							className={vclsx(
								"relative mx-auto h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-white shadow-xl hover:border-primary-400",
								{
									"border-2 border-primary-400": index === currentSlide,
								}
							)}
						>
							<Image
								{...item.image}
								alt={item.image.alt}
								className="h-full object-cover"
							/>
						</div>
					</SliderThumbs>
				)
			})}
		</div>
	)
}

const TestemonialSlider = ({ data }) => {
	const props = {
		introduction: get(data, "extra_field.intro", null),
		items: data?.components?.map((item) => ({
			name: get(item, "name", null),
			role: get(item, "role", null),
			description: get(item, "description.value['#text']", null),
			image: {
				src: get(item, "image[0]._default", null),
				alt: get(item, "image[0].meta.alt", null),
				height: get(item, "image[0].meta.height", null),
				width: get(item, "image[0].meta.width", null),
				title: get(item, "image_alt", null),
			},
		})),
	}

	return (
		<>
			<Text className="prose mx-auto mb-8 w-full text-center md:w-2/3">
				{props.introduction}
			</Text>
			<ThumbSlider
				sliderSettings={sliderSettings}
				thumbsSliderSettings={thumbsSliderSettings}
				thumbSliderClassName={"flex justify-center"}
				sliderClassName={""}
				slides={<TestemonialSlides {...props} />}
				thumbs={(currentSlide) => {
					return <TestemonialThumbs {...props} currentSlide={currentSlide} />
				}}
				arrowIconNext={<Icon id="chevron-right" className="h-4 w-4 text-white" />}
				arrowIconPrev={<Icon id="chevron-left" className="h-4 w-4 text-white" />}
			/>
		</>
	)
}

export default TestemonialSlider
