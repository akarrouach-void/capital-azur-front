import { Text, Icon } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useEffect, useRef } from "react"

export const FilterWrapper = ({ showFilters, setshowFilters, children }) => {
	const { t } = useI18n()
	const filterPanelRef = useRef(null)
	const triggerButtonRef = useRef(null)
	const firstFocusableElementRef = useRef(null)

	const handleShowfilters = (e) => {
		e.preventDefault()
		setshowFilters(true)
	}

	const handleCloseFilters = (e) => {
		e.preventDefault()
		setshowFilters(false)
		// Return focus to the trigger button when closing
		triggerButtonRef.current?.focus()
	}

	// Handle escape key press
	useEffect(() => {
		const handleEscKey = (e) => {
			if (e.key === "Escape" && showFilters) {
				handleCloseFilters(e)
			}
		}

		if (showFilters) {
			document.addEventListener("keydown", handleEscKey)
			// Focus the first interactive element when opened
			firstFocusableElementRef.current?.focus()
		}

		return () => {
			document.removeEventListener("keydown", handleEscKey)
		}
	}, [showFilters])

	// Create a focus trap
	useEffect(() => {
		const handleTabKey = (e) => {
			if (!showFilters || !filterPanelRef.current) return

			const focusableElements = filterPanelRef.current.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)

			if (focusableElements.length === 0) return

			const firstElement = focusableElements[0]
			const lastElement = focusableElements[focusableElements.length - 1]

			// If shift+tab on first element, go to last element
			if (e.key === "Tab" && e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault()
				lastElement.focus()
			}

			// If tab on last element, go to first element
			else if (e.key === "Tab" && !e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault()
				firstElement.focus()
			}
		}

		if (showFilters) {
			document.addEventListener("keydown", handleTabKey)
		}

		return () => {
			document.removeEventListener("keydown", handleTabKey)
		}
	}, [showFilters])

	return (
		<div className="md:hidden">
			<button
				type="button"
				className="mb-7 flex w-full items-center justify-between gap-5 rounded-xl bg-white p-5 shadow-lg"
				onClick={(e) => handleShowfilters(e)}
				aria-label={t("Nx:Ouvrir les filtres")}
			>
				<Text className="">{t("Nx:Filtres et recherche")}</Text>
				<div ref={triggerButtonRef} className="hover:text-primary">
					<Icon id="control-panel" width={24} height={24} />
					<span className="sr-only">{t("Nx:Ouvrir les filtres")}</span>
				</div>
			</button>
			<div
				className={vclsx(
					"fixed left-0 top-0 z-[9990] h-full w-full bg-black/60",
					!showFilters && "hidden"
				)}
			/>
			<div
				ref={filterPanelRef}
				id="mobile-filter-panel"
				className={vclsx(
					"fixed bottom-0 left-0 z-[9999] w-full translate-y-full bg-white px-5 py-10 shadow transition-all duration-300 ease-in-out",
					showFilters && "translate-y-0"
				)}
				aria-labelledby="filter-heading"
				aria-hidden={!showFilters}
			>
				<button
					ref={firstFocusableElementRef}
					className="absolute right-5 top-5 text-black"
					onClick={(e) => handleCloseFilters(e)}
					aria-label={t("Nx:Fermer les filtres")}
				>
					<Icon id="x-solid" width={20} height={20} />
				</button>
				<Text id="filter-heading" className="mb-5">
					{t("Nx:Filtrer par")}
				</Text>
				{children}
			</div>
		</div>
	)
}
