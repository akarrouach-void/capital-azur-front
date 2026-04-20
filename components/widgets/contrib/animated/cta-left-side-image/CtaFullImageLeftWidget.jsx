import { AnimatedImage, Button, Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:64",
}

// This DF must have a "No Container" wrapper in the appearance, so can the layout work perfectly
const CtaFullImageLeft = ({ title, content, image, cta }) => {
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
		<div className="relative pt-16 md:py-20 lg:py-24">
			<div className="mx-10 mb-16 h-full pl-0 md:mb-0 md:ml-auto md:flex md:w-1/2 md:items-center md:pl-16">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="flex flex-col items-start space-y-2"
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
			<div className="relative left-0 top-0 h-96 overflow-hidden md:absolute md:h-full md:w-1/2">
				<AnimatedImage src={image?.src._original} direction={"right"} />
			</div>
		</div>
	)
}

const CtaFullImagLeftContainer = ({ data }) => {
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
			url: data?.components[0]?.cta?.url,
		},
	}
	return <CtaFullImageLeft {...widgetData} />
}

export default CtaFullImagLeftContainer
