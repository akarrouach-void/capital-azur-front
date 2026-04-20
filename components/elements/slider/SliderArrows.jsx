import React, { forwardRef } from "react"
import { Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { sliderTheme } from "./theme"

const IconPrev = ({ isVertical }) => (
	<Icon
		id={isVertical ? "chevron-up" : "chevron-left"}
		width={isVertical ? "14" : "16"}
		height={isVertical ? "14" : "16"}
	/>
)

const IconNext = ({ isVertical }) => (
	<Icon
		id={isVertical ? "chevron-down" : "chevron-right"}
		width={isVertical ? "14" : "16"}
		height={isVertical ? "14" : "16"}
	/>
)

export const SliderArrows = forwardRef(
	(
		{
			arrowsSettings,
			onClick,
			className = "",
			variant,
			prev,
			next,
			isVertical = false,
			arrowIconNext = <IconNext isVertical={isVertical} />,
			arrowIconPrev = <IconPrev isVertical={isVertical} />,
			...props
		},
		ref
	) => {
		return (
			<button
				onClick={onClick}
				ref={ref}
				className={vclsx(
					className,
					"rtl-icon",
					sliderTheme[variant].arrows.button,
					prev && sliderTheme[variant].arrows.prev,
					next && sliderTheme[variant].arrows.next,
					arrowsSettings.hideArrowMobile ? "max-sm:hidden" : null,
					arrowsSettings.hideArrowTablet ? "onlyTablet:hidden" : null,
					arrowsSettings.hideArrowDesktop ? "tabUp:hidden" : null
				)}
				aria-label="navigation arrow"
				{...props}
			>
				{prev && arrowIconPrev}
				{next && arrowIconNext}
			</button>
		)
	}
)
