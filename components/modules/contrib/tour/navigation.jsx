import { Icon } from "@/ui"
import { useTour } from "@reactour/tour"
import { useContext } from "react"
import { TourContext } from "@vactorynext/core/context"

export const Navigation = () => {
	const { showPrevNextButtons, showDots } = useTour()
	const showPrevResult = Boolean(showPrevNextButtons)
	const showDotsResult = Boolean(showDots)

	if (!showPrevResult && !showDotsResult) return null

	return (
		<div className="mt-4 flex items-center justify-between">
			<Previous />
			<Dots />
			<Next />
		</div>
	)
}

export const Dots = () => {
	const { steps, showDots, currentStep, setCurrentStep } = useTour()
	const result = Boolean(showDots)
	if (!result) return null
	return (
		<div className="flex space-x-1 rtl:space-x-reverse">
			{steps.map((_, index) => {
				if (index !== currentStep) {
					return (
						<div
							onClick={() => {
								setCurrentStep(index)
							}}
							onKeyDown={(e) => {
								e.key === "Enter" && setCurrentStep(index)
							}}
							role="button"
							tabIndex={0}
							className="h-2 w-2 cursor-pointer rounded-full bg-gray-200"
							key={index}
						></div>
					)
				} else {
					return <div className="h-2 w-2 rounded-full bg-primary-500" key={index}></div>
				}
			})}
		</div>
	)
}

export const Next = () => {
	const { steps, showPrevNextButtons, currentStep, setCurrentStep } = useTour()
	const { state } = useContext(TourContext)
	const { nextButton } = state
	const stepsLength = steps.length
	const handleClick = () => {
		if (currentStep < stepsLength - 1) setCurrentStep(currentStep + 1)
	}

	const result = Boolean(showPrevNextButtons)
	if (!result) return null
	return (
		<button
			onClick={handleClick}
			disabled={currentStep === stepsLength - 1}
			className={currentStep === stepsLength - 1 && "cursor-not-allowed text-gray-400"}
		>
			{nextButton ? nextButton : <Icon id={"arrow-narrow-right"} className="h-5 w-5" />}
		</button>
	)
}

export const Previous = () => {
	const { showPrevNextButtons, currentStep, setCurrentStep } = useTour()
	const { state } = useContext(TourContext)
	const { prevButton } = state
	const handleClick = () => {
		if (currentStep > 0) setCurrentStep(currentStep - 1)
	}

	const result = Boolean(showPrevNextButtons)
	if (!result) return null
	return (
		<button
			onClick={handleClick}
			disabled={currentStep === 0}
			className={currentStep === 0 && "cursor-not-allowed text-gray-400"}
		>
			{prevButton ? prevButton : <Icon id={"arrow-narrow-left"} className="h-5 w-5" />}
		</button>
	)
}
