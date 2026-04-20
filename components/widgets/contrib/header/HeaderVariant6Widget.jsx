import { Fragment, useState, useEffect, useRef } from "react"
import { useNode, useMenu, useI18n } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { useRouter } from "next/router"
import Image from "next/image"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Icon, Link, SearchOverlay } from "@/ui"
import clsx from "clsx"
import get from "lodash.get"
import { default as NextLink } from "next/link"
import Head from "next/head"

export const config = {
	id: "vactory_header:variant6",
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const Header = ({
	hpLogo,
	logo,
	menu,
	switchLocation,
	dfComponents,
	showOverlay,
	isSearchOverlayVisible,
}) => {
	const { t } = useI18n()
	// if true, show mobile menu
	const [showMobileList, setShowMobileList] = useState(false)
	// Menu container ref
	const menuRef = useRef(null)

	const resultaUseNode = useNode()
	const { settings, path, path_18n } = resultaUseNode
	const isHomePage = settings?.isHomePage || false
	// const hpPathAlias = settings?.homePageAlias || null

	const router = useRouter()
	const { locale, asPath } = router
	const localePath = `/${locale}`
	const routerFullPath = `${localePath}${asPath}`
	const nodePath = path
	const nodeLocalPath = path_18n[locale]

	const mainMenu = useMenu(menu)

	const stripLocalePath = (str) => str.replace(localePath, "")

	const customizedMenuItems = (menu, currentPaths) => {
		return menu.map((item) => {
			const isActive = currentPaths.some(
				(path) =>
					item.url === path ||
					(stripLocalePath(item.url).length && path.includes(stripLocalePath(item.url)))
			)
			let showSubMenu = false

			if (item.below) {
				showSubMenu = item.below.some((subItem) =>
					currentPaths.some(
						(path) =>
							subItem.url === path ||
							(subItem.url.length && path.includes(stripLocalePath(subItem.url))) ||
							(subItem.below &&
								subItem.below.some(
									(subSubItem) =>
										subSubItem.url === path ||
										(subSubItem.url.length &&
											path.includes(stripLocalePath(subSubItem.url)))
								))
					)
				)
			}

			const updatedItem = {
				...item,
				isActive: isActive || showSubMenu,
				showSubMenu: isActive || showSubMenu,
			}

			if (item.below) {
				updatedItem.below = customizedMenuItems(item.below, currentPaths)
			}

			return updatedItem
		})
	}

	const menuWithActiveItems = customizedMenuItems(mainMenu, [
		asPath,
		routerFullPath,
		nodePath,
		nodeLocalPath,
	])

	const subMenuExist = menuWithActiveItems.some(
		(item) => item.showSubMenu && item.isActive
	)

	//Prevent body scrolling on mobile header open & search overlay
	useEffect(() => {
		isSearchOverlayVisible
			? document.body.classList.add("disable-scroll")
			: document.body.classList.remove("disable-scroll")
	}, [menuRef, isSearchOverlayVisible])

	//Prevent body scrolling on mobile header open
	useEffect(() => {
		showMobileList
			? document.body.classList.add("disable-scroll")
			: document.body.classList.remove("disable-scroll")
	}, [showMobileList])

	return (
		<>
			<Head>
				{hpLogo.src && <link rel="preload" as="image" href={hpLogo.src} />}
				{logo.src && <link rel="preload" as="image" href={logo.src} />}
			</Head>

			<header
				className={clsx("relative z-50", isHomePage && "!absolute left-0 right-0 w-full")}
			>
				<a
					className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
					href="#main-content"
				>
					{t("Nx:Skip to main content")}
				</a>
				<div className="container-fluid flex items-center justify-between bg-white shadow-lg max-sm:px-0">
					<nav className="tabDown:w-full">
						<ul className="flex items-center">
							{menuWithActiveItems.map((link) => (
								<li
									key={link.options.attributes?.id}
									className="relative inline-block flex-grow px-3 text-center after:absolute after:-right-[2px] after:top-1/2 after:block after:h-[3px] after:w-[3px] after:-translate-y-1/2 after:rounded-full after:bg-black after:content-[''] last:after:content-none max-sm:px-[6px]"
								>
									<Link
										href={link.url}
										id={link.options.attributes?.id}
										target={link.options.attributes?.target}
										rel={link.options.attributes?.rel}
										className={clsx(
											"font-400 inline-block w-full border-b border-b-transparent px-3 py-[14px] text-[12px] leading-normal text-black hover:text-primary max-sm:px-1 max-sm:py-3",
											link.options.attributes?.class,
											link.isActive && "active !font-700 !border-b-primary !text-primary"
										)}
									>
										{link.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="flex items-center space-x-[14px] tabDown:hidden">
						<button
							className="text-lack border-0 bg-transparent p-[7px] hover:text-primary"
							onClick={() => {
								showOverlay()
							}}
							aria-label={t("Nx:search")}
						>
							<Icon id="search" className="h-4 w-4" />
						</button>
						{switchLocation == 1 && <SwitchLocale />}
						<div className="space-x-[14px]">
							{dfComponents.map((item, i) => {
								return (
									<Link
										key={i}
										href={item.link.url}
										id={item.link.id}
										target={item.link.target}
										rel={item.link.rel}
										className={clsx(
											item.link.class,
											"btn btn-xs",
											item.linkVariant ? "btn-outline-primary" : "btn-primary"
										)}
										variant={"noStyle"}
									>
										{item.icon ? <Icon id={item.icon} className="h-5 w-5" /> : ""}
										{item.link.title}
									</Link>
								)
							})}
						</div>
					</div>
				</div>

				<div
					className={clsx(
						"container flex items-center justify-between py-3",
						!subMenuExist && "tabUp:!justify-center"
					)}
				>
					<Link href={localePath}>
						{logo.src && (
							<Image
								className={clsx(
									"max-h-[64px] w-auto max-sm:max-h-[54px]",
									!subMenuExist && "tabUp:h-[120px] tabUp:!max-h-[120px]"
								)}
								{...logo}
								alt={logo?.alt}
								priority="high"
							/>
						)}
					</Link>

					<div className="inline-flex items-center space-x-2 tabUp:hidden">
						<button
							aria-label={"Recherche"}
							className={clsx(
								"text-lack border-0 bg-transparent p-[7px]",
								isHomePage ? "text-white" : "text-black"
							)}
							onClick={() => {
								showOverlay()
							}}
						>
							<Icon id="search" className="h-4 w-4" />
						</button>

						{switchLocation == 1 && <SwitchLocale isHomePage={isHomePage} />}

						{subMenuExist && (
							<button
								className={clsx(
									"inline-flex h-10 w-10 items-center justify-center tabUp:hidden",
									"hamburger hamburger--spring",
									showMobileList && "is-active"
								)}
								type="button"
								aria-label="burger menu"
								onClick={() =>
									showMobileList ? setShowMobileList(false) : setShowMobileList(true)
								}
							>
								<span className="hamburger-box">
									<span className="hamburger-inner"></span>
								</span>
							</button>
						)}
					</div>

					{menuWithActiveItems.map((linkLevel1, index) => {
						return (
							<Fragment key={index}>
								{linkLevel1.showSubMenu && linkLevel1.isActive && (
									<div
										className={clsx(
											"tabDown:fixed tabDown:bottom-0 tabDown:left-0 tabDown:right-0 tabDown:top-[46px] tabDown:z-40 tabDown:flex tabDown:w-full tabDown:flex-col tabDown:border-t-2 tabDown:border-t-primary tabDown:bg-white tabDown:pt-4 tabDown:transition-transform max-sm:!top-[38px]",
											showMobileList
												? "tabDown:translate-x-0"
												: "tabDown:translate-x-full"
										)}
									>
										<div className="container">
											<div className="flex justify-end px-3 tabUp:hidden">
												<button
													className={clsx(
														"inline-flex h-[44px] w-[44px] items-center justify-center",
														"hamburger hamburger--spring",
														showMobileList && "is-active"
													)}
													type="button"
													aria-label="burger menu"
													onClick={() =>
														showMobileList
															? setShowMobileList(false)
															: setShowMobileList(true)
													}
												>
													<span className="hamburger-box">
														<span className="hamburger-inner"></span>
													</span>
												</button>
											</div>
											<nav>
												<ul className="tabUp:flex tabUp:items-center tabUp:space-x-[18px]">
													{linkLevel1.below?.map((link) => {
														return (
															<Fragment key={link.id}>
																{link.below ? (
																	<>
																		<Menu
																			as="li"
																			className="relative tabUp:inline-block tabDown:block"
																		>
																			{({ open }) => (
																				<>
																					<MenuButton
																						className={clsx(
																							"tabDown:font-400 tabDown:flex tabDown:w-full tabDown:items-center tabDown:justify-between tabDown:px-5 tabDown:py-5 tabDown:text-[14px] tabDown:leading-none tabDown:text-black",
																							"tabUp:font-400 tabUp:inline-block tabUp:border-b tabUp:border-b-transparent tabUp:py-2 tabUp:text-[12px]",
																							"transition-colors",
																							isHomePage
																								? "text-white hover:border-b-white"
																								: "text-black hover:text-primary",
																							link.below.some((item) => item.isActive) &&
																								"tabDown:bg-secondary !font-700 !text-primary"
																						)}
																					>
																						<>{link.title}</>
																						{open ? (
																							<Icon
																								id="chevron-up"
																								className="ml-2 inline-block h-3 w-3"
																								aria-hidden="true"
																							/>
																						) : (
																							<Icon
																								id="chevron-down"
																								className="ml-2 inline-block h-3 w-3"
																								aria-hidden="true"
																							/>
																						)}
																					</MenuButton>
																					<MenuItems
																						static
																						as="nav"
																						className={clsx(
																							"h-auto max-h-[0px]  overflow-hidden transition-all duration-300",
																							"tabUp:absolute tabUp:right-0 tabUp:top-full tabUp:z-10 tabUp:mt-3 tabUp:overflow-hidden tabUp:rounded tabUp:bg-white tabUp:shadow",
																							open && "max-h-[400px]"
																						)}
																					>
																						{link.below.map((item) => {
																							return (
																								<MenuItem key={item.id}>
																									<NextLink
																										variant="noStyle"
																										href={item.url}
																										id={item.options.attributes?.id}
																										rel={item.options.attributes?.rel}
																										target={
																											item.options.attributes?.target
																										}
																										className={clsx(
																											item.options.attributes?.class,
																											"block cursor-pointer",
																											"tabDown:font-400 tabDown:py-4 tabDown:pl-[34px] tabDown:pr-5 tabDown:text-[14px] tabDown:leading-none tabDown:text-black",
																											"tabUp:hover:bg-secondary tabUp:font-400 tabUp:whitespace-nowrap tabUp:bg-white tabUp:px-5 tabUp:py-3 tabUp:text-[12px] tabUp:leading-none tabUp:text-black tabUp:transition-all tabUp:hover:text-primary",
																											item.isActive &&
																												"!bg-secondary !font-700 !text-primary"
																										)}
																										onClick={() =>
																											setShowMobileList(false)
																										}
																									>
																										{item.title}
																									</NextLink>
																								</MenuItem>
																							)
																						})}
																					</MenuItems>
																				</>
																			)}
																		</Menu>
																	</>
																) : (
																	<li className="tabUp:inine-block relative tabDown:block">
																		<NextLink
																			href={link.url}
																			id={link.options.attributes?.id}
																			target={link.options.attributes?.target}
																			rel={link.options.attributes?.rel}
																			className={clsx(
																				link.options.attributes?.class,
																				"block",
																				"tabDown:font-400 tabDown:px-5 tabDown:py-4 tabDown:text-[14px] tabDown:leading-none tabDown:text-black",
																				"tabUp:font-400 tabUp:border-b tabUp:border-b-transparent tabUp:py-2 tabUp:text-[12px]",
																				isHomePage
																					? "text-white hover:border-b-white"
																					: "text-black hover:text-primary",
																				link.isActive &&
																					"is-active tabDown:bg-secondary !font-700 !border-b-primary !text-primary"
																			)}
																			onClick={() => setShowMobileList(false)}
																		>
																			{link.title}
																		</NextLink>
																	</li>
																)}
															</Fragment>
														)
													})}
												</ul>
											</nav>
										</div>
									</div>
								)}
							</Fragment>
						)
					})}
				</div>
			</header>
		</>
	)
}

const SwitchLocale = ({ isHomePage }) => {
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
			<MenuButton
				className={clsx(
					"font-400 inline-flex items-center justify-center px-1 py-1 text-[12px] hover:text-primary focus:outline-none",
					isHomePage ? "text-black tabDown:text-white" : "text-black"
				)}
			>
				{locale.toUpperCase()}
				<Icon id="chevron-down" className="ml-2 h-2 w-2" aria-hidden="true" />
			</MenuButton>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute right-0 z-10 mt-3 origin-top-right overflow-hidden whitespace-nowrap rounded bg-white shadow">
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
											className={clsx(
												"font-400 block px-[14px] py-[6px] text-[12px] text-black no-underline",
												active && "bg-primary text-white"
											)}
										>
											{language.label}
										</a>
									)
								}}
							</MenuItem>
						)
					})}
				</MenuItems>
			</Transition>
		</Menu>
	)
}

