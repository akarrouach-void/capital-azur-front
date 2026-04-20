import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { Button, Icon, Image } from "@/ui"

export const config = {
	id: "vactory_default:63",
}

const AnimateImage = forwardRef(({ src }, ref) => {
	const controlsRight = useAnimationControls()
	const controlsLeft = useAnimationControls()
	useImperativeHandle(
		ref,
		() => {
			return {
				enterRight() {
					controlsRight.start({ x: 0, transition: { duration: 0.6 } })
				},
				exitRight() {
					controlsRight.start({
						x: "100%",
						transition: { duration: 0.4 },
						transitionEnd: { x: "-100%" },
					})
				},
				enterLeft: () => {
					controlsLeft.start({ x: 0, transition: { duration: 0.6 } })
				},
				exitLeft: () => {
					controlsLeft.start({
						x: "-100%",
						transition: { duration: 0.4 },
						transitionEnd: { x: "100%" },
					})
				},
			}
		},
		[]
	)
	return (
		<div className="animate group relative h-full w-full overflow-hidden rounded-2xl">
			<motion.div
				initial={{ x: "-100%" }}
				transition={{ duration: 1 }}
				animate={controlsRight}
				className="absolute left-0 top-0 z-30 h-full w-full bg-gray-50"
			></motion.div>
			<motion.div
				initial={{ x: "100%" }}
				transition={{ duration: 1 }}
				animate={controlsLeft}
				className="absolute left-0 top-0 z-30 h-full w-full bg-white"
			></motion.div>

			{/* Main image */}
			<Image
				src={src}
				alt="image alt"
				fill
				className="animate absolute left-0 top-0 z-20 h-full w-full object-cover group-hover:scale-105"
			/>
		</div>
	)
})

