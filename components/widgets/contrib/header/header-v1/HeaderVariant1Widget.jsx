import { getEnabledLanguages, dlPush } from "@vactorynext/core/lib"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { Fragment, useState, useEffect, useRef } from "react"

import { useNode, useI18n, useMenu, useHeader, useAccount } from "@vactorynext/core/hooks"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Avatar, Icon, Link, Button, Text, Container, Image, SearchOverlayV2 } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { useFlag } from "@vactory/console/client"

/* import { HeaderMenu } from "../HeaderFullMenuLayout" */

export const config = {
	id: "vactory_header:default",
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const UserInfo = () => {
	const { t } = useI18n()
	const { signOut, loginUrl, accountUrl, profile, isAuthenticated } = useAccount()

	if (isAuthenticated) {
		return <UserMenu data={profile} accountUrl={accountUrl} signOut={signOut} />
	}

	return (
		<>
			<Link
				href={loginUrl}
				className="inline-block rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50"
			>
				{t("Nx:Sign in")}
			</Link>
		</>
	)
}

const Header = ({
	mainMenu,
	logo,
	showAccount,
	dfComponents,
	showOverlay,
	isSearchOverlayVisible,
	isFixed = true,
	staticNavigation = null,
	switchLocation,
}) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const navigationItems = useMenu(mainMenu)

	const navigation = staticNavigation || navigationItems
	const isSwitchLangFlagEnabled = useFlag("switchLang")

	const isSwitchLangEnabled = switchLocation || isSwitchLangFlagEnabled

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

	//Prevent body scrolling on mobile header open & search overlay
	useEffect(() => {
		showMobileList || isSearchOverlayVisible
			? document.body.classList.add("overflow-y-hidden")
			: document.body.classList.remove("overflow-y-hidden")
	}, [showMobileList, isSearchOverlayVisible])

	return (
		<header
			className={vclsx(
				`left-0 z-[90] h-[90px] w-full bg-primary-600 ${
					isFixed ? "tabDown:fixed" : ""
				} tabDown:top-0`,
				isFixed
					? headerState === "top"
						? "absolute top-0"
						: headerState === "bypassing_header"
							? "absolute  -top-[125px]"
							: headerState === "scroll_down_after_header"
								? "transition-top  absolute -top-[125px] duration-1000"
								: headerState === "scroll_top"
									? "transition-top fixed top-0 shadow-md duration-1000"
									: "absolute top-0"
					: ""
			)}
		>
			<a
				className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
				href="#main-content"
			>
				{t("Nx:Skip to main content")}
			</a>
			<Container>
				<nav aria-label="Top">
					<div className="flex w-full items-center justify-between py-6">
						<div className="flex items-center">
							<Link
								href={`/${locale}`}
								className="flex-shrink-0"
								aria-label={t("Nx:Homepage")}
							>
								<Text as="span" className="sr-only">
									Homepage
								</Text>
								{logo.src && (
									<Image
										className="h-10 w-auto"
										{...logo}
										alt={logo.alt}
										priority="high"
										disablePlaceholder={true}
									/>
								)}
							</Link>
						</div>
						{/* Desktop Menu Level 1 */}
						<ul
							className="mx-8 flex items-center justify-between space-x-10 tabDown:hidden"
							ref={menuRef}
						>
							{navigation?.map((link, i) => (
								<li className="relative" key={i}>
									{link.below ? (
										<Text
											as="span"
											key={link.id}
											className="flex cursor-pointer items-center text-base font-medium text-white hover:text-primary-50"
											id={link.options.attributes.id}
											width="20"
											height="20"
											onClick={() =>
												showSubMenu == i ? setShowSubMenu(null) : setShowSubMenu(i)
											}
										>
											{link.title}
											<Icon id="chevron-down" className="ml-1 h-2 w-2" />
										</Text>
									) : (
										<Link
											key={link?.id}
											href={link.url}
											className="text-base font-medium text-white hover:text-primary-50"
											id={link.options.attributes?.id}
											onClick={() => setShowSubMenu(null)}
											aria-label={`${t("Nx:Menu de navigation")} : ${link?.title}`}
										>
											{link.title}
										</Link>
									)}

									{/* Desktop Menu Level 2 */}
									{link.below && hideSubmenuOnOutsideClick && (
										<ul
											className={vclsx(
												"absolute left-0 top-[56px] min-w-[150px] max-w-[300px] bg-primary-600",
												showSubMenu == i ? "block" : "hidden"
											)}
										>
											{link.below?.map((submenu, i) => {
												return (
													<li key={i}>
														<Link
															key={submenu.id}
															id={submenu.options.attributes.id}
															href={submenu.url || "#"}
															className="block whitespace-nowrap px-4 py-3 text-base font-medium text-white hover:bg-primary-500"
															onClick={() => setShowSubMenu(null)}
															aria-label={`${t("Nx:Menu de navigation")} : ${
																submenu?.title
															}`}
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
						<div className="flex items-center gap-x-4">
							<div className="flex items-center space-x-4 tabDown:hidden">
								{dfComponents?.map((item, i) => {
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
							<Button
								className="border-0 bg-transparent p-[7px] text-white"
								onClick={() => {
									showOverlay()
								}}
								aria-label={t("Nx:search")}
							>
								<Icon id="search" className="h-5 w-5" />
							</Button>
							{isSwitchLangEnabled && <SwitchLocale />}
							{showAccount == 1 && (
								<div className="tabDown:hidden">
									<UserInfo />
								</div>
							)}
							<Icon
								id={showMobileList ? "x-solid" : "burger-menu"}
								width="20px"
								height="20px"
								className="mr-2 h-6 w-6 cursor-pointer text-white tabUp:hidden"
								onClick={() =>
									showMobileList ? setShowMobileList(false) : setShowMobileList(true)
								}
							/>
							{/* <HeaderMenu mainMenu={mainMenu} logo={logo} className="tabDown:hidden" /> */}
						</div>
					</div>
					<div
						className={vclsx(
							"fixed bottom-0 top-[89px] flex w-full flex-col items-start overflow-y-scroll bg-primary-600 p-5 transition-all duration-300 tabUp:hidden",
							showMobileList ? "left-0" : "-left-full"
						)}
					>
						{/* Mobile Menu Level 1 */}

						<ul>
							{navigation?.map((link, i) => (
								<li className="relative mb-5 last:mb-0" key={i}>
									{link.below ? (
										<Text
											as="span"
											key={link.id}
											id={`${link?.options?.attributes?.id}-mobile`}
											className="relative mb-2 inline-block text-2xl font-medium text-white before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-[''] hover:text-primary-50"
										>
											{link.title}
										</Text>
									) : (
										<Link
											key={link.id}
											id={`${link?.options?.attributes?.id}-mobile`}
											href={link.url}
											className="relative mb-2 inline-block text-2xl font-medium text-white before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-[''] hover:text-primary-50"
											onClick={() => setShowMobileList(false)}
											aria-label={`${t("Nx:Menu de navigation")} : ${link?.title}`}
										>
											{link.title}
										</Link>
									)}

									{/* Mobile Menu Level 2 */}
									{link.below && (
										<ul>
											{link.below.map((submenu, i) => {
												return (
													<li className="mb-3 pl-5 last:mb-0" key={i}>
														{submenu.url ? (
															<Link
																key={submenu.id}
																id={`${submenu?.options?.attributes?.id}-mobile`}
																href={submenu.url}
																className="text-lg font-medium text-white hover:text-primary-50"
																onClick={() => setShowMobileList(false)}
																aria-label={`${t("Nx:Menu de navigation")} : ${
																	submenu?.title
																}`}
															>
																{submenu.title}
															</Link>
														) : (
															<Text
																as="span"
																key={submenu.id}
																id={`${submenu?.options?.attributes?.id}-mobile`}
																className="text-lg font-medium text-white hover:text-primary-50"
															>
																{submenu.title}
															</Text>
														)}
													</li>
												)
											})}
										</ul>
									)}
								</li>
							))}
						</ul>
						<div className="mt-6 flex items-center space-x-4 self-center tabUp:ml-10">
							{dfComponents?.map((item, i) => {
								return (
									item.link.href && (
										<Button {...item.link} id={item.link.id + "-mobile"} key={i}>
											{item.icon ? <Icon id={item.icon} className="h-5 w-5" /> : ""}
											{item.link.title}
										</Button>
									)
								)
							})}
						</div>
						{showAccount == 1 && (
							<div className="mt-4 flex w-full items-center justify-center border-t border-white pt-4">
								<UserInfo />
							</div>
						)}
					</div>
				</nav>
			</Container>
		</header>
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
					ref={menuButtonRef}
					className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
					data-testid="switch-locale-button"
				>
					{locale.toUpperCase()}
					<Icon
						id="chevron-down"
						className="-mr-1 ml-2 h-5 w-5 text-primary-200 hover:text-primary-100"
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
												{/* {active ? (
										<EditActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
									) : (
										<EditInactiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
									)} */}
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

const UserMenu = ({ data, signOut, accountUrl }) => {
	const userNavigation = [
		{ name: "Settings", href: accountUrl },
		{
			name: "Sign out",
			href: "#.",
			onClick: () => {
				signOut().then(() => {
					Cookies.remove("isAuth")
				})
			},
		},
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
						{userNavigation?.map((item) => (
							<MenuItem key={item.name}>
								{({ active }) => (
									<Link href={item?.href}>
										<div
											onClick={item?.onClick}
											onKeyDown={(e) => e.key === "Enter" && item?.onClick}
											role="button"
											tabIndex={0}
											className={vclsx(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block rounded-md px-4 py-2 text-sm"
											)}
										>
											{item.name}
										</div>
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

const HeaderComponent = ({ data }) => {
	const props = {
		mainMenu: data?.extra_field?.use_menu || "main",
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		switchLocation: data?.extra_field?.show_language_dropdown,
		showAccount: data?.extra_field?.show_account,
		dfComponents: data?.components?.map((item) => ({
			link: {
				title: item?.cta?.title,
				href: item?.cta?.url || null,
				id: item?.cta?.attributes.id || "",
				className: item?.cta?.attributes?.class || "",
				target: item?.cta?.attributes?.target || "_self",
			},
			icon: item?.icon,
		})),
		/* Below Options are for the Static Catalog page   */
		staticNavigation: data?.staticNavigation,
		isFixed: data?.extra_field?.isFixed,
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
			<SearchOverlayV2
				show={isSearchOverlayVisible}
				onClose={() => {
					setIsSearchOverlayVisible(false)
				}}
			></SearchOverlayV2>
		</>
	)
}

export default HeaderComponent
