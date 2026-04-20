import React from "react"

import { useMenu, useI18n } from "@vactorynext/core/hooks"
import { Text, Icon, Link, Wysiwyg, InputButton, Image, ThemeChanger } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_footer:footer-variant4",
	lazy: false,
}

export const Footer = ({
	logo,
	use_menu,
	copyrights,
	signateur,
	social_medias,
	under_footer,
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
		<div className="border-t bg-white pt-10">
			<div className="mb-6 px-4 tabUp:mb-10 tabUp:flex tabUp:items-center tabUp:justify-between tabUp:px-20">
				<Link href="/">
					<Image
						className="mx-auto mb-10 w-[152px] tabUp:m-0"
						{...logoContent}
						alt={logoContent.alt}
						width="100"
						height="100"
					/>
				</Link>
				<form className="mb-6 tabUp:mb-0 tabUp:flex tabUp:w-full tabUp:max-w-[435px] tabUp:items-start">
					<InputButton
						variant="default"
						placeholder={t("Nx:Votre email")}
						errorMessage={t("Nx:Le champs est requis")}
						className="w-full border-0 bg-transparent text-black"
						label={t("Nx:Restez informés")}
						buttonClasses="border-0 bg-transparent w-full h-full"
						buttonContent={
							<Icon id="arrow-narrow-right-solid" className="rtl-icon h-4 w-4"></Icon>
						}
					/>
				</form>
				<Text as="p" className="mb-4 text-sm font-medium tabUp:hidden">
					{t("Nx:Follow us")}
				</Text>
				<ul className={vclsx("flex space-x-4")}>
					{social_medias.map((item, i) => {
						// Check if cta's class has a class that starts with "icon"
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
			</div>
			<div className="px-4 pb-10 tabUp:px-20">
				<ul className="mb-6 tabUp:flex tabUp:w-full tabUp:items-start tabUp:justify-evenly tabUp:gap-7 tabUp:border-b tabUp:border-dashed tabUp:pb-6">
					{footerMenu?.map((link, i) => {
						return (
							<li
								key={i}
								className="mb-2 block text-sm text-gray-500 last:mb-0 tabUp:mb-0 tabUp:flex-1 tabUp:text-center"
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
				<div className="tabUp:flex tabUp:justify-between">
					{signateur}
					<Text as="p" className="text-sm text-gray-500">
						{copyrights}
					</Text>
				</div>
			</div>
			{under_footer.props.html && (
				<div className="bg-gray-200 px-4 py-10 tabUp:px-20">{under_footer}</div>
			)}
		</div>
	)
}

const FooterVariant4Widget = ({ data }) => {
	const themeSwitcher = data?.extra_field?.enableThemeSwitcher
	const props = {
		logo: data?.extra_field?.logo?.[0],
		use_menu: data?.extra_field?.use_menu,
		copyrights: data?.extra_field?.copyrights,
		under_footer: (
			<Wysiwyg
				className="font-semebold text-sm text-black"
				html={data?.extra_field?.under_footer?.value["#text"]}
			/>
		),
		signateur: (
			<Wysiwyg
				className="mb-2 text-sm text-gray-500 tabUp:mb-0"
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

export default FooterVariant4Widget
