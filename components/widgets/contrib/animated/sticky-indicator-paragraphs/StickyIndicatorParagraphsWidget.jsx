import { Heading, Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:56",
}

const addZero = (number) => {
	return ("0" + number).slice(-2)
}

const Section = ({ element, index }) => {
	const wrapper = {
		visible: {
			transition: { staggerChildren: 0.2, delayChildren: 0.1 },
		},
	}

	const indicator = {
		hidden: {
			y: 60,
			opacity: 0,
			scale: 0.8,
		},
		visible: {
			y: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.8,
				type: "spring",
				stiffness: 100,
				damping: 12,
			},
		},
	}

	const contentWrapper = {
		visible: {
			transition: {
				staggerChildren: 0.3,
			},
		},
	}
	const content = {
		hidden: {
			opacity: 0,
			y: 30,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	}

	return (
		<motion.div
			variants={wrapper}
			initial="hidden"
			whileInView="visible"
			viewport={{ amount: 0.25, once: true }}
			className="flex flex-col border-b border-gray-50 lg:flex-row lg:py-12"
		>
			{/* Indicator Section */}
			<div className="w-full lg:w-3/12">
				<motion.div variants={indicator} className="sticky top-20 mb-8 lg:mb-0 lg:pt-24">
					<div className="relative">
						<Heading level={3} variant="none" className="text-6xl font-bold md:text-7xl">
							{addZero(index + 1)}
						</Heading>
						<div className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 lg:h-2"></div>
					</div>
				</motion.div>
			</div>

			{/* Content Section */}
			<motion.div
				variants={contentWrapper}
				className="flex w-full flex-col gap-4 lg:w-9/12 lg:flex-row lg:gap-10"
			>
				<motion.h4
					variants={content}
					className="inline-block w-full text-xl font-bold leading-tight text-slate-800 md:text-2xl lg:w-1/2"
				>
					{element?.smallParagraph}
				</motion.h4>

				<motion.div variants={content} className="prose lg:w-1/2 max-lg:mb-4 [&_p]:!m-0">
					{element?.bigParagraph}
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

const StickyIndicatorParagraph = ({ data }) => {
	const formattedData = data.components.map((item) => {
		return {
			smallParagraph: item?.smallParagraph || "",
			bigParagraph: item?.bigParagraph?.value?.["#text"] ? (
				<Wysiwyg html={item?.bigParagraph?.value?.["#text"]} />
			) : (
				""
			),
		}
	})

	return (
		<div className="pt-12">
			{formattedData.map((element, index) => {
				return (
					<div key={index} className="last:mb-0 max-lg:mb-4">
						<Section element={element} index={index} />
					</div>
				)
			})}
		</div>
	)
}

export default StickyIndicatorParagraph
