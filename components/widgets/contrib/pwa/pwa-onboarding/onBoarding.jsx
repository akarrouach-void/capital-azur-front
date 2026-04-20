import { useEffect, useState } from "react"
import { Step } from "./step"
import { vclsx } from "@vactorynext/core/utils"
import { Button } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"

export const OnBoarding = ({ steps }) => {
	const { t } = useI18n()
	const [step, setStep] = useState(0)
	const [show, setShow] = useState(false)
	const [isStandaloneMode, setStandaloneMode] = useState(false)
	const [stateOnBoarding, setStateonBoarding] = useState(undefined)
	const router = useRouter()
	const { pwa } = router.query

	useEffect(() => {
		if (localStorage) {
			const onBoardingStorage = localStorage.getItem("onbording")
			if (onBoardingStorage != "ignored" && onBoardingStorage != "finished") {
				setShow(true)
			}
			setStateonBoarding(onBoardingStorage)
		}
		if (window) {
			setStandaloneMode(
				pwa != undefined || window.matchMedia("(display-mode: standalone)").matches
			)
		}
	}, [])

	const handleMoveToNextStep = () => {
		if (step == steps.length - 1) {
			localStorage.setItem("onbording", "finished")
			setShow(false)
		}
		setStep((old) => old + 1)
	}

	const handleHideOnBoarding = () => {
		setShow(false)
		localStorage.setItem("onbording", "ignored")
	}

	if (
		!isStandaloneMode ||
		stateOnBoarding == "ignored" ||
		stateOnBoarding == "finished" ||
		!show
	)
		return null

	return (
		<div className="fixed left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-white px-12 py-10 text-center">
			{step < steps.length - 1 && (
				<button
					className="absolute right-4 top-10 z-20 cursor-pointer p-2 text-sm font-normal leading-5 text-black"
					onClick={handleHideOnBoarding}
				>
					{t("Nx:ignore onboarding")}
				</button>
			)}
			<div>
				{steps?.map((item, index) => {
					return (
						<Step
							key={index}
							step={index}
							active={step}
							moveToNext={handleMoveToNextStep}
							onIgnore={handleHideOnBoarding}
							className={vclsx(
								"transition-all duration-300 ease-in-out",
								index <= step - 1 &&
									"scale-140 -translate-x-full -rotate-[30deg] transform opacity-0",
								step == index && "z-10 translate-x-0 rotate-0 scale-100 opacity-100",
								index >= step + 1 &&
									"scale-140 translate-x-full rotate-[30deg] transform opacity-0"
								//colors[index],
							)}
							{...item}
						>
							<OnBoardingPagination steps={steps} active={step} />
							<Button className="relative z-20" onClick={handleMoveToNextStep}>
								{step < steps.length - 1
									? t("Nx:Suivant onboarding")
									: t("Nx:Démarer onboarding")}
							</Button>
						</Step>
					)
				})}
			</div>
		</div>
	)
}

const OnBoardingPagination = ({ steps, active = 0 }) => {
	return (
		<div>
			<ul className="flex items-center justify-center gap-2 py-8">
				{steps.map((item, index) => (
					<li
						key={index}
						className={vclsx(
							"inline-flex h-[10px] w-[10px] rounded-full bg-[#E3E3E3] transition-all duration-200 ease-in-out",
							active == index && "w-[19px] bg-primary-500"
						)}
					></li>
				))}
			</ul>
		</div>
	)
}
