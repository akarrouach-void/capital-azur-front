import { useAccount, useI18n } from "@vactorynext/core/hooks"
import { useState, useEffect } from "react"
import { Button, Icon } from "@/ui"
import { Screen } from "./screen"
import { drupal } from "@vactorynext/core/drupal"
import { toast } from "react-toastify"

import {
	saveStepsToLocalStorage,
	getStepsFromLocalStorage,
	getOnBoardingStatusLocaleStorage,
	saveOnBoardingStatusLocalStorage,
} from "./local-storage-utils"
import { OnBoardingContent } from "./on-boarding-content"
import { ModaleCloseVideoAsk } from "./modale-close-video-ask"
import { useRouter } from "next/router"

/**
 * @note:
 * onboarded meading
 * 	1: is started
 * 	0: is not started yet
 * 	"end": video ask ended
 */

export const VideoAsk = ({
	items,
	show_btn,
	started,
	not_started,
	//title,
	//icon,
	content_first_screen,
	show_content,
}) => {
	const { t } = useI18n()
	const [screen, setScreen] = useState(items[0]?.id)
	const [steps, setSteps] = useState(getStepsFromLocalStorage())
	const [onBoardingStatus, setOnBoardingStatus] = useState()
	const [showModaleClose, setShowModalClose] = useState(false)
	const router = useRouter()
	const { profile, isAuthenticated } = useAccount()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (isAuthenticated && profile?.user?.videoask != null) {
			setSteps(profile?.user?.videoask)
			setOnBoardingStatus("end")
			saveStepsToLocalStorage(profile?.user?.videoask)
			saveOnBoardingStatusLocalStorage("end")
		} else if (
			isAuthenticated &&
			profile?.user?.videoask == undefined &&
			getOnBoardingStatusLocaleStorage() == "end" &&
			typeof getStepsFromLocalStorage() == "object"
		) {
			setSteps(getStepsFromLocalStorage())
			setOnBoardingStatus("end")
			if (isLoading) {
				handlePostApi()
			}
		} else {
			setOnBoardingStatus(getOnBoardingStatusLocaleStorage())
			const storedSteps = getStepsFromLocalStorage()
			setSteps(storedSteps)
			let lastKey = null
			if (storedSteps) {
				lastKey = Object.keys(storedSteps).pop()
			}
			if (lastKey && lastKey !== undefined) {
				setScreen(lastKey)
			}
		}
	}, [])

	const addStep = (step, s) => {
		let newSteps

		if (s) {
			newSteps = { ...steps, ...step, [s]: null }
		} else {
			newSteps = { ...steps, ...step }
		}
		setSteps(newSteps)
		saveStepsToLocalStorage(newSteps)
	}

	const handleChangeScreen = (s, step) => {
		if (s.includes("url:")) {
			addStep(step)
			saveOnBoardingStatusLocalStorage("end")
			setOnBoardingStatus("end")
			router.push(s.split("url:")[1])
			if (isAuthenticated) {
				handlePostApi()
			}
		} else {
			addStep(step, s)
			setScreen(s)
			saveOnBoardingStatusLocalStorage(1)
		}
	}

	const handleBackScreen = () => {
		let lastKey = Object.keys(steps).pop()
		let myobject = steps
		delete myobject[lastKey]
		lastKey = Object.keys(steps).pop()
		if (lastKey && lastKey !== undefined) {
			setScreen(lastKey)
		}
		setSteps(myobject)
		saveStepsToLocalStorage(myobject)
	}

	const handleCloseOnBoarding = () => {
		setOnBoardingStatus(0)
		saveOnBoardingStatusLocalStorage(0)
		if (showModaleClose) setShowModalClose(false)
	}

	const handleShowOnBoarding = () => {
		setOnBoardingStatus(null)
	}

	const handlePostApi = async () => {
		const toastId = toast.loading("Nx:Loading...")
		setIsLoading(true)
		try {
			const response = await drupal.fetch(`videoask/post`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				withAuth: true,
				body: JSON.stringify(steps),
			})
			if (response.ok) {
				toast.dismiss(toastId)
				toast.success(t("Nx:Video ask questionnaire was succefuly submited"))
			}
		} catch (err) {
			toast.dismiss(toastId)
			setIsLoading(false)
			console.error("error posting", err)
			toast.error(t("Nx:Video ask submit failed"))
		} finally {
			toast.dismiss(toastId)
			setIsLoading(false)
		}
	}

	const activeScreen = items.filter((item) => item?.id === screen)

	let dataContent = null
	if (onBoardingStatus == 1) {
		dataContent = { ...started }
	} else if (onBoardingStatus == 0) {
		dataContent = { ...not_started }
	}

	return (
		<>
			{showModaleClose && (
				<ModaleCloseVideoAsk
					onClose={() => setShowModalClose(false)}
					handleCancel={() => setShowModalClose(false)}
					hancleclose={() => handleCloseOnBoarding()}
				/>
			)}
			{onBoardingStatus === null && (
				<div className="fixed left-0 top-0 z-[9999999] h-full min-h-[400px] w-full bg-black/80">
					{items[0]?.id !== screen && (
						<Button onClick={handleBackScreen} className="absolute left-5 top-5 z-10">
							<Icon id="arrow-narrow-left-solid" width="24" height="24" />
							{t("Nx:Retour")}
						</Button>
					)}
					{items[0]?.id === screen && (
						<Button
							variant="secondary"
							id="video_ask_skip_intro"
							className="absolute right-5 top-5 z-10"
							onClick={() => setShowModalClose(true)}
						>
							{t("Nx:Passer l'introduction")}
						</Button>
					)}
					{activeScreen.map((item, index) => {
						return (
							<Screen
								{...item}
								key={index}
								id={item?.id}
								active={screen}
								setScreen={handleChangeScreen}
								steps={steps}
								content_first_screen={content_first_screen}
							/>
						)
					})}
				</div>
			)}
			{!!show_btn && (onBoardingStatus == 1 || onBoardingStatus == 0) && (
				<Button
					className="fixed left-0 top-1/2 -translate-x-[80%] -translate-y-[50%] transition-all duration-300 ease-in-out hover:translate-x-0"
					onClick={handleShowOnBoarding}
				>
					{t("Nx:Continuer on Boarding")}
					<Icon id="question-mark-circle-solid" width="24" height="24" />
				</Button>
			)}
			{show_content && dataContent && (
				<OnBoardingContent showOnBoarding={handleShowOnBoarding} {...dataContent} />
			)}
		</>
	)
}
