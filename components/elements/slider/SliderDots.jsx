import { vclsx } from "@vactorynext/core/utils"
import { sliderTheme } from "./theme"

export const SliderDots = ({
	instanceRef,
	currentSlide,
	className,
	variant,
	dotsSettings,
}) => {
	return (
		<div
			className={vclsx(
				sliderTheme[variant].dots.wrapper,
				dotsSettings.hideDotsMobile ? "max-sm:hidden" : "",
				dotsSettings.hideDotsTablet ? "onlyTablet:hidden" : "",
				dotsSettings.hideDotsDesktop ? "tabUp:hidden" : "",
				className
			)}
		>
			{[...Array(instanceRef?.current?.track?.details?.slides.length).keys()].map(
				(idx) => {
					return (
						<button
							key={idx}
							onClick={() => {
								instanceRef.current?.moveToIdx(idx)
							}}
							aria-label="Slider navigation"
							className={vclsx(
								sliderTheme[variant].dots.dot,
								currentSlide == idx
									? sliderTheme[variant].dots.dotActive
									: sliderTheme[variant].dots.dotNotActive
							)}
						/>
					)
				}
			)}
		</div>
	)
}
