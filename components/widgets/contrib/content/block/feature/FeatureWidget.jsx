import { Feature } from "./Feature"

export const config = {
	id: "vactory_default:30",
	lazy: false,
}

const FeatureContainer = ({ data }) => {
	const props = {
		items: data?.components.map((item, index) => ({
			id: index,
			link_title: item.link.title,
			link_url: item.link.url,
			link_attributes: {
				id: item.link.attributes.id,
				target: item.link.attributes.target,
				rel: item.link.attributes.rel,
				className: item.link.attributes.class + "justify-center",
			},
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			image_alt: item.image_alt,
			title: item.title,
			description: item.description,
		})),
	}

	return <Feature {...props} />
}

export default FeatureContainer
