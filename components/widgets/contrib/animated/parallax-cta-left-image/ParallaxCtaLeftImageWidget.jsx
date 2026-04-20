import { Button, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:69",
}

// This DF must have a "No Container" wrapper in the appearance, so can the layout work perfectly
const ParallaxCtaLeftImage = ({ title, content, image, cta }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})
	const background = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
	const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
	const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

	const isMobile = useMedia("(max-width: 600px)", false)

	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
	}
	return (
		<div className="relative md:h-[50vh]">
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				style={{ y: !isMobile ? contentY : "0%" }}
				className="ml-auto flex flex-col items-start p-10 md:mb-0 md:w-6/12 md:pl-16"
				ref={containerRef}
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

				{cta?.href && (
					<motion.div variants={ctaAnimation}>
						<Button {...cta} variant="gradient">
							{cta.title}
						</Button>
					</motion.div>
				)}
			</motion.div>
			<div className="relative left-0 top-0 z-20 h-96 overflow-hidden md:absolute md:h-[50vh] md:w-6/12">
				<motion.img
					style={{ y: !isMobile && imageY, scale: imageScale }}
					src={image?.src?._original}
					alt={image?.alt}
					width={image?.width}
					height={image?.height}
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			{!isMobile && (
				<motion.div
					style={{ y: background }}
					className="absolute bottom-0 left-0 right-0 z-[-100] mx-auto h-64 w-5/12 rounded-r-3xl bg-gray-50"
				></motion.div>
			)}
		</div>
	)
}

const ParallaxCtaLeftImageContainer = ({ data }) => {
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
	return <ParallaxCtaLeftImage {...widgetData} />
}

export default ParallaxCtaLeftImageContainer
