import { Icon, Button, Text } from "@/ui"
import { useAnimationControls, motion, AnimatePresence } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

export const config = {
	id: "vactory_default:87",
}

const TimelineV3 = ({ timeline, title, content, cta }) => {
	const datesRef = useRef([])
	const trackRef = useRef()
	const containerRef = useRef()
	const [current, setCurrent] = useState(0)
	const [dateWidth, setDateWidth] = useState()
	const trackAnimationControl = useAnimationControls()

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
	const imageAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
		exit: {
			opacity: 0,
			transition: { duration: 0.5 },
		},
	}

	const movetrack = ({ index, multiplier }) => {
		datesRef.current[index].initial()
		trackAnimationControl.start({
			x: -1 * dateWidth * multiplier,
			transition: {
				duration: 1,
				type: "spring",
				stiffness: 50,
				damping: 20,
			},
		})
	}

	const moveNext = () => {
		setCurrent((prev) => {
			if (prev === timeline.length - 1) return prev
			movetrack({ index: prev, multiplier: prev + 1 })
			return prev + 1
		})
	}

	const movePrev = () => {
		setCurrent((prev) => {
			if (prev === 0) return prev
			movetrack({ index: prev, multiplier: prev - 1 })
			return prev - 1
		})
	}

	useEffect(() => {
		const updateDateWidth = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.getBoundingClientRect().width
				// Mobile: 2 dates visible (w-1/2), Desktop: 3 dates visible (w-1/3)
				const isDesktop = window.innerWidth >= 1024 // lg breakpoint
				const divisor = isDesktop ? 3 : 2
				setDateWidth(containerWidth / divisor)
			}
		}

		updateDateWidth()
		window.addEventListener("resize", updateDateWidth)
		return () => window.removeEventListener("resize", updateDateWidth)
	}, [])

	useEffect(() => {
		datesRef.current[current].animate()
	}, [current])

	return (
		<div
			style={{ contain: "paint" }}
			ref={containerRef}
			//className="mx-auto my-16 max-w-screen-xl px-4 md:my-24 md:px-6 lg:my-44 lg:px-8"
		>
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="mx-auto mb-8 flex w-full flex-col gap-4 px-3 md:mb-16 md:w-4/5 lg:w-2/3"
			>
				<motion.h2
					variants={titleAnimation}
					className="text-3xl font-bold text-gray-900 md:text-4xl"
				>
					{title}
				</motion.h2>

				<motion.p variants={contentAnimation} className="prose">
					{content}
				</motion.p>
				{cta?.url && (
					<motion.div variants={ctaAnimation}>
						<Button {...cta} variant="gradient">
							{cta.title}
						</Button>
					</motion.div>
				)}
			</motion.div>
			{/* Mobile & Tablet Layout */}
			<div className="relative mx-auto mb-8 md:mb-12 lg:hidden">
				<div className="space-y-6 px-3">
					<div className="relative">
						<div className="aspect-h-9 aspect-w-16 relative md:aspect-h-11">
							<AnimatePresence mode="wait">
								<motion.img
									initial="initial"
									animate="animate"
									exit="exit"
									variants={imageAnimation}
									key={timeline[current]?.image?.src?._original}
									src={timeline[current]?.image.src?._original}
									className="rounded-lg object-cover shadow-lg"
								/>
							</AnimatePresence>
						</div>
					</div>
					<div className="space-y-6">
						<div>
							<p className="text-base leading-relaxed text-gray-600 md:text-lg">
								{timeline[current]?.content}
							</p>
						</div>
						<div className="flex justify-center gap-x-4">
							<button
								className="animate rounded-full border border-gray-300 p-3 hover:bg-gray-50"
								onClick={movePrev}
								disabled={current === 0}
							>
								<Icon id="chevron-left" className="h-5 w-5" />
							</button>
							<button
								className="animate rounded-full border border-gray-300 p-3 hover:bg-gray-50"
								onClick={moveNext}
								disabled={current === timeline.length - 1}
							>
								<Icon id="chevron-right" className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="relative mx-auto mb-12 hidden lg:block">
				<div className="flex gap-8">
					<div className="relative flex-1">
						<div className="aspect-h-11 aspect-w-16 relative overflow-hidden rounded-r-2xl">
							<AnimatePresence mode="wait">
								<motion.img
									initial="initial"
									animate="animate"
									exit="exit"
									variants={imageAnimation}
									key={timeline[current]?.image?.src?._original}
									src={timeline[current]?.image.src?._original}
									className="object-cover"
								/>
							</AnimatePresence>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-4 px-3">
						<Text className="text-lg">{timeline[current]?.content}</Text>

						<div className="mt-auto flex w-full gap-x-3">
							<button
								className="animate rounded-full border bg-white p-3 hover:bg-gray-50 disabled:opacity-50"
								onClick={movePrev}
								disabled={current === 0}
							>
								<Icon id="chevron-left" className="h-4 w-4" />
							</button>
							<button
								className="animate rounded-full border bg-white p-3 hover:bg-gray-50 disabled:opacity-50"
								onClick={moveNext}
								disabled={current === timeline.length - 1}
							>
								<Icon id="chevron-right" className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="relative overflow-hidden">
				<motion.div
					animate={trackAnimationControl}
					ref={trackRef}
					className="relative z-30"
				>
					<div className="flex">
						{timeline.map((timelineElement, index) => {
							return (
								<TimelineDate
									key={index}
									ref={(element) => {
										datesRef.current.push(element)
									}}
									date={timelineElement.date}
									onClick={() => {
										if (index !== current) {
											movetrack({ index: current, multiplier: index })
											setCurrent(index)
										}
									}}
								/>
							)
						})}
					</div>
				</motion.div>
				<div className="absolute top-1/2 z-20 w-full">
					<span className="absolute z-20 block h-[1px] w-full bg-gray-200 md:h-[2px]"></span>
				</div>
			</div>
		</div>
	)
}

const TimelineDate = forwardRef(({ date, onClick }, ref) => {
	const dateAnimationControls = useAnimationControls()
	useImperativeHandle(ref, () => {
		return {
			animate: () => {
				dateAnimationControls.start(dateAnimation.animate)
			},
			initial: () => {
				dateAnimationControls.start(dateAnimation.initial)
			},
		}
	})
	const dateAnimation = {
		initial: {
			scale: 0.7,
			color: "#d1d5db",
			transition: {
				duration: 1,
			},
		},
		animate: {
			color: "#000000",
			scale: 1,
			transition: {
				duration: 1,
			},
		},
	}
	return (
		<motion.div
			initial={dateAnimation.initial}
			animate={dateAnimationControls}
			onClick={onClick}
			className="animate flex w-1/2 shrink-0 cursor-pointer justify-center bg-[#f7f7f7] hover:opacity-75 lg:w-1/3"
		>
			<span className="mx-2 text-4xl font-bold md:mx-3 md:text-6xl">{date}</span>
		</motion.div>
	)
})

const TimelineV3Container = ({ data }) => {
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
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
			id: data?.extra_field?.cta?.attributes?.id,
			class: data?.extra_field?.cta?.attributes?.class,
			rel: data?.extra_field?.cta?.attributes?.rel,
			target: data?.extra_field?.cta?.attributes?.target,
		},
	}
	return <TimelineV3 timeline={timeline} {...widgetData} />
}

export default TimelineV3Container
