import { useMenu } from "@vactorynext/core/hooks"
import { Text, Link, Image, Wysiwyg, Container } from "@/ui"
import { Form } from "@/form"

export const config = {
	id: "vactory_footer:footer-variant1",
}

export const Footer = ({
	menuTop,
	menuBottom,
	newsletterForm,
	newsletterTitle,
	newsletterSubtitle,
	logo,
	copyrights,
	staticFooterMenu,
	staticFooterBottomMenu,
	isStatic,
}) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const menuTopNavigation = isStatic ? staticFooterMenu : useMenu(menuTop)
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const menuBottomNavigation = isStatic ? staticFooterBottomMenu : useMenu(menuBottom)

	return (
		<footer className="bg-primary-900 px-7 lg:px-28">
			<Container>
				<div className="flex flex-col gap-4 border-b border-gray-50 py-8 lg:flex-row lg:justify-between lg:py-14">
					<div className="flex flex-col gap-4 text-white">
						<Text className="text-xl font-bold">{newsletterTitle}</Text>
						<Text className="text-sm">{newsletterSubtitle}</Text>
					</div>
					{newsletterForm.elements && (
						<div className="w-full max-w-96">
							<Form
								webformId={newsletterForm.webform_id}
								schema={newsletterForm.elements}
								styles={newsletterForm.style}
								buttons={newsletterForm.buttons}
								autoSaveSettings={newsletterForm.autosave}
							/>
						</div>
					)}
				</div>
				<ul className="max-lg::gap-8 flex flex-col justify-between border-b border-gray-50 py-8 text-white lg:flex-row lg:py-14">
					{menuTopNavigation &&
						menuTopNavigation.map((el, i) => {
							return (
								<li key={i} className="flex flex-col">
									{el.below ? (
										<Text className="mb-4 font-semibold text-primary-300">
											{el.title}
										</Text>
									) : (
										<Link
											id={el?.options?.attributes?.id}
											href={el.url}
											className="mb-4 font-semibold text-primary-300 hover:underline"
										>
											{el.title}
										</Link>
									)}
									{el.below
										? el?.below.map((sub, j) => {
												return (
													<Link
														id={sub?.options?.attributes?.id}
														key={j}
														href={sub.url}
														className="mb-2 hover:underline"
													>
														{sub.title}
													</Link>
												)
											})
										: null}
								</li>
							)
						})}
				</ul>
				<div className="py-8 lg:py-14">
					<div className="max-lg::gap-6 mb-8 flex flex-col items-center lg:flex-row lg:justify-between">
						<Image {...logo} alt={logo.alt} className="h-12 w-auto lg:h-10" />
						<ul className="flex flex-col items-center gap-4 text-white lg:flex-row lg:gap-6">
							{menuBottomNavigation &&
								menuBottomNavigation.map((el, i) => {
									return (
										<li key={i}>
											<Link
												id={el?.options?.attributes?.id}
												href={el.url}
												className="hover:underline"
											>
												{el.title}
											</Link>
										</li>
									)
								})}
						</ul>
					</div>
					{copyrights}
				</div>
			</Container>
		</footer>
	)
}

const FooterVariant1Widget = ({ data }) => {
	const props = {
		menuTop: data?.components?.[0]?.footer_top,
		menuBottom: data?.components?.[0]?.footer_bottom,
		newsletterForm: {
			id: data?.components?.[0]?.webform?.id || null,
			elements: data?.components?.[0]?.webform?.elements || null,
			style: data?.components?.[0]?.webform?.style || {},
			buttons: data?.components?.[0]?.webform?.buttons || {},
			autosave: data?.components?.[0]?.webform?.autosave,
		},
		newsletterTitle: data?.components?.[0]?.newsletterTitle,
		newsletterSubtitle: data?.components?.[0]?.newsletterSubtitle,
		logo: {
			src: data?.components?.[0]?.logo?.[0]?._default,
			alt: data?.components?.[0]?.logo?.[0]?.meta.alt,
			height: data?.components?.[0]?.logo?.[0]?.meta.height,
			width: data?.components?.[0]?.logo?.[0]?.meta.width,
		},
		copyrights: data?.components?.[0]?.copyrights?.value["#text"] ? (
			<Wysiwyg
				html={data?.components?.[0]?.copyrights?.value["#text"]}
				className="text-center text-sm text-primary-200"
			/>
		) : null,
	}

	return (
		<Footer
			{...props}
			staticFooterMenu={data?.staticFooterMenu}
			staticFooterBottomMenu={data?.staticFooterBottomMenu}
			isStatic={data?.isStatic || false}
		/>
	)
}

export default FooterVariant1Widget
