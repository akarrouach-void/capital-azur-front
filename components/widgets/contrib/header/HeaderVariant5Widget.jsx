import { useRouter } from "next/router"
import { Fragment, useState, useEffect, useRef } from "react"
import Helmet from "react-helmet"

import { useNode, useI18n, useMenu, useHeader } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Icon, Link, Button, Text, SearchOverlay, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_header:variant5",
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const Header = ({
	mainMenu,
	switchLocation,
	logo,
	dfComponents,
	showOverlay,
	isSearchOverlayVisible,
}) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const navigation = useMenu(mainMenu)

	// if true, show mobile menu
	const [showMobileList, setShowMobileList] = useState(false)

	// Functionality to handle showing the sub menus
	const [showSubMenu, setShowSubMenu] = useState(null)

	// To hide/animate the header
	const { headerState } = useHeader(100)

	// Menu container red
	const menuRef = useRef(null)

	// CAssociated with the use effect below, true if we clicked on the element, false if we clicked outside of it
	const [hideSubmenuOnOutsideClick, setHideSubmenuOnOutsideClick] = useState(true)

	// To check if we clicked outside or inside the an element, Returns true if we cliked on the element or its children, else it returns false
	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setHideSubmenuOnOutsideClick(false)
			} else {
				setHideSubmenuOnOutsideClick(true)
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [menuRef])

	// Mobile level 2 menu showing and hiding state
	const [mobileMenuLvl2, setMobileMenuLvl2] = useState(null)

	// Chosen Mobile level 2 menu
	const [chosenMobileMenuLvl2, setChosenMobileMenuLvl2] = useState(null)

	//Prevent body scrolling on mobile header open & search overlay
	useEffect(() => {
		showMobileList || isSearchOverlayVisible
			? document.body.classList.add("overflow-y-hidden")
			: document.body.classList.remove("overflow-y-hidden")
	}, [showMobileList, isSearchOverlayVisible])

	return (
		<>
			<Helmet
				bodyAttributes={{
					class: "pt-[68px] tabUp:pt-[122px]",
				}}
			/>
			<header
				className={vclsx(
					"left-0 z-[90] w-full bg-white tabDown:fixed tabDown:top-0 tabDown:px-[17px] tabDown:py-[14px]",
					headerState === "top"
						? "absolute top-0"
						: headerState === "bypassing_header"
							? "absolute  -top-[138px] shadow"
							: headerState === "scroll_down_after_header"
								? "absolute  -top-[138px] shadow transition-all duration-1000"
								: headerState === "scroll_top"
									? "fixed top-0 shadow transition-all duration-1000"
									: "absolute top-0"
				)}
			>
				<a
					className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
					href="#main-content"
				>
					{t("Nx:Skip to main content")}
				</a>
				<div className="mx-auto flex h-[54px] max-w-[1215px] items-center justify-end px-4 tabDown:hidden">
					<Button
						className="border-0 bg-transparent !p-0 text-black"
						onClick={() => {
							showOverlay()
						}}
					>
						<Icon
							id="search"
							className={vclsx(
								"box-content h-5 w-5",
								switchLocation == 1 && "border-r border-r-gray-200 p-[14px]"
							)}
						/>
					</Button>
					{switchLocation == 1 && <SwitchLocale />}
				</div>
				<nav
					className={vclsx(
						"transition-all duration-500",
						headerState === "scroll_down_after_header" ||
							(headerState === "scroll_top" && "tabUp:bg-white"),
						headerState === "top" ? "tabDown:bg-transparent" : "tabDown:bg-white"
					)}
					aria-label="Top"
				>
					<div className="flex w-full items-center justify-between tabUp:mx-auto tabUp:max-w-[1215px] tabUp:px-4 tabUp:pb-7">
						<Link href={`/${locale}`}>
							<Text as="span" className="sr-only">
								Factory
							</Text>
							{logo.src && (
								<Image className="h-10 w-auto" {...logo} alt={logo.alt} priority="high" />
							)}
						</Link>
						<div className="flex items-center tabUp:hidden">
							<Button
								className="mr-3 border-0 bg-transparent !p-0 text-black"
								onClick={() => {
									showOverlay()
								}}
							>
								<Icon id="search" className="h-5 w-5" />
							</Button>
							{switchLocation == 1 && <SwitchLocale />}
							<Icon
								id={showMobileList ? "x-solid" : "burger-menu"}
								className="h-5 w-5 cursor-pointer text-black"
								onClick={() => {
									showMobileList ? setShowMobileList(false) : setShowMobileList(true)
									mobileMenuLvl2 && setMobileMenuLvl2(false)
								}}
							/>
						</div>
						{/* Desktop Menu Level 1 */}
						<ul
							className="ml-10 flex items-center space-x-10 tabDown:hidden"
							ref={menuRef}
						>
							{navigation.map((link, i) => (
								<li className="relative" key={i}>
									{link.below ? (
										<Text
											as="span"
											key={link.id}
											id={link?.options?.attributes?.id}
											className="inline-flex cursor-pointer items-center text-sm font-medium text-black hover:text-primary-500"
											onClick={() =>
												showSubMenu == i ? setShowSubMenu(null) : setShowSubMenu(i)
											}
										>
											{link.title}
											<Icon id="chevron-down" className="ml-3 h-2 w-2" />
										</Text>
									) : (
										<Link
											key={link.id}
											id={link?.options?.attributes?.id}
											href={link.url}
											className="text-sm font-medium text-black hover:text-primary-500"
											onClick={() => setShowSubMenu(null)}
										>
											{link.title}
										</Link>
									)}
									{/* Desktop Menu Level 2 */}
									{link.below && hideSubmenuOnOutsideClick && (
										<ul
											className={vclsx(
												"absolute left-0 top-[60px] min-w-[150px] max-w-[300px] bg-white",
												showSubMenu == i ? "block" : "hidden"
											)}
										>
											{link.below.map((submenuLvl2, i) => {
												return (
													<li key={i}>
														{submenuLvl2.below && submenuLvl2.url === "" ? (
															<Text
																as="span"
																key={submenuLvl2.id}
																id={submenuLvl2?.options?.attributes?.id}
																className="block px-4 pb-1 pt-3 text-sm font-medium text-black"
															>
																{submenuLvl2.title}
															</Text>
														) : (
															<Link
																key={submenuLvl2.id}
																id={submenuLvl2?.options?.attributes?.id}
																href={submenuLvl2.url}
																className="block cursor-pointer px-4 py-3 text-sm font-medium text-black hover:text-primary-500"
																onClick={() => setShowSubMenu(null)}
															>
																{submenuLvl2.title}
															</Link>
														)}
														{/* Desktop Menu Level 3 */}
														{submenuLvl2.below && hideSubmenuOnOutsideClick && (
															<ul>
																{submenuLvl2.below.map((submenuLvl3, i) => {
																	return (
																		<li key={i}>
																			<Link
																				key={submenuLvl3.id}
																				id={submenuLvl3?.options?.attributes?.id}
																				href={submenuLvl3.url}
																				className="before:content[''] relative block  cursor-pointer py-2 pl-10 pr-6 pr-6 text-xs font-medium text-black before:absolute before:left-4 before:top-1/2 before:w-4 before:border-b before:border-b-black hover:text-primary-500"
																				onClick={() => setShowSubMenu(null)}
																			>
																				{submenuLvl3.title}
																			</Link>
																		</li>
																	)
																})}
															</ul>
														)}
													</li>
												)
											})}
										</ul>
									)}
								</li>
							))}
						</ul>
						<div className="flex items-center space-x-2 tabDown:hidden">
							{dfComponents.map((item, i) => {
								return (
									item.link.href && (
										<Button {...item.link} key={i}>
											{item.icon ? <Icon id={item.icon} className="h-5 w-5" /> : ""}
											{item.link.title}
										</Button>
									)
								)
							})}
						</div>
					</div>
					<div
						className={vclsx(
							"fixed top-[68px] flex h-full w-full flex-col items-start overflow-y-scroll bg-white p-5 pt-10 transition-all duration-300 tabUp:hidden",
							showMobileList ? "left-0" : "-left-full"
						)}
					>
						{/* Mobile Menu Level 1 */}
						<ul className="w-full">
							{navigation.map((link, i) => (
								<li className="relative mb-5 last:mb-0" key={i}>
									{link.below ? (
										<Text
											as="span"
											key={link.id}
											id={`${link?.options?.attributes?.id}-mobile`}
											className="relative mb-2 flex cursor-pointer items-center justify-between text-lg font-medium text-black before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-['']"
											onClick={() => {
												setMobileMenuLvl2(true)
												setChosenMobileMenuLvl2(link.below)
											}}
										>
											{link.title}
											<Icon
												id="chevron-right-solid"
												className="rtl-icon h-4 w-4 text-black"
											></Icon>
										</Text>
									) : (
										<Link
											key={link.id}
											id={`${link?.options?.attributes?.id}-mobile`}
											href={link.url}
											className="relative mb-2 block text-lg font-medium text-black before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-['']"
											onClick={() => setShowMobileList(false)}
										>
											{link.title}
										</Link>
									)}
								</li>
							))}
						</ul>
						<div
							className={vclsx(
								"fixed top-[68px] flex h-full w-full flex-col items-start overflow-y-scroll bg-white p-5 pt-10 transition-all duration-300 tabUp:hidden",
								mobileMenuLvl2 ? "left-0" : "-left-full"
							)}
						>
							<Text
								as="span"
								className="mb-6 flex w-full cursor-pointer items-center text-xl font-medium text-black"
								onClick={() => setMobileMenuLvl2(false)}
							>
								<Icon id="chevron-left-solid" className="rtl-icon mr-2 h-4 w-4"></Icon>
								{t("Nx:Retour")}
							</Text>
							{/* Mobile Menu Level 2 */}
							{
								<ul>
									{chosenMobileMenuLvl2 &&
										chosenMobileMenuLvl2.map((submenuLvl2, i) => {
											return (
												<li className="mb-4 last:mb-0" key={i}>
													{submenuLvl2.below ? (
														<Text
															as="span"
															key={submenuLvl2.id}
															id={`${submenuLvl2?.options?.attributes?.id}-mobile`}
															className="block text-lg font-medium text-black"
														>
															{submenuLvl2.title}
														</Text>
													) : (
														<Link
															key={submenuLvl2.id}
															id={`${submenuLvl2?.options?.attributes?.id}-mobile`}
															href={submenuLvl2.url}
															className="block text-lg font-medium text-black"
															onClick={() => {
																setShowMobileList(false)
																setMobileMenuLvl2(false)
															}}
														>
															{submenuLvl2.title}
														</Link>
													)}
													{/* Mobile Menu Level 3 */}
													{submenuLvl2.below && (
														<ul>
															{submenuLvl2.below.map((submenuLvl3, i) => {
																return (
																	<li key={i}>
																		<Link
																			key={submenuLvl3.id}
																			href={submenuLvl3.url}
																			id={`${submenuLvl3?.options?.attributes?.id}-mobile`}
																			className="before:content[''] relative block  cursor-pointer py-2 pl-6 text-sm font-medium text-black before:absolute before:left-0 before:top-1/2 before:w-4 before:border-b before:border-b-black hover:text-primary-500"
																			onClick={() => {
																				setShowMobileList(false)
																				setMobileMenuLvl2(false)
																			}}
																		>
																			{submenuLvl3.title}
																		</Link>
																	</li>
																)
															})}
														</ul>
													)}
												</li>
											)
										})}
								</ul>
							}
						</div>
					</div>
				</nav>
			</header>
		</>
	)
}