const HeaderContainer = ({ data }) => {
	const props = {
		logo: {
			src: get(data, "extra_field.header_logo.[0]._default", null),
			width: get(data, "extra_field.header_logo.[0].meta.width", null),
			height: get(data, "extra_field.header_logo.[0].meta.height", null),
			alt: get(data, "extra_field.header_logo.[0].meta.alt", null),
		},
		hpLogo: {
			src: get(data, "extra_field.hp_logo.[0]._default", null),
			width: get(data, "extra_field.hp_logo.[0].meta.width", null),
			height: get(data, "extra_field.hp_logo.[0].meta.height", null),
			alt: get(data, "extra_field.hp_logo.[0].meta.alt", null),
		},
		top_menu: get(data, "extra_field.use_menu_top", null),
		menu: get(data, "extra_field.use_menu_main", null),
		switchLocation: get(data, "extra_field.show_language_dropdown", null),
		dfComponents: data?.components.map((item) => ({
			link: {
				url: get(item, "cta.url", null),
				title: get(item, "cta.title", null),
				id: get(item, "cta.attributes.id", ""),
				className: get(item, "cta.attributes.class", ""),
				rel: get(item, "cta.attributes.rel", null),
				target: get(item, "cta.attributes.target", null),
			},
			linkVariant: get(item, "mode", false),
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
