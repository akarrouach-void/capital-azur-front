import { motion } from "framer-motion"
import { Wysiwyg, Button, AnimatedImage } from "@/ui"

export const config = {
	id: "vactory_default:53",
}

const LeftSideImageCtaBottomAnimation = ({ title, content, image, cta }) => {
	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 120 },
		animate: { opacity: 1, y: 0, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
	}
	return (
		<div className="flex flex-col-reverse gap-x-5 py-10 md:flex-row md:gap-x-10">
			<div className="relative mt-6 flex-1 md:mt-0">
				<div className="relative h-[400px] overflow-hidden rounded-xl shadow-lg md:h-[600px]">
					<AnimatedImage src={image?.src._original} direction="up" />
				</div>
			</div>

			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="flex flex-1 flex-col items-start justify-center"
			>
				<motion.h2
					variants={titleAnimation}
					className="text-3xl font-bold text-gray-900 md:text-4xl"
				>
					{title}
				</motion.h2>

				<motion.div variants={contentAnimation} className="prose">
					{content}
				</motion.div>

				{cta?.url && (
					<motion.div variants={ctaAnimation}>
						<Button href={cta.url} variant="gradient">
							{cta.title}
						</Button>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}

const LeftSideImageCtaBottomAnimationContainer = ({ data }) => {
	const widgetData = {
		title: data.components[0].title,
		content: data.components[0].content.value["#text"] ? (
			<Wysiwyg html={data.components[0].content.value["#text"]} />
		) : null,
		image: {
			src: data.components[0].image[0]?._default,
			alt: data.components[0].image[0]?.meta?.alt,
			width: data.components[0].image[0]?.meta?.width,
			height: data.components[0].image[0]?.meta?.height,
		},
		cta: {
			title: data.components[0].cta.title,
			url: data.components[0].cta.url,
		},
	}
	return <LeftSideImageCtaBottomAnimation {...widgetData} />
}

export default LeftSideImageCtaBottomAnimationContainer
