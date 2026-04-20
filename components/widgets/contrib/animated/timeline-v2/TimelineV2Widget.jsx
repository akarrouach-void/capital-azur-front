import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { motion } from "framer-motion"
import { AnimatedImage, Button } from "@/ui"

export const config = {
	id: "vactory_default:86",
}

const TimelineV2 = ({ timeline }) => {
	const targetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start center", "end center"],
	})
	const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

	return (
		<div ref={targetRef} className="relative mx-auto">
			{/* Timeline line - responsive positioning */}
			<div className="absolute left-8 h-full w-[3px] md:left-12 lg:left-1/2 lg:-translate-x-1/2">
				<span className="absolute inset-0 block h-full w-full bg-gray-300"></span>
				<motion.span
					style={{ height: height }}
					className="absolute inset-0 block h-12 w-full bg-black"
				></motion.span>
			</div>
			<div className="w-full">
				<div className="py-16 md:py-24 lg:py-8">
					{timeline.map((timelineElement, index) => {
						return (
							<Timeline
								key={index}
								timeline={timelineElement}
								cta={timelineElement.cta}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

const Timeline = ({ timeline, cta }) => {
	const contentAnimation = {
		initial: {
			opacity: 0,
		},
		animate: {
			opacity: 1,
			transition: {
				duration: 1,
			},
		},
	}
	const headerAnimation = {
		initial: { opacity: 0, y: 50 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
	}
	const ctaAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
	}

	return (
		<div className="mb-12 last:mb-0 md:mb-20 lg:mb-32">
			{/* Mobile & Tablet Layout */}
			<div className="ml-16 space-y-6 md:ml-20 lg:hidden">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, amount: "some" }}
				>
					<motion.h2
						variants={headerAnimation}
						className="mb-4 text-3xl font-bold md:text-4xl"
					>
						{timeline.date}
					</motion.h2>
					<motion.p
						variants={contentAnimation}
						className="mb-6 text-base text-gray-500 md:text-lg"
					>
						{timeline.content}
					</motion.p>
				</motion.div>
				<div className="aspect-h-9 aspect-w-16 mb-6 overflow-hidden rounded-xl shadow-lg">
					<AnimatedImage
						src={timeline?.image?.src?._original}
						direction="up"
						overlay={false}
					/>
				</div>
				{cta?.url && (
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, amount: "some" }}
						variants={ctaAnimation}
					>
						<Button {...cta} variant="secondary">
							{cta.title}
						</Button>
					</motion.div>
				)}
			</div>

			{/* Desktop Layout - Hidden on mobile/tablet */}
			<div className="hidden lg:flex">
				<div className="sticky top-1/2 w-1/2 self-start pr-16">
					<motion.h2
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, amount: "some" }}
						variants={headerAnimation}
						className="inline-block text-6xl font-bold"
					>
						{timeline.date}
					</motion.h2>
				</div>
				<div className="relative w-1/2 pl-20">
					<motion.span className="absolute -left-3 -top-2 block h-6 w-6 rounded-full border-4 border-white bg-black"></motion.span>
					<motion.p
						initial="initial"
						whileInView="animate"
						viewport={{ amount: "some" }}
						variants={contentAnimation}
						className="mb-8 text-gray-500 md:text-lg"
					>
						{timeline.content}
					</motion.p>
					<div className="aspect-h-12 aspect-w-16 mb-8 overflow-hidden rounded-xl shadow-lg">
						<AnimatedImage
							src={timeline?.image?.src?._original}
							direction="up"
							overlay={false}
						/>
					</div>
					{cta?.url && (
						<motion.div
							initial="initial"
							whileInView="animate"
							viewport={{ once: true, amount: "some" }}
							variants={ctaAnimation}
						>
							<Button {...cta} variant="secondary">
								{cta.title}
							</Button>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	)
}

const TimelineV2Container = ({ data }) => {
	const timeline = data.components.map((timeline) => {
		return {
			date: timeline?.date,
			content: timeline?.content,
			image: {
				src: timeline?.image[0]?._default,
				alt: timeline?.image[0]?.meta?.alt,
				width: timeline?.image[0]?.meta?.width,
				height: timeline?.image[0]?.meta?.height,
			},
			cta: {
				title: timeline?.link?.title,
				url: timeline?.link?.url,
				id: timeline?.link?.attributes?.id,
				class: timeline?.link?.attributes?.class,
				rel: timeline?.link?.attributes?.rel,
				target: timeline?.link?.attributes?.target,
			},
		}
	})
	return <TimelineV2 timeline={timeline} />
}

export default TimelineV2Container
