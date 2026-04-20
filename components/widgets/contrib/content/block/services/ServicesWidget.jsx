import { Service } from "./Service"

export const config = {
	id: "vactory_default:4",
	lazy: false,
}

const Services = ({ data }) => {
	const props = {
		items: data.components.map((service) => ({
			title: service.title,
			description: service.description,
			link_title: service.link.title,
			link_url: service.link.url,
			link_attributes: {
				id: service.link.attributes.id,
				target: service.link.attributes.target,
				rel: service.link.attributes.rel,
				className: " w-full justify-center mt-auto",
			},
		})),
	}

	return <Service {...props} />
}

export default Services
