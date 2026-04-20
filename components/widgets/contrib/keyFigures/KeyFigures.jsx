import { CustomAnimation, fadeInDownRightAnimation } from "@/ui"
import { useRef, useEffect, useState } from "react"
import CountUp from "react-countup"

export const KeyFigures = ({ items }) => {
	const ref = useRef(null)
	const [myElementIsVisible, setMyElementIsVisible] = useState(false)

	// Fucntionality to run the aniamtion when reaching the element
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0]
			entry.isIntersecting && setMyElementIsVisible(entry.isIntersecting)
		})
		observer.observe(ref.current)
	}, [])

	let animatedNumber = (item) => {
		return Number.isInteger(Number(item.number)) ? (
			<CountUp
				start={0}
				end={item.number}
				duration={1.5}
				separator=" "
				className="text-6xl font-semibold text-primary-500"
			></CountUp>
		) : (
			<CountUp
				start={0}
				end={item.number}
				duration={1.5}
				decimal=","
				decimals={1}
				separator=" "
				className="text-6xl font-semibold text-primary-500"
			></CountUp>
		)
	}

	return (
		<div
			className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-5"
			ref={ref}
		>
			<CustomAnimation keyFrame={fadeInDownRightAnimation} cascade={true}>
				{items?.map((item) => {
					return (
						<div
							className="h-full rounded-lg bg-white px-4 py-5 shadow-lg hover:shadow-xl lg:py-10"
							key={item.id}
						>
							<h3 className="mb-5 text-center text-2xl font-semibold">
								{item.textPrefix && (
									<span className="mr-1 text-primary-500">{item.textPrefix}</span>
								)}
								{myElementIsVisible ? animatedNumber(item) : <span>0</span>}
								{item.textSuffix && (
									<span className="ml-1 text-primary-500">{item.textSuffix}</span>
								)}
							</h3>
							<p className="text-center text-sm">{item.description}</p>
						</div>
					)
				})}
			</CustomAnimation>
		</div>
	)
}