const Content = forwardRef(({ title, content, link }, ref) => {
	const contentAnimationControl = useAnimationControls()
	const ctaAnimationControl = useAnimationControls()

	const contentVariants = {
		initial: {
			opacity: 1,
			y: 0,
		},
		animate: {
			opacity: 0,
			y: 20,
			transition: { duration: 0.3 },
		},
	}

	const ctaVariants = {
		initial: {
			opacity: 1,
		},
		animate: {
			opacity: 0,
			transition: { duration: 0.3 },
		},
	}

	useImperativeHandle(
		ref,
		() => {
			return {
				start() {
					contentAnimationControl.start(contentVariants.animate)
					ctaAnimationControl.start(ctaVariants.animate)
				},
				exit() {
					contentAnimationControl.start(contentVariants.initial)
					ctaAnimationControl.start(ctaVariants.initial)
				},
			}
		},
		[]
	)

	return (
		<AnimatePresence>
			<div className="space-y-4">
				<motion.h3
					initial={contentVariants.initial}
					animate={contentAnimationControl}
					className="text-3xl font-bold text-gray-900 md:text-4xl"
				>
					{title}
				</motion.h3>
				<motion.div
					initial={contentVariants.initial}
					animate={contentAnimationControl}
					className="h-1 w-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600"
				/>
				<motion.p
					initial={contentVariants.initial}
					animate={contentAnimationControl}
					className="prose"
				>
					{content}
				</motion.p>
			</div>

			{link?.href ? (
				<motion.div
					initial={ctaVariants.initial}
					animate={ctaAnimationControl}
					className="mt-4"
				>
					<Button {...link} variant="gradient" className="w-fit">
						{link.title}
						<Icon id="chevron-right" className="h-4 w-4" />
					</Button>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
})

const Handlers = ({ moveNext, movePrev }) => {
	const handlersVariants = {
		visible: {
			opacity: 1,
		},
		hidden: {
			opacity: 0,
		},
	}

	return (
		<div>
			<motion.div
				variants={handlersVariants}
				animate="visible"
				exit="hidden"
				className="flex items-center gap-x-3"
			>
				<button
					onClick={movePrev}
					className="group flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:shadow-lg"
				>
					<Icon
						id="chevron-left"
						className="h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-primary-600"
					/>
				</button>
				<button
					onClick={moveNext}
					className="group flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:shadow-lg"
				>
					<Icon
						id="chevron-right"
						className="h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-primary-600"
					/>
				</button>
			</motion.div>
		</div>
	)
}

const pad = (deg) => {
	return ("0" + deg).slice(-2)
}

const Indicators = ({ current, data }) => {
	return (
		<div className="flex items-center space-x-4">
			{/* Progress dots */}
			<div className="flex items-center space-x-2">
				{data.map((_, index) => (
					<div
						key={index}
						className={`h-2 w-2 rounded-full transition-all duration-300 ${
							index === current
								? "w-6 bg-gradient-to-r from-primary-600 to-purple-600"
								: "bg-gray-300 hover:bg-gray-400"
						}`}
					/>
				))}
			</div>

			{/* Counter */}
			<div className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1.5">
				<span className="text-sm font-semibold tabular-nums text-gray-900">
					{pad(current + 1)}
				</span>
				<span className="text-sm text-gray-500">/</span>
				<span className="text-sm tabular-nums text-gray-500">{pad(data.length)}</span>
			</div>
		</div>
	)
}

const ContentSliderLeftImageRightCard = ({ data }) => {
	const [current, setCurrent] = useState(0)
	const bigImageRef = useRef()
	const smallImageRef = useRef()
	const contentRef = useRef()

	const interval = useRef()

	useEffect(() => {
		interval.current = setInterval(() => {
			moveNext()
		}, 10000)
		return () => {
			clearInterval(interval.current)
		}
	}, [current])

	const moveNext = () => {
		bigImageRef?.current?.enterRight()
		smallImageRef?.current?.enterRight()
		contentRef?.current?.start()

		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === data.length - 1) return 0
				return prev + 1
			})

			bigImageRef?.current?.exitRight()
			smallImageRef?.current?.exitRight()
			contentRef?.current?.exit()
		}, 600)
	}

	const movePrev = () => {
		bigImageRef.current.enterLeft()
		smallImageRef.current.enterLeft()
		contentRef.current.start()

		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === 0) {
					return data.length - 1
				}
				return prev - 1
			})
			bigImageRef.current.exitLeft()
			smallImageRef.current.exitLeft()
			contentRef.current.exit()
		}, 600)
	}

	return (
		<div className="relative overflow-hidden">
			<div className="relative">
				{/* Background decorative elements */}
				<div className="to-secondary-100 absolute -right-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-primary-100 opacity-20 blur-3xl" />
				<div className="to-secondary-50 absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-primary-50 opacity-30 blur-3xl" />

				<div className="relative flex flex-col gap-8 lg:flex-row">
					{/* Large Image Section */}
					<div className="w-full lg:w-7/12">
						<div className="relative h-[400px] md:h-[500px] lg:h-full">
							<AnimateImage ref={bigImageRef} src={data[current].bigImage} />
						</div>
					</div>

					{/* Content Section */}
					<div className="w-full lg:h-fit lg:w-5/12">
						<div className="relative h-full rounded-2xl border bg-white p-5">
							<div className="flex h-full flex-col justify-between space-y-8">
								{/* Small Image */}
								<div className="relative h-[250px] w-full md:h-[300px] lg:h-[350px]">
									<AnimateImage ref={smallImageRef} src={data[current].smallImage} />
								</div>

								{/* Content */}
								<div className="flex flex-grow flex-col">
									<Content ref={contentRef} {...data[current]} />
								</div>

								{/* Controls */}
								<div className="flex items-center justify-between border-t border-gray-100 pt-6">
									<Handlers movePrev={movePrev} moveNext={moveNext} />
									<Indicators current={current} data={data} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ContentSliderLeftImageRightCardContainer = ({ data }) => {
	const widgetData = data?.components?.map((slide) => {
		return {
			title: slide?.title,
			content: slide?.content,
			bigImage: slide?.bigImage[0]?._default,
			smallImage: slide?.smallImage[0]?._default,
			link: {
				title: slide?.link?.title,
				href: slide?.link?.url,
				rel: slide?.link?.attributes?.rel,
				id: slide?.link?.attributes?.id,
				class: slide?.link?.attributes?.class,
				target: slide?.link?.attributes?.target,
			},
		}
	})
	return <ContentSliderLeftImageRightCard data={widgetData} />
}

export default ContentSliderLeftImageRightCardContainer
