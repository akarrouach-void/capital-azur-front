import { Button, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:58",
}

const variants = {
	initial: {
		opacity: 1,
	},
	animate: {
		opacity: 1,
	},
}

const ParallaxContentImageLeftWidget = ({ title, content, image, cta }) => {
	const targetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start end", "end start"],
	})
	const translateY = useTransform(scrollYProgress, [0, 1], [0, 150])
	const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

	return (
		<div ref={targetRef} className="relative mb-10 md:mb-20">
			<motion.div
				style={{ y: translateY }}
				className="relative z-10 ml-auto h-full w-full md:w-1/2 md:py-20"
			>
				<div className="mx-3 flex flex-col items-start rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white md:p-12">
					<motion.h2
						variants={variants}
						className="text-3xl font-bold text-white md:text-4xl"
					>
						{title}
					</motion.h2>
					<motion.div variants={variants} className="prose text-white">
						{content}
					</motion.div>
					{cta?.href && (
						<motion.div variants={variants}>
							<Button {...cta} variant="white">
								{cta.title}
							</Button>
						</motion.div>
					)}
				</div>
			</motion.div>
			<div className="relative left-0 top-0 h-[400px] w-full overflow-hidden rounded-xl shadow-2xl md:absolute md:h-full md:w-7/12">
				<motion.img
					style={{ scale: scale }}
					src={image?.src?._original}
					className="h-full w-full object-cover"
				/>
			</div>
		</div>
	)
}

const ParallaxContentImageLeftWidgetContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: data?.components[0]?.content?.value["#text"] ? (
			<Wysiwyg html={data?.components[0]?.content?.value["#text"]} />
		) : null,
		image: {
			src: data?.components[0]?.image[0]?._default,
			alt: data?.components[0]?.image[0]?.meta?.alt,
			width: data?.components[0]?.image[0]?.meta?.width,
			height: data?.components[0]?.image[0]?.meta?.height,
		},
		cta: {
			title: data?.components[0]?.cta?.title,
			href: data?.components[0]?.cta?.url,
			id: data?.components[0]?.cta?.attributes?.id,
			class: data?.components[0]?.cta?.attributes?.class,
			rel: data?.components[0]?.cta?.attributes?.rel,
			target: data?.components[0]?.cta?.attributes?.target,
		},
	}
	return <ParallaxContentImageLeftWidget {...widgetData} />
}

export default ParallaxContentImageLeftWidgetContainer
