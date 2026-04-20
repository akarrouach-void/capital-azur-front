import { Cards } from "./Cards"

export const config = {
	id: "vactory_default:8",
	lazy: false,
}

const CardMosaicContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
		btn_more: {
			href: data?.extra_field?.btn_more?.url,
			title: data?.extra_field?.btn_more?.title,
			id: data?.extra_field?.btn_more?.attributes?.id,
			rel: data?.extra_field?.btn_more?.attributes.rel,
			target: data?.extra_field?.btn_more?.attributes.target,
			className: data?.extra_field?.btn_more?.attributes.class,
		},
		slider: data?.extra_field.slider,
		items: data?.components.map((item, index) => ({
			id: index,
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			image_alt: item.image_alt || "",
			title: item.title,
			description: item.description,
			link_url: item.link.url,
			link_title: item.link.title,
			video_url: item.video,
		})),
	}

	return <Cards {...props} />
}

export default CardMosaicContainer
