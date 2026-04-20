import { useRef, useEffect } from "react"
import { Icon, Link, Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { getColorVariant, hasActiveChildAtAnyLevel } from "../utils/navigationUtils"

const DesktopNavigation = ({
	navigation,
	isActiveLink,
	showSubMenu,
	setShowSubMenu,
	hideSubmenuOnOutsideClick,
}) => {
	const menuRef = useRef(null)
	const hoverTimeoutRef = useRef(null)

	const handleMouseEnter = (index) => {
		// Clear any existing timeout
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current)
		}
		setShowSubMenu(index)
	}

	const handleMouseLeave = () => {
		// Add a small delay before closing the dropdown
		hoverTimeoutRef.current = setTimeout(() => {
			setShowSubMenu(null)
		}, 300) // 300ms delay - more forgiving
	}

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current)
			}
		}
	}, [])

	return (
		<ul className="flex items-center gap-2 max-lg:hidden" ref={menuRef}>
			{navigation.map((link, i) => {
				const isActive = isActiveLink(link.url)
				const hasActiveChild = hasActiveChildAtAnyLevel(link, isActiveLink)
				const showAsActive = isActive || hasActiveChild

				return (
					<li
						className="relative"
						key={i}
						onMouseEnter={() => link.below && handleMouseEnter(i)}
						onMouseLeave={() => link.below && handleMouseLeave()}
					>
						{link.below ? (
							<Text
								as="span"
								key={link.id}
								id={link.options.attributes.id}
								className={vclsx(
									"animate flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-primary-600",
									showAsActive ? "font-semibold text-primary-600" : "text-gray-700"
								)}
							>
								{link.title}
								<Icon
									id="chevron-down"
									className={vclsx(
										"animate h-2.5 w-2.5",
										showSubMenu == i && "rotate-180"
									)}
								/>
							</Text>
						) : (
							<Link
								key={link.id}
								id={link.options.attributes.id}
								target={link.options.attributes.target}
								href={link.url}
								className={vclsx(
									"animate flex whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-primary-600",
									isActive ? "font-semibold text-primary-600" : "text-gray-700"
								)}
							>
								{link.title}
							</Link>
						)}
						{/* Desktop Menu Level 2 */}
						{link.below && hideSubmenuOnOutsideClick && (
							<div
								className={vclsx(
									"animate absolute left-0 top-[35px] z-[60] w-[36rem] -translate-x-1/2 pt-2 rtl:translate-x-1/2",
									showSubMenu == i ? "visible opacity-100" : "invisible opacity-0"
								)}
								onMouseEnter={() => handleMouseEnter(i)}
								onMouseLeave={handleMouseLeave}
							>
								<ul className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
									<div className="grid grid-cols-3 gap-6">
										{link.below.map((submenu, j) => {
											const isSubmenuActive = isActiveLink(submenu.url)
											const currentColor = getColorVariant(j)

											return (
												<li key={j}>
													{submenu.below ? (
														<>
															<Text
																id={submenu?.options?.attributes?.id}
																as="span"
																className="mb-4 flex items-center text-sm font-semibold text-gray-900"
															>
																<div
																	className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg ${currentColor.bg}`}
																>
																	<Icon
																		id={submenu?.options?.attributes?.class}
																		className={`h-4 w-4 ${currentColor.text}`}
																	/>
																</div>
																{submenu.title}
															</Text>
															<div className="space-y-1">
																{submenu.below.map((subsubmenu, k) => {
																	const isSubSubmenuActive = isActiveLink(subsubmenu.url)
																	return (
																		<Link
																			key={k}
																			href={subsubmenu.url}
																			id={subsubmenu.options.attributes.id}
																			target={subsubmenu.options.attributes.target}
																			className={vclsx(
																				"block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600",
																				isSubSubmenuActive
																					? "font-semibold text-primary-600"
																					: "text-gray-700"
																			)}
																		>
																			{subsubmenu.title}
																		</Link>
																	)
																})}
															</div>
														</>
													) : (
														<Link
															key={submenu.id}
															href={submenu.url}
															id={submenu.options.attributes.id}
															target={submenu.options.attributes.target}
															onClick={() => setShowSubMenu(null)}
															className={vclsx(
																"animate block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600",
																isSubmenuActive
																	? "font-semibold text-primary-600"
																	: "text-gray-700"
															)}
														>
															{submenu.title}
														</Link>
													)}
												</li>
											)
										})}
									</div>
								</ul>
							</div>
						)}
					</li>
				)
			})}
		</ul>
	)
}

export default DesktopNavigation
