import { Button, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:67",
}

export const InternalParallaxCtaLeftSideImage = ({ title, content, image, cta }) => {
	const imageContainerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: imageContainerRef,
		offset: ["start end", "end start"],
	})
	const parallaxY = useTransform(scrollYProgress, [0, 1], ["0", "-25%"])
	const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

	const isMobile = useMedia("(max-width: 600px)", false)

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
		<div className="relative md:h-[80vh]">
			<div className="ml-auto h-full p-10 md:mb-0 md:flex md:w-1/2 md:items-center md:pr-16">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="flex flex-col items-start justify-center"
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

			<div
				ref={imageContainerRef}
				className="relative left-0 top-0 h-96 overflow-hidden bg-gray-100 md:absolute md:h-full md:w-1/2"
			>
				<motion.img
					style={{ y: !isMobile && parallaxY, scale: imageScale }}
					src={image?.src?._original}
					className="absolute inset-0 h-[135%] w-[135%] object-cover"
				/>
			</div>
		</div>
	)
}

const InternalParallaxCtaLeftSideImageContainer = ({ data }) => {
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
	return <InternalParallaxCtaLeftSideImage {...widgetData} />
}

export default InternalParallaxCtaLeftSideImageContainer
