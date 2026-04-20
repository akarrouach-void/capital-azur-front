import { Fragment, useEffect, useRef, useState } from "react"
import { useI18n, useMenu, useHeader, useNode, useAccount } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { vclsx } from "@vactorynext/core/utils"
import { useRouter } from "next/router"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { Icon, Link, Button, Text, Image, Avatar } from "@/ui"
import { ParagraphsTemplate } from "@vactorynext/core/paragraphs"
import { Widgets } from "@/runtime/widgets"
import Cookies from "js-cookie"

export const config = {
	id: "vactory_header:variant7",
	lazy: true,
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const HeaderMegaMenuComponent = ({ data }) => {
	const props = {
		mainMenu: data?.extra_field?.use_menu || "main",
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		dfComponents:
			data?.components?.map((item) => ({
				link: {
					title: item?.cta?.title,
					href: item?.cta?.url || null,
					id: item?.cta?.attributes.id || "",
					className: item?.cta?.attributes?.class || "",
					rel: item?.cta?.attributes?.rel || "",
					target: item?.cta?.attributes?.target || "_self",
				},
			})) || [],
	}

	return <Header {...props} />
}

const Header = ({ mainMenu, logo, dfComponents }) => {
	const [showSubMenu, setShowSubMenu] = useState(null)
	const [showMobileList, setShowMobileList] = useState(null)
	const [showSubMenu2, setShowSubMenu2] = useState(null)

	const router = useRouter()
	const locale = router.locale
	const navigation = useMenu(mainMenu)
	const { t } = useI18n()

	// To hide/animate the header
	const { headerState } = useHeader(40)

	// Menu container red
	const menuRef = useRef(null)

	//Prevent body scrolling on mobile header open
	useEffect(() => {
		if (showMobileList || showSubMenu2) {
			document.body.classList.add("overflow-y-hidden")
		} else {
			document.body.classList.remove("overflow-y-hidden")
		}
	}, [showMobileList, showSubMenu2])

	const handleClickOutside = (event) => {
		if (menuRef.current && !menuRef.current.contains(event.target)) {
			setShowSubMenu(null)
		}
	}
	const handleKeyPress = (event) => {
		if (event.key === "Escape") {
			setShowSubMenu(null)
		}
	}

	//Prevent body scrolling on mobile header open & search overlay
	useEffect(() => {
		showMobileList
			? document.body.classList.add("max-sm:overflow-hidden")
			: document.body.classList.remove("max-sm:overflow-hidden")
	}, [showMobileList])

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside)
		document.addEventListener("keydown", handleKeyPress)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			document.removeEventListener("keydown", handleKeyPress)
		}
	}, [])

	const [elementSpecs, setElementSpecs] = useState(null)

	const PADDING_NAVBAR = 32
	const TRIANGLE_HALF_WIDTH = 15
	const getElementSpecs = (event) => {
		const element = event.currentTarget
		const show = JSON.parse(element?.dataset?.show) || false
		const rect = element.getBoundingClientRect()

		const parentWidth = rect.width
		const halfParentWidth = parentWidth / 2

		const parentOffset = {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX - PADDING_NAVBAR - TRIANGLE_HALF_WIDTH,
		}

		const position = {
			top: parentOffset.top,
			left: parentOffset.left + halfParentWidth, // Center of the parent element
		}

		setElementSpecs({ position, width: parentWidth, show: show })
	}

	return (
		<div
			className={vclsx(
				"translate-transform fixed left-0 top-0 z-[80] h-[72px] w-full duration-500 ease-in-out lg:h-[100px]",
				`${
					headerState === "top"
						? `translate-y-[0px] bg-transparent text-white`
						: headerState === "bypassing_header"
							? " -translate-y-[72px] bg-transparent text-white lg:-translate-y-[100px]"
							: headerState === "scroll_down_after_header"
								? ` -translate-y-[72px] bg-primary-900 text-black  lg:-translate-y-[100px]`
								: headerState === "scroll_top"
									? `translate-y-[0px] bg-primary-900 text-black`
									: "translate-y-[0px] bg-transparent text-white"
				} `
			)}
		>
			<header className="h-full">
				<nav className="h-full px-4 sm:px-6 lg:px-8 lg:py-6" aria-label="Top">
					<div className="relative flex h-full w-full items-center justify-between">
						<button
							className="lg:hidden"
							onClick={() =>
								showMobileList ? setShowMobileList(false) : setShowMobileList(true)
							}
						>
							<Icon id="burger-menu" className="h-5 w-5 text-white" />
						</button>
						<div
							className={vclsx(
								"absolute left-0 top-[71px] z-[100] h-0 w-0 border-b-[15px] border-l-[15px] border-r-[15px] border-b-white border-l-transparent border-r-transparent transition-all duration-500 ease-in-out"
							)}
							style={{
								transform: `translateY(-${showSubMenu !== null ? 10 : 0}px) translateX(${
									elementSpecs?.position?.left || 0
								}px) scale(${showSubMenu !== null ? 1 : 0})`,
								opacity: `${showSubMenu !== null ? 1 : 0}`,
								display: !elementSpecs?.show && "none",
							}}
						/>

						<div className="flex w-full flex-grow items-center">
							<Link href={`/${locale}`} className="mx-auto flex-shrink-0 lg:mx-0">
								<Text as="span" className="sr-only">
									Factory
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
							{/* Desktop Menu Level 1 */}
							<ul
								className="max-lg::hidden ml-10 mr-8 flex w-full items-center justify-start gap-6 tracking-wider"
								ref={menuRef}
							>
								{navigation.map((link, i) => (
									<li
										data-show={Array.isArray(link?.below)}
										onMouseEnter={(event) => {
											showSubMenu === null ? setShowSubMenu(i) : setShowSubMenu(null)
											getElementSpecs(event)
											setShowSubMenu(i)
										}}
										key={i}
									>
										<span
											role="button"
											tabIndex={0}
											onClick={() => {
												setShowSubMenu(null)
												setShowSubMenu2(null)
												setShowMobileList(null)
											}}
											onKeyDown={() => {
												setShowSubMenu(null)
												setShowSubMenu2(null)
												setShowMobileList(null)
											}}
											className={vclsx(
												`${
													headerState === "top"
														? `translate-y-[0px] `
														: headerState === "bypassing_header"
															? " translate-y-[72px] lg:translate-y-[100px] "
															: headerState === "scroll_down_after_header"
																? ` translate-y-[72px] lg:translate-y-[100px] `
																: headerState === "scroll_top"
																	? `translate-y-[0px]`
																	: "translate-y-[0px]"
												} `,
												"fixed inset-0 z-[1] h-screen w-screen bg-[rgba(0,0,0,0.05)] transition-transform duration-500",
												showSubMenu == i ? "block" : "hidden"
											)}
										/>

										{link.below ? (
											<Text
												as="span"
												key={link.id}
												className="relative z-[2] flex cursor-pointer items-center gap-2 font-medium tracking-[0px] text-white transition-opacity duration-200 ease-in-out first-letter:inline-flex xl:text-[16px] max-xl:text-[16px]"
												variant="custom"
											>
												{link.title}
												<Icon
													id="chevron-down"
													className={vclsx(
														"h-[15px] w-[15px]",
														"fill-current transition-transform duration-200 ease-in-out",
														showSubMenu === i ? "rotate-180" : "rotate-0"
													)}
												/>
											</Text>
										) : (
											<>
												<Link
													key={link.id}
													href={link.url}
													className="relative z-[2] font-medium tracking-[0px] text-white transition-opacity duration-200 ease-in-out hover:underline xl:text-[16px] max-xl:text-[16px]"
													onClick={() => setShowSubMenu(null)}
												>
													{link.title}
												</Link>
											</>
										)}

										{/* Desktop Menu Level 2 */}
										{link.below && (
											<ul
												className={vclsx(
													"absolute left-0 right-0 top-[76px] z-[100] w-full overflow-hidden bg-white px-7 py-6 text-black shadow-lg xl:px-10",
													showSubMenu === i ? "block" : "hidden"
												)}
											>
												<button
													className="absolute right-3 top-3  bg-transparent"
													onClick={() => {
														showSubMenu === i ? setShowSubMenu(null) : setShowSubMenu(i)
														setShowSubMenu2(null)
														setShowMobileList(null)
													}}
												>
													<Icon id="close" className="h-4 w-4" />
												</button>

												{link.below.map((sub2, i) => {
													if (sub2?.injectedTemplate?.widget_id) {
														return (
															<ParagraphsTemplate
																Widgets={Widgets}
																key={i}
																id={sub2?.injectedTemplate?.widget_id}
																settings={JSON.parse(sub2?.injectedTemplate?.widget_data)}
															/>
														)
													}

													return sub2.url ? (
														<li className="mb-3 w-fit text-base font-semibold hover:text-primary hover:underline">
															<Link
																key={sub2.id || i}
																href={sub2.url || "#"}
																onClick={() => setShowSubMenu(null)}
															>
																{sub2.title}
															</Link>
														</li>
													) : null
												})}
											</ul>
										)}
									</li>
								))}
							</ul>
						</div>
						<div className="max-lg::hidden flex items-center space-x-4">
							{dfComponents.map((item, i) => {
								return (
									item.link.href && (
										<Button {...item.link} key={i} className="z-[2]">
											{item.link.title}
										</Button>
									)
								)
							})}
							<SwitchLocale />
							<UserInfo />
						</div>
					</div>

					<Transition
						as="div"
						show={Boolean(showMobileList)}
						enter="transition ease-out duration-300"
						enterFrom="transform opacity-0 -translate-x-[345px]"
						enterTo="transform opacity-100 translate-x-0"
						leave="transition ease-in duration-300"
						leaveFrom="transform opacity-100 translate-x-0"
						leaveTo="transform opacity-0 -translate-x-[345px]"
						className="animate fixed bottom-0 left-0 right-0 top-0 z-[99] flex h-screen w-full flex-col items-start lg:hidden"
					>
						<div className="relative flex h-[72px] w-full items-center justify-between gap-4 bg-primary-900 px-4 text-white">
							<button
								onClick={() => {
									showMobileList ? setShowMobileList(false) : setShowMobileList(true)
									setShowSubMenu2(null)
									setShowSubMenu(null)
								}}
							>
								<Icon id="close" className="h-4 w-4"></Icon>
							</button>
							<SwitchLocale />
						</div>
						<ul className="relative flex h-[calc(100%-72px)] w-full flex-col overflow-y-scroll bg-white text-black">
							{navigation.map((link, i) => {
								return (
									<li className="border-b border-gray-100" key={i}>
										{link.below ? (
											<Text
												as="span"
												key={link.id}
												variant="custom"
												className={vclsx(
													`inline-flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4`
												)}
												onClick={() => {
													setShowSubMenu2(i)
												}}
											>
												<span>{link.title}</span>

												<Icon
													id="chevron-right"
													className="h-3.5 w-3.5 flex-shrink-0 fill-current"
												/>
											</Text>
										) : (
											<Link
												key={link.id}
												href={link.url}
												className={vclsx(
													`inline-flex w-full items-center justify-between gap-3 px-5 py-4`
												)}
												onClick={() => {
													setShowSubMenu2(null)
													setShowSubMenu(null)
													setShowMobileList(null)
												}}
											>
												{link.title}
											</Link>
										)}

										{link.below && (
											<Transition
												as="div"
												show={showSubMenu2 === i}
												enter="transition ease-out duration-300"
												enterFrom="transform opacity-0 -translate-x-full"
												enterTo="transform opacity-100 translate-x-0"
												leave="transition ease-in duration-300"
												leaveFrom="transform opacity-100 translate-x-0"
												leaveTo="transform opacity-0 -translate-x-full"
												className="absolute left-0 top-0 z-[100] h-full w-full bg-white"
											>
												<Text
													className="inline-flex w-full cursor-pointer items-center justify-start gap-2 border-b border-gray-100 px-5 py-4 font-medium"
													onClick={() => {
														setShowSubMenu2(null)
													}}
												>
													<Icon
														id="chevron-left"
														className="h-3.5 w-3.5 flex-shrink-0 fill-current"
													/>
													<span>{t("Nx:Return")}</span>
												</Text>

												<ul className="flex flex-col gap-3 p-6">
													{link.below.map((sub1, i) => {
														if (sub1?.injectedTemplate?.widget_id) {
															return (
																<div
																	onClick={() => {
																		setShowSubMenu2(null)
																		setShowSubMenu(null)
																		setShowMobileList(null)
																	}}
																	onKeyDown={() => {
																		setShowSubMenu2(null)
																		setShowSubMenu(null)
																		setShowMobileList(null)
																	}}
																	role="button"
																	tabIndex={0}
																	key={i}
																>
																	<ParagraphsTemplate
																		Widgets={Widgets}
																		id={sub1?.injectedTemplate?.widget_id}
																		settings={JSON.parse(
																			sub1?.injectedTemplate?.widget_data
																		)}
																	/>
																</div>
															)
														}

														return sub1.url ? (
															<li>
																<Link
																	key={sub1.id || i}
																	href={sub1.url || "#"}
																	onClick={() => {
																		setShowSubMenu2(null)
																		setShowSubMenu(null)
																		setShowMobileList(null)
																	}}
																>
																	{sub1.title}
																</Link>
															</li>
														) : null
													})}
												</ul>
											</Transition>
										)}
									</li>
								)
							})}
							<div className="mt-auto flex flex-col items-center justify-center gap-4 py-5">
								{dfComponents.map((item, i) => {
									return (
										item.link.title && (
											<Button {...item.link} key={i} className="z-[2]">
												{item.link.title}
											</Button>
										)
									)
								})}
								<UserInfo />
							</div>
						</ul>
					</Transition>
				</nav>
			</header>
		</div>
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
						{languages?.map((language, i) => (
							<MenuItem key={language.code} as="div">
								{({ active }) => {
									const url = path_18n[language.code] || "#."
									return (
										<a
											key={i}
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
						))}
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
						{userNavigation?.map((item, i) => (
							<MenuItem key={item.name}>
								{({ active }) => (
									<Link href={item?.href} key={i}>
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
				className="inline-block whitespace-nowrap rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50"
			>
				{t("Nx:Sign in")}
			</Link>
		</>
	)
}

export default HeaderMegaMenuComponent
