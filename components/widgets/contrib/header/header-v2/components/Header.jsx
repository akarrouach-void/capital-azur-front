import { useRouter } from "next/router"
import { useEffect } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { Icon, Link, Button, Text, Image, ThemeChanger } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { useHeaderLogic } from "../utils/useHeaderLogic"
import DesktopNavigation from "./DesktopNavigation"
import MobileNavigation from "./MobileNavigation"
import SwitchLocale from "./SwitchLocale"
import { UserInfo } from "./UserMenu"

const Header = ({
	mainMenu,
	logo,
	switchLocation,
	showColorScheme,
	cta,
	showOverlay,
	isSearchOverlayVisible,
}) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale

	const {
		navigation,
		isActiveLink,
		showMobileList,
		setShowMobileList,
		showSubMenu,
		setShowSubMenu,
		hideSubmenuOnOutsideClick,
		headerState,
	} = useHeaderLogic(mainMenu)

	// Prevent body scrolling when mobile menu is open or search overlay is visible
	useEffect(() => {
		const shouldPreventScroll = showMobileList || isSearchOverlayVisible

		if (typeof window !== "undefined" && document.body) {
			if (shouldPreventScroll) {
				document.body.classList.add("overflow-y-hidden")
			} else {
				document.body.classList.remove("overflow-y-hidden")
			}
		}

		// Cleanup function to remove the class when component unmounts
		return () => {
			if (typeof window !== "undefined" && document.body) {
				document.body.classList.remove("overflow-y-hidden")
			}
		}
	}, [showMobileList, isSearchOverlayVisible])

	return (
		<header
			className={vclsx(
				"animate left-0 z-[90] flex h-[88px] w-full items-center border-b border-gray-50 bg-white shadow-sm max-lg:fixed max-lg:top-0",
				headerState === "top"
					? "absolute top-0"
					: headerState === "bypassing_header"
						? "absolute -top-[125px]"
						: headerState === "scroll_down_after_header"
							? "absolute -top-[125px]"
							: headerState === "scroll_top"
								? "fixed top-0"
								: "absolute top-0"
			)}
		>
			<a
				className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
				href="#main-content"
			>
				{t("Nx:Skip to main content")}
			</a>

			<nav className="container" aria-label="Top">
				<div className="flex w-full items-center justify-between">
					<div className="flex w-full items-center justify-between gap-2">
						{/* Logo */}
						<Link href={`/${locale}`} className="shrink-0">
							<Text as="span" className="sr-only">
								Factory
							</Text>
							{logo.src && (
								<Image
									className="h-[50px] w-auto"
									{...logo}
									alt={logo.alt}
									priority="high"
								/>
							)}
						</Link>

						{/* Desktop Navigation */}
						<DesktopNavigation
							navigation={navigation}
							isActiveLink={isActiveLink}
							showSubMenu={showSubMenu}
							setShowSubMenu={setShowSubMenu}
							hideSubmenuOnOutsideClick={hideSubmenuOnOutsideClick}
						/>

						{/* Header Actions */}
						<div className="flex items-center gap-2">
							{/* Mobile Search Button */}
							<Button
								className="border-0 bg-transparent px-2.5 text-black lg:hidden"
								onClick={() => showOverlay()}
							>
								<Icon id="search" className="h-5 w-5" />
							</Button>

							{/* Desktop Search */}
							<div id="desktop-search-input" className="relative hidden lg:block">
								<input
									type="text"
									placeholder={t("Nx:Search")}
									className="h-9 w-48 rounded-lg border border-gray-300 bg-white px-4 pl-10 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 xl:w-64"
									readOnly
									onClick={() => showOverlay()}
									data-testid="desktop-search-input"
								/>
								<Icon
									id="search"
									className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
								/>
							</div>

							{/* Theme Changer */}
							{showColorScheme == 1 && <ThemeChanger variant="inline" />}

							{/* Language Switcher */}
							{switchLocation == 1 && <SwitchLocale />}

							{/* User Info */}
							<div className="hidden lg:block">
								<UserInfo />
							</div>

							{/* CTA Buttons */}
							{cta && cta.length > 0 && (
								<div className="hidden items-center space-x-2 lg:flex">
									{cta.map((item, i) => (
										<Button
											key={i}
											icon={item.icon && <Icon id={item.icon} className="h-5 w-5" />}
											variant="gradient"
											{...item.link}
										>
											{item.link.title}
										</Button>
									))}
								</div>
							)}

							{/* Mobile Menu Toggle */}
							<Icon
								id={showMobileList ? "x-solid" : "burger-menu"}
								className="h-5 w-5 shrink-0 cursor-pointer text-black lg:hidden"
								onClick={() =>
									showMobileList ? setShowMobileList(false) : setShowMobileList(true)
								}
							/>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				<MobileNavigation
					navigation={navigation}
					isActiveLink={isActiveLink}
					showMobileList={showMobileList}
					setShowMobileList={setShowMobileList}
					cta={cta}
				/>
			</nav>
		</header>
	)
}

export default Header
