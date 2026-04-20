import { useState, useEffect } from "react"
import { useKeenSlider } from "keen-slider/react"
import { useRTLDirection } from "@vactorynext/core/hooks"
import { defaultSliderPluginFun, vclsx } from "@vactorynext/core/utils"
import { SliderArrows } from "./SliderArrows"
import { SliderDots } from "./SliderDots"
import { sliderTheme } from "./theme"
import "keen-slider/keen-slider.min.css"

export const SliderSlides = ({ children, className = "", ...props }) => {
	return (
		<div className={vclsx("keen-slider__slide", className)} {...props}>
			{children}
		</div>
	)
}

export const Slider = ({
	sliderSettings,
	sliderPlugins = [],
	children,
	className = "",
	variant = "default",
	onCurrentSlideChange,
	arrowIconNext,
	arrowIconPrev,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const isRTLDirection = useRTLDirection()

	let defaultSliderPlugins = defaultSliderPluginFun(sliderPlugins)

	const defaultSliderSettings = {
		rtl: isRTLDirection,
		loop: true,
		disabled: false,
		centred: false,
		initial: 0,
		mode: "snap",
		rubberband: true,
		renderMode: "precision",
		defaultAnimation: { duration: 500 },
		vertical: false,
		opacity: false,
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 16,
		},
		breakpoints: {
			"(min-width: 768px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: 2,
					spacing: 20,
				},
			},
			"(min-width: 992px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: 3,
					spacing: 20,
				},
			},
		},
		slideChanged(Slider) {
			setCurrentSlide(Slider.track.details.rel)
		},
		created() {
			setLoaded(true)
		},
		...sliderSettings,
	}

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

	const [sliderRef, instanceRef] = useKeenSlider(
		defaultSliderSettings,
		defaultSliderPlugins
	)

	useEffect(() => {
		if (typeof onCurrentSlideChange === "function") {
			onCurrentSlideChange(currentSlide)
		}
	}, [currentSlide])

	return (
		<div className={vclsx("relative h-full w-full", sliderTheme[variant].wrapper)}>
			<div
				ref={sliderRef}
				className={vclsx(
					"keen-slider",
					sliderTheme[variant].slider,
					className,
					loaded ? "" : "flex-col"
				)}
			>
				{children}
			</div>

			{loaded && instanceRef.current && (
				<SliderDots
					instanceRef={instanceRef}
					currentSlide={currentSlide}
					variant={variant}
					dotsSettings={dotsSettings}
				/>
			)}

			{loaded && instanceRef.current && (
				<>
					<SliderArrows
						prev
						arrowsSettings={arrowsSettings}
						onClick={() => instanceRef.current?.prev()}
						variant={variant}
						arrowIconPrev={arrowIconPrev}
						isVertical={defaultSliderSettings?.vertical}
					/>

					<SliderArrows
						next
						arrowsSettings={arrowsSettings}
						onClick={() => instanceRef.current?.next()}
						variant={variant}
						arrowIconNext={arrowIconNext}
						isVertical={defaultSliderSettings?.vertical}
					/>
				</>
			)}
		</div>
	)
}
