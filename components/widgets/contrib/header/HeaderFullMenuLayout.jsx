import { AnimationContext } from "@vactorynext/core/context"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import { Container, Icon, Link, Image } from "@/ui"
import { useContext, useState } from "react"
import { useI18n, useMenu } from "@vactorynext/core/hooks"

const menuWrapper = {
	initial: {
		clipPath: "polygon(0 0, 0% 0, 0% 100%, 0% 100%)",
	},
	animate: {
		transition: {
			duration: 0.7,
		},
		clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
	},
	exit: {
		clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
		transition: { duration: 1 },
	},
}

const menuContainer = {
	animate: {
		transition: { staggerChildren: 0.2, duration: 0.5 },
	},
	exit: {
		transition: { duration: 1 },
	},
}

const menuHeader = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		transition: { duration: 1 },
	},
	exit: {
		opacity: 0,
	},
}

const linksContainer = {
	animate: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.4,
		},
	},
}

const subLinksContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const link = {
	initial: {
		opacity: 0,
		y: 100,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.2 },
	},
	exit: {
		opacity: 0,
		y: 0,
	},
}

const linkText = {
	rest: {
		x: 0,
		duration: 1,
	},
	hover: {
		x: 100,
		padddingRight: 5,
		duration: 1,
	},
}

const linkBar = {
	rest: {
		width: 0,
		duration: 1,
	},
	hover: {
		width: 60,
		duration: 1,
	},
}

const MenuContent = ({ mainMenu, closeMenu, logo }) => {
	const router = useRouter()
	const { t } = useI18n()
	const locale = router.locale
	const navigation = useMenu(mainMenu)
	const [subMenus, setSubMenus] = useState([])
	const { setPageTransition, setUpcomingRoute } = useContext(AnimationContext)
	const [closedManually, setClosedManually] = useState(false)

	const handleClick = ({ pageTransition, upcomingRoute }) => {
		// This must be the duration of the routeChanging layer animation duration
		setTimeout(() => {
			closeMenu()
		}, 1000)
		setPageTransition(pageTransition)
		setUpcomingRoute(upcomingRoute)
	}

	const handleCloseMenu = () => {
		setClosedManually(true)
		setTimeout(() => {
			closeMenu()
		}, 0)
	}

	const onMenuItemClicked = (id) => {
		var menu = navigation.find((item) => {
			return item.id === id
		})["below"]

		if (menu !== undefined) {
			setSubMenus(menu)
		} else {
			setSubMenus([])
		}
	}

	return (
		<motion.header
			key="menuContainer"
			variants={menuWrapper}
			initial="initial"
			animate="animate"
			exit={closedManually ? "exit" : undefined}
			className="fixed left-0 top-0 z-50 h-screen w-screen overflow-hidden bg-white"
		>
			<a
				className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
				href="#main-content"
			>
				{t("Nx:Skip to main content")}
			</a>
			<Container>
				<motion.div key="menuWrapper" variants={menuContainer}>
					{/* the close trigger */}
					<motion.div
						key={"menuHeader"}
						variants={menuHeader}
						className="relative z-50 flex h-16 w-full items-center justify-between pt-3"
					>
						<Link href={`/${locale}`} className="flex-shrink-0">
							{logo.src && (
								<Image
									className="h-10 w-auto"
									{...logo}
									alt={logo.alt}
									priority="high"
									onClick={() => {
										handleClick({ pageTransition: false, upcomingRoute: "home" })
									}}
								/>
							)}
						</Link>
						<button onClick={handleCloseMenu} className="bg-transparent">
							<Icon id="x" className="h-5 w-5" />
						</button>
					</motion.div>

					<div className="flex gap-x-20">
						<motion.ol
							className="mt-48 flex flex-col gap-y-3 lg:w-2/3"
							variants={linksContainer}
						>
							{navigation.map((item, index) => {
								return (
									<motion.li key={index} variants={link}>
										<motion.div
											initial="rest"
											whileHover={"hover"}
											className="relative inline-flex items-center "
										>
											<motion.div
												//variants={linkBar}
												variants={linkBar}
												className="absolute left-0 h-2 w-[60px] bg-black"
											></motion.div>
											<div className="flex items-center">
												<motion.button
													className="gap-x-12 bg-transparent text-3xl font-bold lg:text-6xl"
													variants={linkText}
													aria-label={item?.title}
												>
													{item.below ? (
														<div
															onClick={() => {
																onMenuItemClicked(item.id)
															}}
															onKeyDown={(e) => {
																e.key === "Enter" && onMenuItemClicked(item.id)
															}}
															role="button"
															tabIndex={0}
															className="flex items-center gap-x-12"
															id={item?.options?.attributes?.id}
														>
															<span className="text-3xl font-bold uppercase lg:text-7xl">
																{item.title}
															</span>

															<Icon
																id={"chevron-right"}
																className="h-5 w-5 self-start text-white"
															/>
														</div>
													) : (
														<Link
															onClick={() => {
																handleClick({
																	pageTransition: true,
																	upcomingRoute: item.title,
																})
															}}
															href={item.url}
															id={item?.options?.attributes?.id}
														>
															<motion.span className="text-3xl font-bold uppercase  lg:text-7xl">
																{item.title}
															</motion.span>
														</Link>
													)}
												</motion.button>
											</div>
										</motion.div>
									</motion.li>
								)
							})}
						</motion.ol>
						{subMenus.length !== 0 && (
							<motion.ol
								key={subMenus}
								className="mt-48 flex w-1/3 flex-col gap-y-3"
								variants={subLinksContainer}
							>
								{subMenus.map((item, key) => {
									return (
										<motion.li key={key} variants={link}>
											<Link
												onClick={() => {
													handleClick({
														pageTransition: true,
														upcomingRoute: item.title,
													})
												}}
												href={item.url}
												id={item?.options?.attributes?.id}
											>
												<motion.span
													variants={link}
													className="text-3xl font-bold uppercase"
												>
													{item.title}
												</motion.span>
											</Link>
										</motion.li>
									)
								})}
							</motion.ol>
						)}
					</div>
				</motion.div>
			</Container>
		</motion.header>
	)
}

export const HeaderMenu = ({ mainMenu, logo, className }) => {
	const [isMenuOpened, setIsMenuOpened] = useState(false)

	const handleMenuOpening = () => {
		setIsMenuOpened(true)
	}

	const handleMenuClosing = () => {
		setIsMenuOpened(false)
	}
	return (
		<div className={className}>
			<motion.button
				onClick={handleMenuOpening}
				aria-label="burger menu"
				className="bg-transparent"
			>
				<Icon id="burger-menu" className="h-5 w-5 text-white" />
			</motion.button>
			<AnimatePresence mode="wait">
				{isMenuOpened && (
					<MenuContent logo={logo} mainMenu={mainMenu} closeMenu={handleMenuClosing} />
				)}
			</AnimatePresence>
		</div>
	)
}
