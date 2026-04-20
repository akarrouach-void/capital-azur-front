import { useCallback, useEffect, useRef, Fragment } from "react"
import { useI18n } from "@vactorynext/core//hooks"
import { Transition } from "@headlessui/react"
import { Icon } from "../icon/Icon"
import { layer } from "./theme"
import { vclsx } from "@vactorynext/core/utils"

export const Layer = ({
	shouldDisableScroll = false,
	variant = "default",
	overlay = true,
	overlayBackground,
	overlayOpacity,
	modal = false,
	position = "modal",
	children,
	onClose,
	onCloseCallback,
	isShow = false,
	overlayClasses,
	showCloseBtn = true,
	closeButton,
}) => {
	const { t } = useI18n()
	const modalRef = useRef()

	// close on ESC press
	const escFunction = useCallback((event) => {
		if (event.key === "Escape") {
			onClose()
		}
	}, [])

	const handleOutsideClick = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			onClose()
		}
	}

	const disableGlobaleScroll = () => {
		document.body.classList.add("overflow-hidden")
	}

	const enableGlobaleScroll = () => {
		document.body.classList.remove("overflow-hidden")
	}

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false)
		document.addEventListener("click", handleOutsideClick, true)
		return () => {
			shouldDisableScroll && isShow && enableGlobaleScroll()
			document.removeEventListener("click", handleOutsideClick, true)
			document.removeEventListener("keydown", escFunction, false)
		}
	}, [])

	useEffect(() => {
		shouldDisableScroll && isShow && disableGlobaleScroll()
		return () => {
			shouldDisableScroll && isShow && enableGlobaleScroll()
		}
	}, [isShow, shouldDisableScroll])

	const backgroundClass = overlayBackground || "bg-black",
		opacityClass = overlayOpacity || "bg-opacity-50",
		baseClasses = overlayClasses || "fixed top-0 left-0 w-full h-full z-[99999999]"

	return (
		<>
			{isShow && (
				<>
					{overlay && (
						<Transition
							as={Fragment}
							show={isShow}
							{...layer[variant]["overlay"].animation}
						>
							<div
								className={vclsx(
									overlay && baseClasses,
									overlay && backgroundClass,
									overlay && opacityClass
								)}
							></div>
						</Transition>
					)}
					<div
						ref={modalRef}
						className={vclsx(
							modal && overlay && layer[variant]["modal"].position,
							!modal && position && "fixed z-50",
							!modal && position && layer[variant][position].position
						)}
					>
						<Transition
							as={Fragment}
							show={isShow}
							afterLeave={() => {
								typeof onCloseCallback == "function" && onCloseCallback()
							}}
							{...layer[variant][position].animation}
						>
							<div
								className={vclsx(
									"relative max-h-[90vh] max-w-[90vw]",
									showCloseBtn && "pt-10"
								)}
							>
								{showCloseBtn &&
									(closeButton || (
										<button className={layer[variant].btnClose.style} onClick={onClose}>
											<span className="sr-only">{t("Nx:Close")}</span>
											<Icon
												id={layer[variant].btnClose.icon.id}
												width={layer[variant].btnClose.icon.width}
												height={layer[variant].btnClose.icon.height}
											/>
										</button>
									))}
								{children}
							</div>
						</Transition>
					</div>
				</>
			)}
		</>
	)
}
