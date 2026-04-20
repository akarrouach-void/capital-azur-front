import {
	// isHuawei,
	isSafari,
	isFirefox,
	isIOS,
	isAndroid,
	isEdge,
	isSamsungBrowser,
} from "react-device-detect"
import { Banner } from "./banner"
import { SplashScreen } from "./splash-screen"
import { useState, useEffect } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { dlPush } from "@vactorynext/core/lib"

export const ProcessInstallation = ({
	banner,
	safari,
	android,
	android_firefox,
	// huawei_firefox,
}) => {
	const [showSplashScreen, setShowSplashScreen] = useState()
	const [isStandaloneMode, setStandaloneMode] = useState(false)
	const [stateOnBoarding, setStateonBoarding] = useState(undefined)
	const [deferredPrompt, setDeferredPrompt] = useState(null)
	const [show, setShow] = useState(false)
	const { t } = useI18n()
	const router = useRouter()
	const { pwa } = router.query

	useEffect(() => {
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault() // Prevent the default browser installation prompt
			setDeferredPrompt(e) // Store the event for later use
		}

		// Listen for the "beforeinstallprompt" event
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
		if (localStorage) {
			const onBoardingStorage = localStorage.getItem("onbording")
			const pwaBannerStorage = localStorage.getItem("pwa-banner")
			if (
				onBoardingStorage != "finished" &&
				onBoardingStorage != "ignored" &&
				pwaBannerStorage !== "hide"
			) {
				setShow(true)
			}
			setStateonBoarding(onBoardingStorage)
		}
		if (window) {
			setStandaloneMode(
				pwa != undefined || window.matchMedia("(display-mode: standalone)").matches
			)
		}

		return () => {
			// Remove the event listener when the component unmounts
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
		}
	}, [])

	let splashScreenProps = { ...android }
	let positionArrow = "up-right"
	if (isIOS) {
		if (isSafari) {
			splashScreenProps = safari
			positionArrow = "down-center"
		}
	} else {
		// ! isHuawei  is not on the packge react-device-detect
		// if (isFirefox && !isHuawei) {
		// 	splashScreenProps = huawei_firefox
		// 	positionArrow = "down-right"
		// } else
		if (isFirefox) {
			splashScreenProps = android_firefox
			positionArrow = "down-right"
		}
	}

	const checkIosAndShowSplashScreen = () => {
		if (isIOS && !isSafari) {
			window.alert(
				t(
					"Utilisez le navigateur Safari pour pouvoir installer l'application mobile du portail casablanca-bourse.com"
				)
			)
			return
		} else if ((isAndroid && isEdge) || (isAndroid && isSamsungBrowser)) {
			window.alert(
				t(
					"Utilisez le navigateur Chrome ou Firefox pour pouvoir installer l'application mobile du portail casablanca-bourse.com"
				)
			)
			return
		} else {
			setShowSplashScreen(true)
		}
	}

	const handleShowSplashScreen = () => {
		dlPush("installer_application")
		if (!deferredPrompt) {
			checkIosAndShowSplashScreen()
		} else {
			deferredPrompt.prompt()
		}
	}
	const handleHideSplashScreen = () => {
		setShowSplashScreen(false)
	}

	const handleHideBanner = () => {
		localStorage.setItem("pwa-banner", "hide")
		setShow(false)
	}

	if (isStandaloneMode || stateOnBoarding == "finished" || !show) return null

	return (
		<div className="block md:hidden">
			<Banner
				{...banner}
				showSplashScreen={handleShowSplashScreen}
				handleHideBanner={handleHideBanner}
			/>

			{showSplashScreen && (
				<SplashScreen
					hideSplashScreen={handleHideSplashScreen}
					positionArrow={positionArrow}
					logo={banner?.logo}
					{...splashScreenProps}
				/>
			)}
		</div>
	)
}
