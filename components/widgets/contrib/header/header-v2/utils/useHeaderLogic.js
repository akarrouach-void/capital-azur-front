import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useMenu, useHeader } from "@vactorynext/core/hooks"
import { createIsActiveLink } from "../utils/navigationUtils"

export const useHeaderLogic = (mainMenu) => {
	const router = useRouter()
	const locale = router.locale
	const currentPath = router.asPath
	const navigation = useMenu(mainMenu)

	// Create the isActiveLink function
	const isActiveLink = createIsActiveLink(currentPath, locale)

	// State management
	const [showMobileList, setShowMobileList] = useState(false)
	const [showSubMenu, setShowSubMenu] = useState(null)
	const [hideSubmenuOnOutsideClick, setHideSubmenuOnOutsideClick] = useState(true)

	// Header animation state
	const { headerState } = useHeader(100)

	// Menu container ref
	const menuRef = useRef(null)

	// Handle outside click to hide submenu
	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setHideSubmenuOnOutsideClick(false)
			} else {
				setHideSubmenuOnOutsideClick(true)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [menuRef])

	// Prevent body scrolling when mobile menu is open
	useEffect(() => {
		const shouldPreventScroll = showMobileList
		if (shouldPreventScroll) {
			document.body.classList.add("overflow-y-hidden")
		} else {
			document.body.classList.remove("overflow-y-hidden")
		}

		return () => {
			document.body.classList.remove("overflow-y-hidden")
		}
	}, [showMobileList])

	return {
		navigation,
		isActiveLink,
		showMobileList,
		setShowMobileList,
		showSubMenu,
		setShowSubMenu,
		hideSubmenuOnOutsideClick,
		headerState,
		menuRef,
	}
}
