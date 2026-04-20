import { Cards } from "./CardInline"

export const config = {
	id: "vactory_default:6",
	lazy: false,
}

const CardsContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
		btn_more: data?.extra_field.btn_more,
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

export default CardsContainer
