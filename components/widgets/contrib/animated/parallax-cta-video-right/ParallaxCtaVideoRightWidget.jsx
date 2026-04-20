import { AnimatedVideoModal, Button, Container, Icon, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:73",
}

export const ParallaxCtaVideoRight = ({ title, content, thumbnail, videoId, cta }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})
	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])

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

	const playerButtonAnimation = {
		hover: {
			scale: 1.1,
		},
	}
	return (
		<Container className="my-10 md:mt-32">
			<div
				ref={containerRef}
				className="relative flex flex-col-reverse gap-y-4 md:flex-row md:gap-x-16"
			>
				<div className="w-full md:w-4/12">
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						style={{ y: !isMobile ? contentY : "0%" }}
						className="flex flex-col items-start"
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
				</div>
				<div className="w-full md:w-8/12">
					<AnimatedVideoModal videoId={videoId}>
						<motion.div
							initial="initial"
							whileHover="hover"
							className="aspect-h-9 aspect-w-16 relative overflow-hidden rounded-2xl shadow-xl"
						>
							<motion.img
								className="absolute inset-0 z-10 h-full w-full object-cover"
								src={thumbnail?.src?._original}
								alt={thumbnail?.alt}
								width={thumbnail?.width}
								height={thumbnail?.height}
							/>
							<div className="absolute z-20 h-full w-full bg-black/40"></div>
							<motion.div
								variants={playerButtonAnimation}
								transition={{ duration: 0.3 }}
								className="aboslute z-30 flex h-full w-full items-center justify-center"
							>
								<div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white">
									<Icon id="play" className="h-12 w-12 text-primary-500" />
								</div>
							</motion.div>
						</motion.div>
					</AnimatedVideoModal>
				</div>

				{!isMobile && (
					<motion.div
						style={{ y: backgroundY }}
						className="absolute bottom-0 left-0 right-0 top-0 z-[-100] mx-auto my-auto h-[120%] w-8/12 rounded-2xl bg-gray-50"
					></motion.div>
				)}
			</div>
		</Container>
	)
}

const ParallaxCtaVideoRightContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: data?.components[0]?.content?.value["#text"] ? (
			<Wysiwyg html={data?.components[0]?.content?.value["#text"]} />
		) : null,
		thumbnail: {
			src: data?.components[0]?.thumbnail[0]?._default,
			alt: data?.components[0]?.thumbnail[0]?.meta?.alt,
			width: data?.components[0]?.thumbnail[0]?.meta?.width,
			height: data?.components[0]?.thumbnail[0]?.meta?.height,
		},
		cta: {
			title: data?.components[0]?.cta?.title,
			href: data?.components[0]?.cta?.url,
			id: data?.components[0]?.cta?.attributes?.id,
			class: data?.components[0]?.cta?.attributes?.class,
			rel: data?.components[0]?.cta?.attributes?.rel,
			target: data?.components[0]?.cta?.attributes?.target,
		},
		videoId: data?.components[0]?.videoId,
	}
	return <ParallaxCtaVideoRight {...widgetData} />
}

export default ParallaxCtaVideoRightContainer
