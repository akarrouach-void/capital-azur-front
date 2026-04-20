import { Button, Wysiwyg } from "@/ui"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:84",
}

const CtaFullImageCenteredV2 = ({ title, content, cta, image }) => {
	const targetRef = useRef()

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start start", "end end"],
	})

	const clipPathL = useTransform(scrollYProgress, [0, 1], ["10%", "0%"])
	const clipPathR = useTransform(scrollYProgress, [0, 1], ["10%", "0%"])
	const clipPathT = useTransform(scrollYProgress, [0, 1], ["70%", "0%"])

	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 1 } },
	}

	const imageAnimation = {
		initial: {
			clipPath: "inset(100% 10% 0% 10%)",
		},
		animate: {
			clipPath: "inset(70% 10% 0% 10%)",
			transition: {
				duration: 1,
			},
		},
	}

	return (
		<div ref={targetRef} className="h-[150vh]">
			<div className="sticky top-0 h-[100vh] w-full">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="absolute left-0 right-0 top-1/2 mx-auto flex w-full -translate-y-1/2 flex-col items-center gap-8 px-3 md:w-1/2"
				>
					<motion.h2
						variants={titleAnimation}
						className="text-center text-4xl font-semibold md:text-5xl lg:text-7xl"
					>
						{title}
					</motion.h2>

					{cta?.url && (
						<motion.div variants={ctaAnimation}>
							<Button {...cta} variant="gradient">
								{cta.title}
							</Button>
						</motion.div>
					)}
				</motion.div>
				<motion.div
					initial={imageAnimation.initial}
					whileInView={imageAnimation.animate}
					viewport={{ once: true }}
					style={{
						clipPath: useMotionTemplate`inset(${clipPathT} ${clipPathL} 0% ${clipPathR})`,
					}}
					className="absolute bottom-0 h-full w-full"
				>
					<div className="absolute left-0 right-0 top-1/2 z-10 mx-auto flex w-full -translate-y-1/2 flex-col items-center gap-8 px-3 md:w-2/3">
						<div className="text-lg: text-center text-white md:text-xl">{content}</div>

						{cta?.url && (
							<motion.div variants={ctaAnimation}>
								<Button {...cta} variant="gradient">
									{cta.title}
								</Button>
							</motion.div>
						)}
					</div>
					<motion.img
						src={image?.src?._original}
						alt={image?.alt}
						width={image?.width}
						height={image?.height}
						className="absolute inset-0 h-full w-full object-cover"
					/>
					<div className="absolute bottom-0 left-0 right-0 top-0 bg-black/30" />
				</motion.div>
			</div>
		</div>
	)
}

const CtaFullImageCenteredV2Container = ({ data }) => {
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
			title: data?.components[0]?.link?.title,
			url: data?.components[0]?.link?.url,
			id: data?.components[0]?.link?.attributes?.id,
			class: data?.components[0]?.link?.attributes?.class,
			rel: data?.components[0]?.link?.attributes?.rel,
			target: data?.components[0]?.link?.attributes?.target,
		},
	}
	return <CtaFullImageCenteredV2 {...widgetData} />
}

export default CtaFullImageCenteredV2Container
