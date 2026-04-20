import { Button, Container, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:70",
}

const ParallaxCtaImageLeft = ({ title, content, image, cta }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})
	const background = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
	const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
	const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

	const isMobile = useMedia("(max-width: 600px)", false)

	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.2 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
	}
	return (
		<Container className="mt-10 md:mt-32 max-md:mb-10">
			<div
				ref={containerRef}
				className="relative flex w-full flex-col gap-x-12 md:flex-row md:items-center"
			>
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					style={{ y: !isMobile && contentY }}
					className="flex w-full flex-col items-start md:w-7/12 max-md:pb-8"
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
				<motion.div className="relative w-full md:w-5/12">
					<motion.div
						style={{ y: !isMobile ? imageY : "0%" }}
						className="relative w-full overflow-hidden rounded-2xl pt-[100%]"
					>
						<motion.img
							style={{ scale: imageScale }}
							src={image?.src?._original}
							alt={image?.alt}
							width={image?.width}
							height={image?.height}
							className="absolute inset-0 h-full w-full object-cover"
						/>
					</motion.div>
				</motion.div>
				{!isMobile && (
					<motion.div
						style={{ y: background }}
						className="absolute inset-0 z-[-100] m-auto h-full w-8/12 rounded-2xl bg-gray-50"
					></motion.div>
				)}
			</div>
		</Container>
	)
}

const ParallaxCtaImageLeftContainer = ({ data }) => {
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
	return <ParallaxCtaImageLeft {...widgetData} />
}

export default ParallaxCtaImageLeftContainer
