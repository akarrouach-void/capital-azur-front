import { Button, Container } from "@/ui"
import { useTransform, useScroll, motion } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:74",
}

const Text = ({ children }) => {
	const containerRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	})
	const x = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
	return (
		<div ref={containerRef} className="relative mb-2 w-full overflow-hidden">
			<div className="w-full text-center text-3xl font-bold uppercase md:text-5xl">
				{children}
			</div>
			<motion.div
				style={{ x: x }}
				className="absolute left-0 top-0 h-full w-full bg-[#f7f7f7]"
			></motion.div>
		</div>
	)
}

export const LineByLineTextAnimation = ({ texts, cta }) => {
	return (
		<Container>
			{texts.map((text, index) => {
				return <Text key={index}>{text}</Text>
			})}
			{cta?.href && (
				<Text>
					<div className="flex justify-center">
						<Button {...cta} variant="gradient">
							{cta.title}
						</Button>
					</div>
				</Text>
			)}
		</Container>
	)
}

const LineByLineTextAnimationContainer = ({ data }) => {
	const widgetData = {
		texts: data?.components?.map((record) => record.text),
		cta: {
			title: data?.extra_field?.cta?.title,
			href: data?.extra_field?.cta?.url,
			id: data?.extra_field?.cta?.attributes?.id,
			class: data?.extra_field?.cta?.attributes?.class,
			rel: data?.extra_field?.cta?.attributes?.rel,
			target: data?.extra_field?.cta?.attributes?.target,
		},
	}
	return <LineByLineTextAnimation {...widgetData} />
}

export default LineByLineTextAnimationContainer
