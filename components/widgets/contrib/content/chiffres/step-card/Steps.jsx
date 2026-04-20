import { CustomAnimation, fadeInUpAnimation } from "@/ui"
import { StepCard } from "./StepCard"

export const Steps = ({ items = [] }) => {
	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			<CustomAnimation keyFrame={fadeInUpAnimation} cascade={true}>
				{items.map((item, index) => {
					return (
						<div key={index} className="h-full">
							<StepCard {...item} />
						</div>
					)
				})}
			</CustomAnimation>
		</div>
	)
}
