import React from "react"

import { useMenu, useI18n } from "@vactorynext/core/hooks"
import { Text, Icon, Link, Wysiwyg, Image, ThemeChanger } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_footer:footer-variant5",
	lazy: false,
}

export const Footer = ({
	logo,
	use_menu,
	copyrights,
	social_medias,
	left_content,
	right_content,
}) => {
	const { t } = useI18n()
	const footerMenu = useMenu(use_menu)

	const logoContent = {
		src: logo?._default || null,
		width: logo?.meta?.width,
		height: logo?.meta?.height,
		alt: logo?.meta?.alt,
	}

	return (
		<div className="tabUp:flex">
			<div className="bg-warning-500 px-8 py-12 tabUp:flex-1 tabUp:p-20">
				<Link href="/">
					<Image
						className="mx-auto mb-8 w-[200px]"
						{...logoContent}
						alt={logoContent.alt}
						width="100"
						height="100"
					/>
				</Link>
				{left_content.props.html && <div className="text-center">{left_content}</div>}
			</div>
			<div className="bg-gray-50 p-8 tabUp:flex-1 tabUp:p-20">
				<ul className="mb-10 flex justify-center tabUp:justify-start">
					{footerMenu?.map((link, i) => {
						return (
							<li
								key={i}
								className={vclsx(
									"px-4 first:tabUp:pl-0",
									i !== footerMenu.length - 1 && "border-r"
								)}
							>
								<Link
									variant="body2"
									href={link.url}
									target="_self"
									className="hover:underline"
								>
									{link.title}
								</Link>
							</li>
						)
					})}
				</ul>
				{right_content.props.html && (
					<div className="text-center tabUp:text-left">{right_content}</div>
				)}
				<Text as="p" className="mb-4 text-center text-xl font-semibold tabUp:text-left">
					{t("Nx:Follow us")}
				</Text>
				<ul className="mb-10 flex items-center justify-center space-x-8 tabUp:justify-start">
					{social_medias.map((item, i) => {
						return (
							<li key={i}>
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
											className="text-black hover:text-gray-200"
										/>
									) : (
										""
									)}
								</Link>
							</li>
						)
					})}
				</ul>
				<Text as="p" className="text-center text-sm text-gray-500 tabUp:text-left">
					{copyrights}
				</Text>
			</div>
		</div>
	)
}

const FooterVariant5Widget = ({ data }) => {
	const themeSwitcher = data?.extra_field?.enableThemeSwitcher
	const props = {
		logo: data?.extra_field?.logo?.[0],
		use_menu: data?.extra_field?.use_menu,
		copyrights: data?.extra_field?.copyrights,
		left_content: (
			<Wysiwyg
				className="text-2xl"
				html={data?.extra_field?.left_content?.value["#text"]}
			/>
		),
		right_content: (
			<Wysiwyg
				className="mb-10"
				html={data?.extra_field?.right_content?.value["#text"]}
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

export default FooterVariant5Widget
