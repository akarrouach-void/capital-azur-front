import { useContext, useEffect } from "react"
import { useTour } from "@reactour/tour"
import { TourContext } from "@vactorynext/core/context"
import { useUpdateEffect, useNode } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_user_guide_tours:tour",
}

const TourContainer = ({ data }) => {
	const tourContext = useContext(TourContext)
	const { setIsOpen, setSteps } = useTour()
	const node = useNode()

	const state = tourContext?.state
	const initializeTourContext = tourContext?.initializeTourContext

	const tourOptions = {
		delay: data?.extra_field?.group_tours_options?.delay || 0,
		nextButton: data?.extra_field?.group_tours_options?.nextButtonText,
		prevButton: data?.extra_field?.group_tours_options?.prevButtonText,
		showDots: data?.extra_field?.group_tours_options?.showDots || false,
		showNTimes: parseInt(data?.extra_field?.group_tours_options?.showNTimes) || 0,
		isGlobal: data?.extra_field?.group_tours_options?.isGlobal || false,
		showPrevNextButtons:
			data?.extra_field?.group_tours_options?.showPrevNextButtons || true,
		showCloseButton: data?.extra_field?.group_tours_options?.showCloseButton || true,
		showBadge: data?.extra_field?.group_tours_options?.showBadge || true,
		disableKeyboardNavigation:
			data?.extra_field?.group_tours_options?.disableKeyboardNavigation || false,
	}
	const steps = data.components.map((item) => ({
		selector: item.selector,
		content: item.content,
	}))

	useEffect(() => {
		if (!tourContext || !state || !initializeTourContext) return
		if (!state.initialized) {
			initializeTourContext(tourOptions, node.nid)
			setSteps(steps)
		}
	}, [tourContext])

	useUpdateEffect(() => {
		if (!tourContext || !state) return
		if (shouldOpenTour(state, tourOptions)) {
			setTimeout(() => {
				setIsOpen(true)
			}, state.delay)
		}
	}, [tourContext, state])

	return null
}

function shouldOpenTour(state, tourOptions) {
	// Check if the tour should be shown globally
	if (tourOptions.isGlobal) {
		return (
			state.initialized &&
			(tourOptions.showNTimes === 0 ||
				state.storedNumberOpenings < tourOptions.showNTimes)
		)
	}
	return (
		state.initialized &&
		(tourOptions.showNTimes === 0 || state.storedNumberOpenings < tourOptions.showNTimes)
	)
}

export default TourContainer
