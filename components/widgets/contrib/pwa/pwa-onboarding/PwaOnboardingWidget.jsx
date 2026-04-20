import { Wysiwyg } from "@/ui"
import { OnBoarding } from "./onBoarding"

export const config = {
	id: "vactory_pwa:onboarding",
}

const PwaOnboardingWidget = ({ data }) => {
	const props = {
		steps: data?.components?.map((item) => ({
			image: {
				src: item?.image?.[0]?._default,
				width: item?.image?.[0]?.meta?.width,
				height: item?.image?.[0]?.meta?.height,
				alt: item?.image?.[0]?.meta?.alt,
				title: item?.image?.[0]?.meta?.title,
			},
			title: item?.title,
			description: item?.content?.value?.["#text"] ? (
				<Wysiwyg html={item?.content?.value?.["#text"]} />
			) : null,
			link: {
				href: item?.link?.url,
				className: item?.link?.attributes?.class,
				id: item?.link?.attributes?.id,
				rel: item?.link?.attributes?.rel,
				target: item?.link?.attributes?.target,
			},
			link_title: item?.link?.title,
		})),
	}

	return <OnBoarding {...props} />
}

export default PwaOnboardingWidget
