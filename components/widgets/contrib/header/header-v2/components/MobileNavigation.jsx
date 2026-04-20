import { Icon, Link, Text, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import {
	getColorVariant,
	hasActiveChildAtAnyLevel,
	hasActiveChildAtLevel2,
} from "../utils/navigationUtils"
import { UserInfo } from "./UserMenu"

const MobileNavigation = ({
	navigation,
	isActiveLink,
	showMobileList,
	setShowMobileList,
	cta,
}) => {
	return (
		<div
			className={vclsx(
				"fixed top-[88px] flex h-[calc(100dvh-88px)] w-full flex-col bg-white transition-all duration-500 ease-in-out lg:hidden",
				showMobileList ? "left-0" : "-left-full"
			)}
		>
			{/* Mobile Menu Content */}
			<div className="flex-1 overflow-y-auto px-6 pb-8">
				<div className="mb-6 flex flex-col items-center gap-3 border-b border-gray-200 py-3">
					{/* User Info */}
					<UserInfo />
					{/* CTA Section */}
					{cta &&
						cta.length > 0 &&
						cta.map((item, i) => (
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
				<nav className="space-y-6">
					{navigation.map((link, i) => {
						const isActive = isActiveLink(link.url)
						const hasActiveChild = hasActiveChildAtAnyLevel(link, isActiveLink)
						const showAsActive = isActive || hasActiveChild

						return (
							<div key={i} className="group">
								{link.below ? (
									<div>
										<Text
											as="span"
											key={link.id}
											id={`${link?.options?.attributes?.id}-mobile`}
											className={vclsx(
												"animate block pb-2 text-lg font-semibold",
												showAsActive ? "text-primary-600" : "text-gray-900"
											)}
										>
											{link.title}
										</Text>
										{/* Mobile Menu Level 2 */}
										<div className="ml-4 space-y-4">
											{link.below.map((submenu, j) => {
												const isSubmenuActive = isActiveLink(submenu.url)
												const hasActiveSubChild = hasActiveChildAtLevel2(
													submenu,
													isActiveLink
												)
												const showSubAsActive = isSubmenuActive || hasActiveSubChild
												const currentColor = getColorVariant(j)

												return (
													<div key={submenu.id} className="mb-4">
														{submenu.below ? (
															<div>
																{/* Section Header with Icon */}
																<div className="mb-3 flex items-center">
																	<div
																		className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg ${currentColor?.bg}`}
																	>
																		<Icon
																			id={submenu?.options?.attributes?.class}
																			className={`h-4 w-4 ${currentColor?.text}`}
																		/>
																	</div>
																	<Text
																		as="span"
																		id={`${submenu?.options?.attributes?.id}-mobile`}
																		className={vclsx(
																			"text-base font-semibold",
																			showSubAsActive
																				? "text-primary-600"
																				: "text-gray-900"
																		)}
																	>
																		{submenu?.title}
																	</Text>
																</div>
																{/* Mobile Menu Level 3 */}
																<div className="ml-11 space-y-1">
																	{submenu.below.map((subSubmenu, k) => {
																		const isSubSubmenuActive = isActiveLink(
																			subSubmenu.url
																		)
																		return (
																			<Link
																				key={k}
																				href={subSubmenu?.url}
																				id={`${subSubmenu?.options?.attributes?.id}-mobile`}
																				target={subSubmenu.options.attributes.target}
																				className={vclsx(
																					"animate block py-2 text-sm font-medium",
																					isSubSubmenuActive
																						? "font-semibold text-primary-600"
																						: "text-gray-600"
																				)}
																				onClick={() => setShowMobileList(false)}
																			>
																				{subSubmenu?.title}
																			</Link>
																		)
																	})}
																</div>
															</div>
														) : (
															<Link
																key={submenu.id}
																href={submenu.url}
																id={`${submenu?.options?.attributes?.id}-mobile`}
																target={submenu.options.attributes.target}
																className={vclsx(
																	"animate block py-2 text-base font-medium",
																	isSubmenuActive
																		? "font-semibold text-primary-600"
																		: "text-gray-700"
																)}
																onClick={() => setShowMobileList(false)}
															>
																{submenu.title}
															</Link>
														)}
													</div>
												)
											})}
										</div>
									</div>
								) : (
									<Link
										key={link.id}
										id={`${link?.options?.attributes?.id}-mobile`}
										href={link.url}
										target={link.options.attributes.target}
										className={vclsx(
											"animate block pb-2 text-lg",
											isActive ? "font-semibold text-primary-600" : "text-gray-900"
										)}
										onClick={() => setShowMobileList(false)}
									>
										{link.title}
									</Link>
								)}
							</div>
						)
					})}
				</nav>
			</div>
		</div>
	)
}

export default MobileNavigation
