import { useState, useEffect } from "react"
import { Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { backtotop } from "./theme"

/**
 * BackToTop Component
 *
 * A responsive back-to-top button that:
 * - Shows/hides based on scroll position
 * - Adapts to different screen sizes
 * - Prevents overlapping with footer by becoming sticky
 */
export const BackToTop = ({
	variant = "default",
	breakpoint = 1024, // Screen width threshold for mobile/desktop switching
	mobileBottomOffset = 70, // Distance from bottom of viewport on mobile
	desktopBottomOffset = 20, // Distance from bottom of viewport on desktop
	mobileButtonHeight = 52, // Button height for collision detection on mobile
	desktopButtonHeight = 52, // Button height for collision detection on desktop
	footerSpacing = 50, // Minimum gap between button and footer-region
}) => {
	// State to control button visibility based on scroll position
	const [showGoTopBtn, setShowGoTopBtn] = useState(false)

	// State to control positioning type: "fixed" (normal) or "absolute" (when near footer)
	const [buttonPosition, setButtonPosition] = useState("fixed")

	// State to control dynamic bottom offset for positioning
	const [bottomOffset, setBottomOffset] = useState(mobileBottomOffset) // default to mobile size for SSR

	// State to track if component has hydrated to prevent layout shift
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		/**
		 * Gets the appropriate bottom offset based on current viewport width
		 * @returns {number} Bottom offset in pixels
		 */
		const getResponsiveBottomOffset = () => {
			if (globalThis.window == undefined) return mobileBottomOffset
			return window.innerWidth >= breakpoint ? desktopBottomOffset : mobileBottomOffset
		}

		/**
		 * Gets the appropriate button height based on current viewport width
		 * Used for accurate collision detection with footer
		 * @returns {number} Button height in pixels
		 */
		const getResponsiveButtonHeight = () => {
			if (globalThis.window == undefined) return mobileButtonHeight
			return window.innerWidth >= breakpoint ? desktopButtonHeight : mobileButtonHeight
		}

		/**
		 * Main scroll handler that:
		 * 1. Shows/hides button based on scroll position
		 * 2. Calculates if button would overlap with footer
		 * 3. Switches between fixed and absolute positioning
		 */
		const handleScroll = () => {
			if (globalThis.window == undefined) return

			const scrollY = window.scrollY

			// Show button after scrolling 200px from top (only if hydrated)
			if (scrollY > 200 && isHydrated) {
				setShowGoTopBtn(true)
			} else {
				setShowGoTopBtn(false)
			}

			// Footer collision detection and positioning logic
			const footerElement = document.getElementById("footer-region")
			if (footerElement) {
				// Get footer position relative to document
				const footerRect = footerElement.getBoundingClientRect()
				const footerTop = footerRect.top + scrollY

				// Get current viewport and button dimensions
				const windowHeight = window.innerHeight
				const buttonHeight = getResponsiveButtonHeight()
				const defaultBottomOffset = getResponsiveBottomOffset()

				// Calculate where the button's bottom edge would be if positioned normally
				const buttonBottom = scrollY + windowHeight - defaultBottomOffset - buttonHeight

				// Check if button would overlap with footer (including desired spacing)
				if (buttonBottom >= footerTop - footerSpacing) {
					// Switch to absolute positioning to "stick" above footer
					setButtonPosition("absolute")

					// Calculate distance from document bottom to desired button position
					// This positions the button exactly 'footerSpacing' pixels above the footer
					const distanceFromDocumentBottom =
						document.body.scrollHeight - (footerTop - footerSpacing)
					setBottomOffset(distanceFromDocumentBottom)
				} else {
					// Return to normal fixed positioning
					setButtonPosition("fixed")
					setBottomOffset(defaultBottomOffset)
				}
			}
		}

		/**
		 * Handles window resize events
		 * Recalculates button position when viewport size changes
		 */
		const handleResize = () => {
			handleScroll() // Recalculate everything on resize
		}

		// Only add event listeners if running in browser (not during SSR)
		if (globalThis.window != undefined) {
			// Set correct initial positioning before showing button
			const initialBottomOffset = getResponsiveBottomOffset()
			setBottomOffset(initialBottomOffset)

			// Mark as hydrated after initial positioning is set
			setIsHydrated(true)

			window.addEventListener("scroll", handleScroll)
			window.addEventListener("resize", handleResize)
			// Calculate initial position
			handleScroll()
		}

		// Cleanup event listeners on component unmount
		return () => {
			if (globalThis.window != undefined) {
				window.removeEventListener("scroll", handleScroll)
				window.removeEventListener("resize", handleResize)
			}
		}
	}, [
		breakpoint,
		mobileBottomOffset,
		desktopBottomOffset,
		mobileButtonHeight,
		desktopButtonHeight,
		footerSpacing,
		isHydrated,
	])

	/**
	 * Smoothly scrolls to top of page when button is clicked
	 */
	const goToTop = () => {
		if (globalThis.window != undefined) {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			})
		}
	}

	return (
		<>
			{/* Only render button after hydration to prevent layout shift */}
			{isHydrated && (
				<button
					onClick={goToTop}
					className={vclsx(backtotop[variant].className, showGoTopBtn && "!flex")}
					style={{
						position: buttonPosition,
						bottom: `${bottomOffset}px`,
					}}
					aria-label="Go to top"
				>
					<Icon
						id={backtotop[variant].icon.id}
						className={backtotop[variant].icon.style}
					/>
				</button>
			)}
		</>
	)
}
