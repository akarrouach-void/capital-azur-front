import {
	motion,
	useAnimationControls,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "framer-motion"
import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:85",
}
export const TimelineV1 = ({ timeline }) => {
	const targetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start center", "end center"],
	})
	const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
	return (
		<div className="relative mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8">
			{/* Timeline line - responsive positioning */}
			<div className="absolute left-8 h-full w-[3px] md:left-12 lg:left-1/4">
				<span className="absolute block h-full w-full bg-gray-100"></span>
				<motion.span
					style={{ height: height }}
					className="absolute block h-12 w-full bg-black"
				></motion.span>
			</div>
			<div ref={targetRef} className="w-full">
				<div className="py-16 md:py-24 lg:py-44">
					{timeline.map((timelineElement, index) => {
						return <Timeline key={index} timeline={timelineElement} isPair={index % 2} />
					})}
				</div>
			</div>
		</div>
	)
}

const Timeline = ({ timeline, isPair }) => {
	const timelineRef = useRef()
	const imageRef = useRef()
	const [reachCenter, setReachCenter] = useState(false)
	const { scrollYProgress } = useScroll({
		target: timelineRef,
		offset: ["start end", "start start"],
	})
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		if (latest >= 0.5) {
			setReachCenter(true)
		}
	})

	useEffect(() => {
		if (reachCenter) {
			imageRef.current.animate()
		}
	}, [reachCenter])

	const headerAnimation = {
		initial: { opacity: 0, y: 50 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.4 } },
	}
	const ctaAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
	}

	return (
		<div
			ref={timelineRef}
			className={vclsx(
				"mb-12 last:mb-0 md:mb-20 lg:mb-32",
				// Mobile: Single column with left margin for timeline line
				"ml-16 md:ml-20",
				// Desktop: Alternating layout
				"lg:ml-0 lg:flex lg:gap-x-20",
				isPair && "lg:pl-32 lg:pr-0",
				!isPair && "lg:pl-0 lg:pr-32"
			)}
		>
			{/* Mobile & Tablet Layout */}
			<div className="space-y-6 lg:hidden">
				<div className="relative">
					<div className="aspect-h-4 aspect-w-3 relative max-w-md">
						<AnimatedImage ref={imageRef} src={timeline.image.src} direction={"down"} />
					</div>
				</div>
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, amount: "some" }}
				>
					<motion.h3
						variants={headerAnimation}
						className="mb-4 text-2xl font-bold md:text-3xl"
					>
						{timeline.date}
					</motion.h3>
					<motion.p
						variants={contentAnimation}
						className="text-base text-gray-500 md:text-lg"
					>
						{timeline.content}
					</motion.p>
					{timeline?.cta?.url && (
						<motion.div variants={ctaAnimation}>
							<Button {...timeline.cta} variant="secondary">
								{timeline.cta.title}
							</Button>
						</motion.div>
					)}
				</motion.div>
			</div>

			{/* Desktop Layout - Hidden on mobile/tablet */}
			<div className="hidden lg:contents">
				<div className="relative w-5/12">
					<div className="aspect-h-4 aspect-w-3 relative">
						<AnimatedImage ref={imageRef} src={timeline.image.src} direction={"down"} />
					</div>
				</div>
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, amount: "some" }}
					className="w-7/12"
				>
					<motion.h3 variants={headerAnimation} className="mb-8 text-5xl font-bold">
						{timeline.date}
					</motion.h3>
					<motion.p variants={contentAnimation} className="mb-4 text-lg text-gray-500">
						{timeline.content}
					</motion.p>
					{timeline?.cta?.url && (
						<motion.div variants={ctaAnimation}>
							<Button {...timeline.cta} variant="secondary">
								{timeline.cta.title}
							</Button>
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	)
}

const AnimatedImage = forwardRef(({ src }, ref) => {
	const imageAnimationControls = useAnimationControls()
	useImperativeHandle(ref, () => {
		return {
			animate: () => {
				imageAnimationControls.start({
					scale: 1.1,
					transition: { duration: 0.5 },
				})
			},
		}
	})
	return (
		<motion.div className="h-full w-full overflow-hidden rounded-2xl bg-black shadow-lg">
			<motion.img
				animate={imageAnimationControls}
				src={src?._original}
				className="absolute inset-0 h-full w-full object-cover"
			/>
		</motion.div>
	)
})

const TimelineV1Container = ({ data }) => {
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
	return <TimelineV1 timeline={timeline} />
}

export default TimelineV1Container
