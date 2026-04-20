import {
	useTransform,
	useScroll,
	useMotionValueEvent,
	motion,
	AnimatePresence,
} from "framer-motion"
import { useRef, useState } from "react"
import { Link } from "@/ui"

export const config = {
	id: "vactory_default:75",
}

const Text = ({ text, cta }) => {
	const targetRef = useRef()
	const [highlitedItems, setHighlitedItems] = useState(0)
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["0 0.9", "0.5 0.2"],
	})
	const words = text.split(" ")
	const childs = words.map((element, index) => {
		if (index < highlitedItems) {
			return (
				<span
					key={index}
					className="text-xl font-bold leading-tight text-gray-700 md:text-3xl"
				>
					{element}
				</span>
			)
		}
		return (
			<span
				key={index}
				className="text-xl font-bold leading-tight text-gray-50/60 md:text-3xl"
			>
				{element}
			</span>
		)
	})
	const highlitedItem = useTransform(scrollYProgress, [0, 1], [0, words.length])

	useMotionValueEvent(highlitedItem, "change", (latest) => {
		setHighlitedItems(Math.ceil(latest))
	})

	return (
		<div ref={targetRef} className="flex flex-wrap justify-center gap-x-4">
			{childs}
			<AnimatePresence>
				{cta?.url && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.9 }}
						transition={{
							duration: 0.6,
							ease: "easeOut",
							delay: 0.3,
						}}
						className="mt-6 flex w-full justify-center md:mt-10"
					>
						<Link href={cta.url} variant="download">
							{cta.title}
						</Link>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

const WordByWordTextAnimationContainer = ({ data }) => {
	const widgetData = {
		text: data?.components[0]?.text,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <Text {...widgetData} />
}

export default WordByWordTextAnimationContainer
