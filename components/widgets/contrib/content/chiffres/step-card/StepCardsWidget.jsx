import { Steps } from "./Steps"

export const config = {
	id: "vactory_default:23",
}

const StepCardListing = ({ data }) => {
	const props = {
		items: data.components.map((item) => ({
			step: item.chiffre,
			title: item.titre,
			description: item.description,
			cta: {
				title: item.cta.title,
				href: item.cta.url,
				className: item.cta.attributes.class,
				id: item.cta.attributes.id,
				rel: item.cta.attributes.rel,
				target: item.cta.attributes.target,
			},
		})),
	}

	return <Steps {...props} />
}

export default StepCardListing
