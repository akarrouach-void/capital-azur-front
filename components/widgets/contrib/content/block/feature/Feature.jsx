import { FeatureCard } from "./FeatureCard"

export const Feature = ({ items = [] }) => {
	return (
		<div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
			{items.map((item, index) => {
				return <FeatureCard key={item?.id || index} {...item} />
			})}
		</div>
	)
}
