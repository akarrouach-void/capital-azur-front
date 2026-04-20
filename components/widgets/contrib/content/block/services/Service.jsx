import { CustomAnimation, fadeInUpAnimation } from "@/ui"
import { ServiceCard } from "./SeriveCard"

export const Service = ({ items = [] }) => {
	return (
		<div className="grid grid-cols-1 gap-5 text-center md:grid-cols-3">
			<CustomAnimation keyFrame={fadeInUpAnimation} cascade={true}>
				{items.map((item, index) => {
					return <ServiceCard key={index} {...item} />
				})}
			</CustomAnimation>
		</div>
	)
}
