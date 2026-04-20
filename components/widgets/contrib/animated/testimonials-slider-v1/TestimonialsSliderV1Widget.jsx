import { Icon } from "@/ui"
import { useAnimationControls, motion } from "framer-motion"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"

export const config = {
	id: "vactory_default:81",
}

const AnimateImage = forwardRef(({ src }, ref) => {
	const targetRef = useRef()
	const leftOverlayControls = useAnimationControls()
	const rightOverlayControls = useAnimationControls()

	useImperativeHandle(ref, () => {
		return {
			triggerLeftOverlayAnimation: () => {
				triggerLeftOverlayAnimation()
			},
			triggerRightOverlayAnimation: () => {
				triggerRightOverlayAnimation()
			},
			startImageAnimation: () => {},
		}
	})

	const toLeftoverlayAnimations = {
		initial: { clipPath: "inset(0% 0% 0% 100%)" },
		start: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
		},
		end: {
			clipPath: "inset(0% 100% 0% 0%)",
			transition: {
				duration: 1,
				transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
			},
			transitionEnd: {
				clipPath: "inset(0% 0% 0% 100%)",
			},
		},
	}

	const toRightoverlayAnimations = {
		initial: { clipPath: "inset(0% 100% 0% 0%)" },
		start: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
		},
		end: {
			clipPath: "inset(0% 0% 0% 100%)",
			transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
			transitionEnd: {
				clipPath: "inset(0% 100% 0% 0%)",
			},
		},
	}

	const imageAnimation = {
		initial: {
			clipPath: "inset(100% 0% 0% 0%)",
			transition: { duration: 1 },
		},
		animate: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1 },
		},
	}

	const triggerLeftOverlayAnimation = async () => {
		await leftOverlayControls.start(toLeftoverlayAnimations.start)
		return leftOverlayControls.start(toLeftoverlayAnimations.end)
	}

	const triggerRightOverlayAnimation = async () => {
		await rightOverlayControls.start(toRightoverlayAnimations.start)
		return rightOverlayControls.start(toRightoverlayAnimations.end)
	}

	return (
		<div ref={targetRef} className="absolute h-full w-full overflow-hidden">
			<motion.div
				initial={toLeftoverlayAnimations.initial}
				animate={leftOverlayControls}
				className="absolute z-30 h-full w-full bg-white"
			></motion.div>
			<motion.div
				initial={toRightoverlayAnimations.initial}
				animate={rightOverlayControls}
				className="absolute z-30 h-full w-full bg-white"
			></motion.div>
			<motion.img
				initial={imageAnimation.initial}
				whileInView={imageAnimation.animate}
				viewport={{ once: true }}
				src={src?._original}
				className="absolute inset-0 z-20 h-full w-full object-cover "
			/>
		</div>
	)
})

