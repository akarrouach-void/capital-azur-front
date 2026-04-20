import React from "react"

import { useMenu } from "@vactorynext/core/hooks"
import { Text, Icon, Link, Wysiwyg, Image, ThemeChanger } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_footer:footer-variant2",
	lazy: false,
}

export const Footer = ({
	logo,
	mainMenuId,
	footerBottomMenuId,
	followUsText,
	copyrights,
	signateur,
	social_medias,
}) => {
	const footerMainMenu = useMenu(mainMenuId)
	const footerBottomMenu = useMenu(footerBottomMenuId)

	const logoContent = {
		src: logo?._default || null,
		width: logo?.meta?.width,
		height: logo?.meta?.height,
		alt: logo?.meta?.alt,
	}

	return (
		<div className="bg-gray-50 pt-16">
			<div className="px-4 pb-16 tabUp:flex tabUp:items-start tabUp:justify-between tabUp:px-28">
				<Link href="/">
					<Image
						className="mx-auto mb-10 w-[152px] tabUp:m-0"
						{...logoContent}
						alt={logoContent.alt}
						width="100"
						height="100"
					/>
				</Link>
				<ul className="mb-10 flex flex-col items-center tabUp:w-full tabUp:flex-row tabUp:items-start tabUp:justify-evenly tabUp:gap-7">
					{footerMainMenu?.map((link, i) => {
						return (
							<li
								key={i}
								className="mb-6 block text-center text-lg font-semibold text-black last:mb-0 tabUp:mb-0 tabUp:text-left"
							>
								<Link
									variant="body2"
									href={link.url}
									target="_self"
									className="hover:underline"
								>
									{link.title}
								</Link>
								{link.below && (
									<ul className="flex flex-col items-center tabUp:items-start tabUp:pl-5">
										{link.below.map((submenu, i) => {
											return (
												<li
													key={i}
													className="list-disc text-center text-gray-800 tabUp:text-left"
												>
													<Link
														key={submenu.id}
														href={submenu.url}
														className="text-base font-medium hover:underline"
													>
														{submenu.title}
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
				<div className="flex flex-col items-center tabUp:items-start">
					<Text as="p" className="mb-2 text-lg font-semibold">
						{followUsText}
					</Text>
					<ul
						className={vclsx(
							"scrollbar-hide flex h-full items-center space-x-4 whitespace-nowrap"
						)}
					>
						{social_medias.map((item, i) => {
							return (
								<li className="flex-1" key={i}>
									<Link
										href={item.link.url}
										id={item.link.attributes.id}
										target={item.link.attributes.target}
										className={vclsx("flex", item.link.attributes.class)}
									>
										{item.icon ? (
											<Icon
												id={item.icon}
												width="20px"
												height="20px"
												className="text-black hover:text-gray-600"
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
			</div>
			<div className="bg-primary-700 px-4 py-6 tabUp:bg-transparent tabUp:py-0">
				<ul className="flex flex-wrap justify-start gap-3 border-b border-white pb-7 tabUp:gap-5 tabUp:border-0 tabUp:pb-6">
					{footerBottomMenu?.map((link, i) => {
						return (
							<li
								key={i}
								className="text-sm font-semibold text-white hover:underline tabUp:text-black"
							>
								<Link variant="body2" href={link.url} target="_self">
									{link.title}
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
			<div className="bg-primary-700 px-4 py-6 tabUp:flex tabUp:justify-between">
				<Text as="p" className="mb-4 text-sm text-white tabUp:mb-0">
					{copyrights}
				</Text>
				{signateur}
			</div>
		</div>
	)
}

const FooterVariant2Widget = ({ data }) => {
	const themeSwitcher = data?.extra_field?.enableThemeSwitcher
	const props = {
		logo: data?.extra_field?.logo?.[0],
		mainMenuId: data?.extra_field?.use_footer_main,
		footerBottomMenuId: data?.extra_field?.use_footer_bottom,
		followUsText: data?.extra_field?.followUsText,
		copyrights: data?.extra_field?.copyrights,
		signateur: (
			<Wysiwyg
				className="text-sm text-white"
				html={data?.extra_field?.signateur?.value["#text"]}
			/>
		),
		social_medias: data?.components.map((item) => ({
			link: item?.cta_social,
			icon: item?.icon,
		})),
	}

	return (
		<>
			<Footer {...props} />
			{themeSwitcher ? <ThemeChanger /> : null}
		</>
	)
}

export default FooterVariant2Widget
