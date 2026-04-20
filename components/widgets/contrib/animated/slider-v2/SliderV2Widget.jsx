import { useAnimationControls, motion, AnimatePresence } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import { Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:83",
}

const Slide = forwardRef(({ index, item }, ref) => {
	const slideAnimationControl = useAnimationControls()
	const imageAnimationControl = useAnimationControls()
	useImperativeHandle(ref, () => {
		return {
			show: () => {
				slideAnimationControl.start(slideAnimation.animate)
			},
			byPass: () => {
				slideAnimationControl.start(slideAnimation.byPass)
			},
			byPassRight: () => {
				slideAnimationControl.start(slideAnimation.initial)
			},
			imageMoveRight: () => {
				imageAnimationControl.start(imageAnimation.moveRight)
			},
			imageMoveLeft: () => {
				imageAnimationControl.start(imageAnimation.moveLeft)
			},
		}
	})
	const slideAnimation = {
		initial: {
			clipPath: "inset(0% 0% 0% 100%)",
			transition: { duration: 1 },
		},
		animate: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1 },
		},
		byPass: {
			clipPath: "inset(0% 100% 0% 0%)",
			transition: { duration: 1 },
		},
	}

	const imageAnimation = {
		initial: {
			x: 0,
			transition: { duration: 1 },
		},
		moveRight: {
			x: 0,
			transition: { duration: 1 },
		},
		moveLeft: {
			x: 100,
			transition: { duration: 1 },
		},
	}
	return (
		<motion.div
			initial={slideAnimation.initial}
			animate={slideAnimationControl}
			className={vclsx(`z-[${index * 10}]`, "absolute inset-0 w-full")}
		>
			<div className="absolute z-[100] h-full w-full bg-black/30"></div>
			<div className="absolute h-full w-full bg-black/30">
				<motion.img
					src={item.image.src?._original}
					alt={item.image.alt}
					width={item.image.width}
					height={item.image.height}
					initial={imageAnimation.initial}
					animate={imageAnimationControl}
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</motion.div>
	)
})

export const Slider = ({ items }) => {
	const [current, setCurrent] = useState(0)
	const elementsRef = useRef(new Array())

	const handleNext = () => {
		setCurrent((prev) => {
			if (prev === items.length - 1) {
				return prev
			}
			elementsRef.current[current].byPass()
			elementsRef.current[current + 1].show()
			elementsRef.current[current + 1].imageMoveRight()
			return prev + 1
		})
	}
	const handlePrev = () => {
		setCurrent((prev) => {
			if (prev === 0) {
				return prev
			}
			elementsRef.current[current - 1].show()
			elementsRef.current[current].byPassRight()
			elementsRef.current[current].imageMoveLeft()
			return prev - 1
		})
	}

	const textAnimation = {
		initial: { opacity: 0, y: 50 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
		exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
	}

	const contentAnimation = {
		initial: { opacity: 0, y: 80 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } },
		exit: { opacity: 0, y: 80, transition: { duration: 0.4 } },
	}

	useEffect(() => {
		elementsRef.current[0].show()
	}, [])

	return (
		<div className="relative mb-7">
			<div className="relative w-full">
				<div
					style={{ contain: "paint" }}
					className="relative flex h-[70vh] w-full md:h-[800px]"
				>
					{items.map((item, index) => {
						return (
							<Slide
								key={index}
								ref={(element) => {
									elementsRef.current.push(element)
								}}
								item={item}
								current={current}
								index={index}
							/>
						)
					})}
				</div>
				<div className="absolute left-1/2 top-1/2 h-fit w-full -translate-x-1/2 -translate-y-1/2  px-3 md:w-2/3">
					<AnimatePresence mode="wait">
						<motion.div
							key={items[current].id}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<motion.p
								variants={textAnimation}
								className="mb-5 text-center text-3xl font-bold uppercase text-white md:text-6xl"
							>
								{items[current].title}
							</motion.p>
							<motion.div
								variants={contentAnimation}
								className="prose text-center text-white"
							>
								{items[current].content}
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 right-0 mx-auto flex w-full translate-y-1/2 justify-between gap-x-3 rounded-md  bg-white md:w-2/3">
				<button
					onClick={handlePrev}
					className={vclsx(
						"bg-black p-4 text-white",
						current === 0 ? "cursor-not-allowed bg-gray-200 p-4" : "bg-black text-white"
					)}
				>
					<Icon id="chevron-left" className="h-6 w-6" />
				</button>
				<div className="flex items-center gap-x-2">
					{Array.from({ length: items.length }).map((_, index) => {
						return (
							<span
								key={index}
								className={vclsx(
									"h-1 w-4",
									index === current ? "bg-black" : "bg-gray-200"
								)}
							></span>
						)
					})}
				</div>
				<button
					onClick={handleNext}
					className={vclsx(
						"bg-black p-4 text-white",
						current === items.length - 1
							? "cursor-not-allowed bg-gray-200 p-4"
							: "bg-black text-white"
					)}
				>
					<Icon id="chevron-right" className="h-6 w-6" />
				</button>
			</div>
		</div>
	)
}

const SliderV2Container = ({ data }) => {
	const slidesData = data?.components?.map((slide, index) => {
		return {
			id: index,
			image: {
				src: slide?.image[0]?._default,
				alt: slide?.image[0]?.meta?.alt,
				width: slide?.image[0]?.meta?.width,
				height: slide?.image[0]?.meta?.height,
			},
			title: slide?.title,
			content: slide?.content?.value["#text"] ? (
				<Wysiwyg html={slide?.content?.value["#text"]} />
			) : null,
			link: {
				title: slide?.link?.title,
				url: slide?.link?.url,
				id: slide?.link?.attributes?.id,
				class: slide?.link?.attributes?.class,
				rel: slide?.link?.attributes?.rel,
				target: slide?.link?.attributes?.rel,
			},
		}
	})

	return <Slider items={slidesData} />
}

export default SliderV2Container
