import { useRouter } from "next/router"
import { Fragment, useState, useEffect, useRef } from "react"
import Helmet from "react-helmet"

import { useNode, useMenu, useHeader, useI18n } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Icon, Link, Button, Text, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_header:variant4",
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const HeaderComponent = ({ data }) => {
	const props = {
		mainMenu: data?.extra_field?.use_menu,
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		ctaSocialLabel: data?.extra_field?.cta_social_label,
		slogon: data?.extra_field?.slogon,
		switchLocation: data?.extra_field?.show_language_dropdown,
		dfComponentsCta: data?.components.map((item) => ({
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
		dfComponentsCtaSocial: data?.components.map((item) => ({
			link: {
				title: item?.cta_social?.title,
				href: item?.cta_social?.url || null,
				id: item?.cta_social.attributes.id || "",
				className: item?.cta_social?.attributes?.class || "",
				rel: item?.cta_social.attributes?.rel || "",
				target: item?.cta_social.attributes?.target || "_self",
			},
			icon: item?.icon_social,
		})),
	}

	return <Header {...props} />
}

const Header = ({
	mainMenu,
	ctaSocialLabel,
	slogon,
	switchLocation,
	logo,
	dfComponentsCta,
	dfComponentsCtaSocial,
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

	// Associated with the use effect below, true if we clicked on the element, false if we clicked outside of it
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

	//Prevent body scrolling on mobile header open
	useEffect(() => {
		showMobileList
			? document.body.classList.add("overflow-y-hidden")
			: document.body.classList.remove("overflow-y-hidden")
	}, [showMobileList])

	// Show mobile menu lvl 2
	const [chosenMobileMenuLvl2, setChosenMobileMenuLvl2] = useState(null)

	// Show mobile menu lvl 3
	const [chosenMobileMenuLvl3, setChosenMobileMenuLvl3] = useState(null)

	return (
		<>
			<Helmet
				bodyAttributes={{
					class: "pt-[137px]",
				}}
			/>
			<header
				className={vclsx(
					"left-0 z-[90] w-full shadow tabDown:fixed tabDown:top-0",
					headerState === "top"
						? "absolute top-0"
						: headerState === "bypassing_header"
							? "absolute  -top-[137px]"
							: headerState === "scroll_down_after_header"
								? "transition-top  absolute -top-[137px] duration-1000"
								: headerState === "scroll_top"
									? "transition-top fixed top-0 duration-1000"
									: "absolute top-0"
				)}
			>
				<a
					className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
					href="#main-content"
				>
					{t("Nx:Skip to main content")}
				</a>
				<div className="flex h-[39px] items-center justify-end bg-gray-300 md:justify-between">
					<div className="ml-4 flex h-full items-center max-md:hidden">
						<Text as="span" className="whitespace-nowrap text-xs">
							{ctaSocialLabel}
						</Text>
						<ul
							className={vclsx(
								"scrollbar-hide mx-4 flex h-full items-center space-x-4 whitespace-nowrap"
							)}
						>
							{dfComponentsCtaSocial.map((item, i) => {
								// Check if cta's class has a class that starts with "icon"
								return (
									<li className="flex-1" key={i}>
										<Link {...item.link}>
											{item.icon ? (
												<Icon
													id={item.icon}
													width="20px"
													height="20px"
													className="mr-1 text-gray-600 hover:text-gray-900"
												/>
											) : (
												""
											)}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
					<div className="flex items-center">
						<div className="flex items-center self-center">
							{dfComponentsCta.map((item, i) => {
								return (
									item.link.title && (
										<Button key={i} {...item.link} className="border-0 bg-transparent">
											{item.icon ? (
												<Icon id={item.icon} width="20px" height="20px" />
											) : (
												""
											)}
											{item.link.title}
										</Button>
									)
								)
							})}
						</div>
						{switchLocation == 1 && <SwitchLocale />}
					</div>
				</div>
				<nav className="h-[98px] bg-white" aria-label="Top">
					<div className="mx-auto max-w-7xl px-4 tabUp:px-12">
						<div className="flex w-full items-center justify-between py-6">
							<div className="flex items-center">
								<Icon
									id={showMobileList ? "x-solid" : "burger-menu"}
									className="mr-2 h-5 w-5 cursor-pointer text-black tabUp:hidden"
									onClick={() =>
										showMobileList ? setShowMobileList(false) : setShowMobileList(true)
									}
								/>
								<Link href={`/${locale}`} className="flex items-center">
									<Text as="span" className="sr-only">
										Factory
									</Text>
									{logo.src && (
										<Image
											className={vclsx(slogon && "mr-4", "h-10 w-auto")}
											{...logo}
											alt={logo.alt}
											priority="high"
										/>
									)}
									{slogon && (
										<Text
											as="span"
											className="before:content[''] relative pl-4 before:absolute before:left-0 before:h-full before:border-l before:border-l-gray-600"
										>
											{slogon}
										</Text>
									)}
								</Link>

								{/* Desktop Menu Level 1 */}
								<ul className="ml-10 flex tabDown:hidden" ref={menuRef}>
									{navigation.map((link, i) => (
										<li
											className={vclsx(
												"relative px-7",
												i !== navigation.length - 1 &&
													"before:content[''] before:absolute before:right-0 before:h-full before:border-r before:border-r-gray-600"
											)}
											key={i}
										>
											{link.below ? (
												<Text
													as="span"
													key={link.id}
													id={link.options.attributes.id}
													className="flex cursor-pointer items-center text-base font-medium text-black hover:text-gray-500"
													onClick={() =>
														showSubMenu == i ? setShowSubMenu(null) : setShowSubMenu(i)
													}
												>
													{link.title}
													<Icon id="chevron-down" className="ml-1 h-2 w-2" />
												</Text>
											) : (
												<Link
													key={link.id}
													id={link.options.attributes.id}
													href={link.url}
													className="hover:text-gray-5000 text-base font-medium text-black"
													onClick={() => setShowSubMenu(null)}
												>
													{link.title}
												</Link>
											)}

											{/* Desktop Menu Level 2 */}
											{link.below && hideSubmenuOnOutsideClick && (
												<ul
													className={vclsx(
														"absolute left-0 top-[66px] min-w-[150px] max-w-[300px] bg-white",
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
																		id={submenuLvl2.options.attributes.id}
																		className="block whitespace-nowrap px-4 pb-1 pt-3 text-sm font-medium text-black"
																	>
																		{submenuLvl2.title}
																	</Text>
																) : submenuLvl2.below && submenuLvl2.url !== "" ? (
																	<Link
																		key={submenuLvl2.id}
																		id={submenuLvl2.options.attributes.id}
																		className="block cursor-pointer whitespace-nowrap px-4 pb-1 pt-3 text-sm font-medium text-black hover:text-primary-600 hover:underline"
																		onClick={() => setShowSubMenu(null)}
																	>
																		{submenuLvl2.title}
																	</Link>
																) : (
																	<Link
																		key={submenuLvl2.id}
																		id={submenuLvl2.options.attributes.id}
																		href={submenuLvl2.url}
																		className="block cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium text-black hover:text-primary-600 hover:underline"
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
																						id={submenuLvl3.options.attributes.id}
																						href={submenuLvl3.url}
																						className="before:content[''] relative block cursor-pointer whitespace-nowrap py-2 pl-10 pr-6 text-xs font-medium text-gray-500 before:absolute before:left-4 before:top-1/2 before:w-4 before:border-b before:border-b-black hover:text-primary-600 hover:underline"
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
							</div>
						</div>
						<div
							className={vclsx(
								"fixed top-[137px] flex h-full w-full flex-col items-start overflow-y-scroll bg-primary-900 py-5 transition-all duration-300 tabUp:hidden",
								showMobileList ? "left-0" : "-left-full"
							)}
						>
							{/* Mobile Menu Level 1 */}
							<ul className="h-full w-full">
								{navigation.map((link, i) => (
									<li className="relative mb-5 last:mb-0" key={i}>
										{link.below ? (
											<Text
												as="span"
												key={link.id}
												id={`${link?.options?.attributes?.id}-mobile`}
												className="mb-2 flex cursor-pointer items-center justify-between px-5 text-2xl font-medium text-white"
												onClick={() =>
													chosenMobileMenuLvl2 == i
														? setChosenMobileMenuLvl2(null)
														: setChosenMobileMenuLvl2(i)
												}
											>
												{link.title}
												<Icon
													id={
														chosenMobileMenuLvl2 === i ? "chevron-down" : "chevron-right"
													}
													className="h-3 w-3 text-white"
												></Icon>
											</Text>
										) : (
											<Link
												key={link.id}
												id={`${link?.options?.attributes?.id}-mobile`}
												href={link.url}
												className="mb-2 inline-block px-5 text-2xl font-medium text-white"
												onClick={() => setShowMobileList(false)}
											>
												{link.title}
											</Link>
										)}

										{/* Mobile Menu Level 2 */}
										{link.below && (
											<ul
												className={vclsx(
													"bg-primary-600 transition-all duration-500",
													chosenMobileMenuLvl2 === i
														? chosenMobileMenuLvl3 == link.below.length - 1
															? "opacity-1 visible max-h-screen pt-4"
															: "opacity-1 visible max-h-screen py-4"
														: "invisible max-h-0 opacity-0"
												)}
											>
												{link.below.map((submenuLvl2, i) => {
													return (
														<li className="mb-5 last:mb-0" key={i}>
															{submenuLvl2.below ? (
																<Text
																	as="span"
																	key={submenuLvl2.id}
																	id={`${submenuLvl2?.options?.attributes?.id}-mobile`}
																	className="flex cursor-pointer items-center justify-between pl-8 pr-5 text-lg font-medium text-white"
																	onClick={() =>
																		chosenMobileMenuLvl3 == i
																			? setChosenMobileMenuLvl3(null)
																			: setChosenMobileMenuLvl3(i)
																	}
																>
																	{submenuLvl2.title}
																	<Icon
																		id={
																			chosenMobileMenuLvl3 === i
																				? "chevron-down"
																				: "chevron-right"
																		}
																		className="h-3 w-3 text-white"
																	></Icon>
																</Text>
															) : (
																<Link
																	key={submenuLvl2.id}
																	id={`${submenuLvl2?.options?.attributes?.id}-mobile`}
																	href={submenuLvl2.url}
																	className="pl-8 pr-5 text-lg font-medium text-white"
																	onClick={() => setShowMobileList(false)}
																>
																	{submenuLvl2.title}
																</Link>
															)}
															{/* Mobile Menu Level 3 */}
															{submenuLvl2.below && (
																<ul
																	className={vclsx(
																		"bg-primary-200 transition-all duration-500",
																		chosenMobileMenuLvl3 === i
																			? "opacity-1 visible max-h-screen py-4"
																			: "invisible max-h-0 opacity-0"
																	)}
																>
																	{submenuLvl2.below.map((submenuLvl3, i) => {
																		return (
																			<li className="mb-5 last:mb-0" key={i}>
																				<Link
																					key={submenuLvl3.id}
																					id={`${submenuLvl3?.options?.attributes?.id}-mobile`}
																					href={submenuLvl3.url}
																					className="pl-12 pr-5 text-lg font-medium text-black"
																					onClick={() => setShowMobileList(false)}
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
					className="inline-flex w-full items-center justify-center rounded-md p-2 text-xs font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 tabUp:px-4 tabUp:text-sm"
					data-testid="switch-locale-button"
				>
					{locale.toUpperCase()}
					<Icon
						id="chevron-down"
						className="ml-1 h-2 w-2 text-gray-900"
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

export default HeaderComponent
