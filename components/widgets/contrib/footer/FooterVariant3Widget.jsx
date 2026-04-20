import { Wysiwyg } from "@/ui"

export const config = {
	id: "vactory_footer:footer-variant3",
	lazy: false,
}

export const Footer = ({
	/* logo,
	use_menu,
	copyrights, */
	signateur,
	/* social_medias,
	enableFooterBottom, */
}) => {
	return (
		<div className="bg-gray-50 px-4 py-8">
			<div className="container mx-auto">
				<div className="flex flex-col items-center justify-center">{signateur}</div>
			</div>
		</div>
	)
}

const FooterVariant3Widget = ({ data }) => {
	const props = {
		/* logo: data?.extra_field?.logo?.[0],
		use_menu: data?.extra_field?.use_menu,
		copyrights: data?.extra_field?.copyrights,
		enableFooterBottom: data?.extra_field?.enableFooterBottom, */
		signateur: (
			<Wysiwyg
				className="prose text-gray-600"
				html={data?.extra_field?.signateur?.value["#text"]}
			/>
		),
		/* social_medias: data?.components.map((item) => ({
			link: item?.cta_social,
			icon: item?.icon,
		})), */
	}

	return <Footer {...props} />
}

export default FooterVariant3Widget