export const TestimonialsSliderV1 = ({ testimonials }) => {
	const [current, setCurrent] = useState(0)
	const imageRef = useRef(null)
	const nextImage = useRef(null)
	const testimonialAnimationControls = useAnimationControls()

	const testimonialAnimation = {
		initial: {
			opacity: 1,
			transition: {
				duration: 0.6,
			},
		},
		animate: {
			opacity: 0,
			transition: {
				duration: 1,
			},
		},
	}

	const getNextCurrent = (current) => {
		if (current >= testimonials.length - 1) return 0
		return current + 1
	}

	const triggerTestimonialAnimation = async () => {
		await testimonialAnimationControls.start(testimonialAnimation.animate)
		return testimonialAnimationControls.start(testimonialAnimation.initial)
	}

	const movePrev = () => {
		triggerTestimonialAnimation()
		imageRef.current.triggerLeftOverlayAnimation()
		nextImage.current.triggerLeftOverlayAnimation()
		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === 0) {
					return testimonials.length - 1
				}
				return prev - 1
			})
		}, 1000)
	}

	const moveNext = () => {
		triggerTestimonialAnimation()
		imageRef.current.triggerRightOverlayAnimation()
		nextImage.current.triggerRightOverlayAnimation()

		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === testimonials.length - 1) {
					return 0
				}
				return prev + 1
			})
		}, 1000)
	}

	const throttle = (fn, delay) => {
		var wait = false
		return (...args) => {
			if (!wait) {
				wait = true
				fn.apply(null, [...args])
				setTimeout(() => {
					wait = false
				}, delay)
			}
		}
	}

	return (
		<div className="lg:py-22 relative pb-14">
			{/* Main content card */}
			<div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-gray-200/50 backdrop-blur-sm">
				{/* Decorative gradient overlay */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

				<div className="flex flex-col gap-0 lg:flex-row">
					{/* Image section */}
					<div className="relative w-full lg:w-5/12">
						<div className="aspect-h-4 aspect-w-3 relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200 lg:aspect-h-4 lg:aspect-w-3 lg:rounded-l-3xl lg:rounded-tr-none">
							<AnimateImage src={testimonials[current].image?.src} ref={imageRef} />
							{/* Image overlay gradient for better text contrast */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
						</div>
					</div>

					{/* Content section */}
					<div className="flex w-full flex-col gap-4 p-6 md:gap-8 md:p-12 lg:w-7/12">
						{/* Navigation */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<button
									onClick={throttle(movePrev, 2000)}
									className="animate group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-l from-blue-500 to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700"
								>
									<Icon id="chevron-left" className="animate h-5 w-5 text-white" />
								</button>
								<button
									onClick={throttle(moveNext, 2000)}
									className="animate group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700"
								>
									<Icon id="chevron-right" className="h-5 w-5 text-white" />
								</button>
							</div>

							{/* Testimonial counter */}
							<div className="hidden items-center space-x-2 md:flex">
								<span className="text-sm font-medium text-gray-500">
									{current + 1} / {testimonials.length}
								</span>
								<div className="flex space-x-1">
									{testimonials.map((_, index) => (
										<div
											key={index}
											className={`animate h-2 w-2 rounded-full ${
												index === current
													? "bg-gradient-to-r from-blue-500 to-indigo-600"
													: "bg-gray-300"
											}`}
										/>
									))}
								</div>
							</div>
						</div>

						<motion.div
							initial={testimonialAnimation.initial}
							animate={testimonialAnimationControls}
							className="flex flex-col gap-4"
						>
							{/* Testimonial text */}
							<motion.blockquote className="max-w-4xl text-lg font-light leading-relaxed text-gray-800 md:text-2xl max-md:mb-14">
								{testimonials[current].testimonial}
							</motion.blockquote>

							{/* Author info */}
							<div className="flex flex-col gap-1">
								<motion.h4 className="text-base font-semibold text-gray-900">
									{testimonials[current].author}
								</motion.h4>
								<motion.p className="text-sm font-medium text-gray-600">
									{testimonials[current].position}
								</motion.p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Next image preview - floating card */}
			<div className="group absolute -bottom-2 right-2 w-28 rotate-3 transform transition-transform duration-500 hover:rotate-0 md:bottom-8 md:right-8 md:w-36 lg:bottom-0 lg:right-16 lg:w-44">
				<div className="animate aspect-h-4 aspect-w-3 relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl shadow-gray-300/50 group-hover:shadow-2xl">
					<AnimateImage
						src={testimonials[getNextCurrent(current)].image?.src}
						ref={nextImage}
					/>
				</div>
			</div>
		</div>
	)
}

export const TestimonialsSliderV1Container = ({ data }) => {
	const testimonials = data?.components?.map((testimonial) => {
		return {
			image: {
				src: testimonial?.image[0]?._default,
				alt: testimonial?.image[0]?.meta?.alt,
				width: testimonial?.image[0]?.meta?.width,
				height: testimonial?.image[0]?.meta?.height,
			},
			testimonial: testimonial?.testimonial,
			author: testimonial?.author,
			position: testimonial?.position,
		}
	})
	return <TestimonialsSliderV1 testimonials={testimonials} />
}

export default TestimonialsSliderV1Container
