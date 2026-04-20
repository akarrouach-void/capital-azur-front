import { useRouter } from "next/router"
import { Fragment, useState, useEffect, useRef } from "react"
import Helmet from "react-helmet"

import { useNode, useI18n, useMenu, useHeader, useAccount } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Avatar, Icon, Link, Button, Text, SearchOverlay, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_header:variant3",
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const UserInfo = () => {
	const { t } = useI18n()
	const { signOut, loginUrl, profile, isAuthenticated } = useAccount()

	if (isAuthenticated) {
		return <UserMenu data={profile} signOut={signOut} />
	}

	return (
		<>
			<Link
				href={loginUrl}
				className="inline-block rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-black hover:border-gray-500 hover:bg-gray-500 hover:text-white tabDown:hidden"
			>
				{t("Nx:Sign in")}
			</Link>
			<Link href={loginUrl} className="tabUp:hidden" aria-label="login">
				<Icon
					id="user-circle"
					width="20px"
					height="20px"
					className="h-6 w-6 text-black"
				/>
			</Link>
		</>
	)
}

const Header = ({
	main_menu,
	top_menu,
	logo,
	switchLocation,
	showAccount,
	dfComponents,
	showOverlay,
	isSearchOverlayVisible,
}) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const mainMenu = useMenu(main_menu)
	const topMenu = useMenu(top_menu)

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
	const [mobileMenuLvl2, setMobileMenuLvl2] = useState(false)

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
					class: "pt-[137px] tabUp:pt-[39px]",
				}}
			/>
			<header
				className={vclsx(
					"left-0 z-[90] w-full tabDown:fixed tabDown:top-0 tabDown:bg-white",
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
				<div className="flex h-11 items-center justify-between bg-primary-500">
					<ul className="scrollbar-hide mx-4 flex h-full items-center space-x-2 overflow-x-scroll whitespace-nowrap tabUp:mx-8 tabUp:space-x-8">
						{topMenu.map((link, i) => {
							return (
								<li key={i} className="leading-normal">
									<Link
										key={link.id}
										id={link.options.attributes.id}
										href={link.url}
										className="text-xs font-light text-white hover:text-black tabUp:text-base"
									>
										{link.title}
									</Link>
								</li>
							)
						})}
					</ul>
					<div className="flex items-center">
						<div className="flex items-center self-center">
							{dfComponents.map((item, i) => {
								return (
									<Button {...item.link} key={i}>
										{item.icon ? <Icon id={item.icon} className="h-5 w-5" /> : ""}
										{item.link.title}
									</Button>
								)
							})}
						</div>
						<Button
							className="border-0 bg-transparent p-[7px] text-white"
							onClick={() => {
								showOverlay()
							}}
							aria-label={t("Nx:search")}
						>
							<Icon id="search" className="h-5 w-5" />
						</Button>
					</div>
				</div>
				<nav
					className={vclsx(
						"h-[98px] transition-all duration-500",
						headerState === "scroll_down_after_header" ||
							(headerState === "scroll_top" && "tabUp:bg-white"),
						headerState === "top" ? "tabDown:bg-transparent" : "tabDown:bg-white"
					)}
					aria-label="Top"
				>
					<div className="mx-auto max-w-7xl px-4 tabUp:px-12">
						<div className="flex w-full items-center justify-between py-6">
							<div className="flex items-center">
								<Icon
									id={showMobileList ? "x-solid" : "burger-menu"}
									className="mr-2 h-5 w-5 cursor-pointer text-black tabUp:hidden"
									onClick={() => {
										showMobileList ? setShowMobileList(false) : setShowMobileList(true)
										mobileMenuLvl2 && setMobileMenuLvl2(false)
									}}
								/>
								<Link href={`/${locale}`}>
									<Text as="span" className="sr-only">
										Factory
									</Text>
									{logo.src && (
										<Image
											className="h-10 w-auto"
											{...logo}
											alt={logo.alt}
											priority="high"
										/>
									)}
								</Link>
								{/* Desktop Menu Level 1 */}
								<ul className="ml-10 flex space-x-8 tabDown:hidden" ref={menuRef}>
									{mainMenu.map((link, i) => (
										<li className="relative" key={i}>
											{link.below ? (
												<Text
													as="span"
													key={link.id}
													id={link.options.attributes.id}
													className="flex cursor-pointer items-center text-base font-medium text-black hover:text-primary-500"
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
													className="text-base font-medium text-black hover:text-primary-500"
													onClick={() => setShowSubMenu(null)}
												>
													{link.title}
												</Link>
											)}
											{/* Desktop Menu Level 2 */}
											{link.below && hideSubmenuOnOutsideClick && (
												<ul
													className={vclsx(
														"absolute left-0 top-[64px] min-w-[150px] max-w-[300px] bg-white",
														showSubMenu == i ? "block" : "hidden"
													)}
												>
													{link.below.map((submenu, i) => {
														return (
															<li key={i}>
																<Link
																	key={submenu.id}
																	href={submenu.url}
																	id={submenu?.options?.attributes?.id}
																	className="block whitespace-nowrap px-4 py-3 text-base font-medium text-black hover:bg-gray-500 hover:text-white"
																	onClick={() => setShowSubMenu(null)}
																>
																	{submenu.title}
																</Link>
															</li>
														)
													})}
												</ul>
											)}
										</li>
									))}
								</ul>
							</div>
							<div className="ml-4 flex items-center space-x-4">
								{switchLocation == 1 && <SwitchLocale />}
								{showAccount == 1 && <UserInfo />}
							</div>
						</div>
						<div
							className={vclsx(
								"fixed top-[138px] flex h-full w-full flex-col items-start overflow-y-scroll bg-white p-5 transition-all duration-300 tabUp:hidden",
								showMobileList ? "left-0" : "-left-full"
							)}
						>
							{/* Mobile Menu Level 1 */}
							<ul className="w-full">
								{mainMenu.map((link, i) => (
									<li className="relative mb-5 last:mb-0" key={i}>
										{link.below ? (
											<Text
												as="span"
												key={link.id}
												id={`${link?.options?.attributes?.id}-mobile`}
												className="hover:text-gray-5000 relative mb-2 flex cursor-pointer items-center justify-between text-2xl font-medium text-black before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-['']"
												onClick={() => {
													setMobileMenuLvl2(true)
													setChosenMobileMenuLvl2(link.below && link.below)
												}}
											>
												{link.title}
												<Icon
													id="arrow-narrow-right"
													className="rtl-icon h-4 w-4 text-black"
												></Icon>
											</Text>
										) : (
											<Link
												key={link.id}
												id={`${link?.options?.attributes?.id}-mobile`}
												href={link.url}
												className="hover:text-gray-5000 relative mb-2 block text-2xl font-medium text-black before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-['']"
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
									"fixed top-[138px] flex h-full w-full flex-col items-start overflow-y-scroll bg-gray-50 p-5 transition-all duration-300 tabUp:hidden",
									mobileMenuLvl2 ? "left-0" : "-left-full"
								)}
							>
								<Text
									as="span"
									className="mb-8 flex w-full cursor-pointer pb-2 text-xl text-black"
									onClick={() => setMobileMenuLvl2(false)}
								>
									<Icon id="arrow-left-solid" className="rtl-icon mr-4 h-4 w-4"></Icon>
									{t("Nx:Retour")}
								</Text>
								{/* Mobile Menu Level 2 */}
								{
									<ul>
										{chosenMobileMenuLvl2 &&
											chosenMobileMenuLvl2.map((submenu, i) => {
												return (
													<li className="mb-3 last:mb-0" key={i}>
														<Link
															key={submenu.id}
															id={`${submenu?.options?.attributes?.id}-mobile`}
															href={submenu.url}
															className="hover:text-gray-5000 mb-2 block text-xl font-medium text-black"
															onClick={() => {
																setShowMobileList(false)
																setMobileMenuLvl2(false)
															}}
														>
															{submenu.title}
														</Link>
													</li>
												)
											})}
									</ul>
								}
							</div>
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
					className="inline-flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-black hover:bg-opacity-80  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 tabUp:px-4"
					data-testid="switch-locale-button"
				>
					{locale.toUpperCase()}
					<Icon
						id="chevron-down"
						className="-mr-1 ml-2 h-2 w-2 text-black hover:text-primary-100"
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
						{languages.map((language) => (
							<MenuItem key={language.code}>
								{({ active }) => {
									const url = path_18n[language.code] || "#."
									return (
										<a
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
						))}
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

const UserMenu = ({ data, signOut }) => {
	const router = useRouter()
	const { locale } = router

	const userNavigation = [
		{ name: "Settings", href: `/${locale}/user/profile` },
		{ name: "Sign out", href: "#.", onClick: signOut },
	]

	return (
		<Menu as="div" className="relative ml-4 inline-block flex-shrink-0">
			<div>
				<MenuButton className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
					<Text as="span" className="sr-only">
						Open user menu
					</Text>
					{data.user?.avatar ? (
						<Avatar src={data.user.avatar} size="normal" alt="Me" />
					) : (
						<Avatar variant="placeholder" size="normal" />
					)}
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
				<MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<MenuItem>
							<Text as="span" className="block px-4 py-2 text-sm font-bold text-gray-900">
								{data.user.full_name}
							</Text>
						</MenuItem>
					</div>
					<div className="py-1">
						{userNavigation.map((item) => (
							<MenuItem key={item.name}>
								{({ active }) => (
									<Link href={item?.href} passHref>
										<Link
											onClick={item?.onClick}
											className={vclsx(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block rounded-md px-4 py-2 text-sm"
											)}
										>
											{item.name}
										</Link>
									</Link>
								)}
							</MenuItem>
						))}
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	)
}

const HeaderContainer = ({ data }) => {
	const props = {
		main_menu: data?.extra_field?.use_menu_main,
		top_menu: data?.extra_field?.use_menu_top,
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		switchLocation: data?.extra_field?.show_language_dropdown,
		showAccount: data?.extra_field?.show_account,
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
