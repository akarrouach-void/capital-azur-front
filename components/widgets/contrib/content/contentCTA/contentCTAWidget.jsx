import { Wysiwyg } from "@/ui"

import { ContentCta } from "./ContentCta"

export const config = {
	id: "vactory_default:28",
}

const ContentCtaWidget = ({ data }) => {
	const props = {
		title: data.components[0].title,
		description: data?.components?.[0]?.description?.value?.["#text"] ? (
			<Wysiwyg
				html={data?.components?.[0]?.description?.value?.["#text"]}
				className="mb-8"
			/>
		) : null,
		link: {
			href: data?.components?.[0]?.link?.url,
			title: data?.components?.[0]?.link?.title,
			id: data?.components?.[0]?.link?.id,
			target: data?.components?.[0]?.link?.target,
			rel: data?.components?.[0]?.link?.rel,
			className: data?.components?.[0]?.link?.class,
		},
	}

	return <ContentCta {...props} />
}

export default ContentCtaWidget