const SwitchLocale = () => {
	const router = useRouter()
	const locale = router.locale
	const { path_18n } = useNode()
	const menuButtonRef = useRef(null)
	// trigger data layer event when switching language
	const handleLangSwitch = (language) => {
		dlPush("Sélection langue", {
			Langue: language.code,
		})
		menuButtonRef?.current?.click()
	}

	// Filter out the current locale from the languages
	const availableLanguages = languages.filter(
		(language) => path_18n[language.code] && language.code !== locale
	)
	// Don't show the locale switcher if no other languages are available
	if (availableLanguages.length === 0) return null

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<MenuButton
					className="inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 tabUp:px-4"
					data-testid="switch-locale-button"
				>
					{locale.toUpperCase()}
					<Icon
						id="chevron-down"
						className="-mr-1 ml-2 h-3 w-3 text-black"
						aria-hidden="true"
					/>
				</MenuButton>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute right-0 z-10 mt-2 w-20 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						{availableLanguages.map((language) => {
							const url = path_18n[language.code]
							if (!url) return null
							return (
								<MenuItem key={language.code} as="div">
									{({ active }) => {
										return (
											<a
												onClick={() => {
													handleLangSwitch(language)
												}}
												locale={false}
												href={url}
												className={`${
													active ? "bg-primary-500 text-white" : "text-gray-900"
												} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
												data-testid={`switch-locale-item-${language.code}`}
											>
												{language.label}
											</a>
										)
									}}
								</MenuItem>
							)
						})}
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	)
}

const HeaderContainer = ({ data }) => {
	const props = {
		mainMenu: data?.extra_field?.use_menu,
		switchLocation: data?.extra_field?.show_language_dropdown,
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		dfComponents: data?.components.map((item) => ({
			link: {
				title: item?.cta?.title,
				href: item?.cta?.url || null,
				id: item?.cta.attributes.id || "",
				className: item?.cta?.attributes?.class || "",
				rel: item?.cta.attributes?.rel || "",
				target: item?.cta.attributes?.target || "_self",
			},
			icon: item?.icon,
		})),
	}

	const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false)
	const handleShowOverlay = () => {
		setIsSearchOverlayVisible(true)
	}

	useEffect(() => {
		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape") {
				setIsSearchOverlayVisible(false)
			}
		})
	}, [isSearchOverlayVisible])

	return (
		<>
			<Header
				{...props}
				showOverlay={handleShowOverlay}
				isSearchOverlayVisible={isSearchOverlayVisible}
			/>
			<SearchOverlay
				show={isSearchOverlayVisible}
				onClose={() => {
					setIsSearchOverlayVisible(false)
				}}
			></SearchOverlay>
		</>
	)
}

export default HeaderContainer
