import { useState, useEffect } from "react"
import { AutocompleteSearchOverlay } from "@/ui"
import Header from "./components/Header"

export const config = {
	id: "vactory_header:variant2",
}

const HeaderContainer = ({ data }) => {
	const props = {
		mainMenu: data?.extra_field?.use_menu,
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width || 146,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height || 50,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		showSearch: data?.extra_field?.show_search,
		switchLocation: data?.extra_field?.show_switch_language,
		showColorScheme: data?.extra_field?.show_color_scheme,
		cta: data?.components
			?.filter((item) => item?.cta?.url)
			.map((item) => ({
				link: {
					title: item?.cta?.title,
					href: item?.cta?.url || null,
					id: item?.cta?.attributes.id || "",
					className: item?.cta?.attributes?.class || "",
					target: item?.cta?.attributes?.target || "_self",
				},
				icon: item?.icon,
			})),
	}

	const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false)

	const handleShowOverlay = () => {
		setIsSearchOverlayVisible(true)
	}

	const handleCloseOverlay = () => {
		setIsSearchOverlayVisible(false)
	}

	// Handle escape key to close search overlay
	useEffect(() => {
		const handleKeyUp = (e) => {
			if (e.key === "Escape") {
				handleCloseOverlay()
			}
		}

		// Only add event listeners on client side
		if (typeof window !== "undefined") {
			document.addEventListener("keyup", handleKeyUp)
			return () => {
				document.removeEventListener("keyup", handleKeyUp)
			}
		}
	}, [])

	return (
		<>
			<Header
				{...props}
				showOverlay={handleShowOverlay}
				isSearchOverlayVisible={isSearchOverlayVisible}
			/>
			<AutocompleteSearchOverlay
				show={isSearchOverlayVisible}
				onClose={handleCloseOverlay}
			/>
		</>
	)
}

export default HeaderContainer
