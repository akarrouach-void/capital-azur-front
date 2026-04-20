import { motion, useAnimationControls, useInView } from "framer-motion"
import { useRef } from "react"
import { useUpdateEffect } from "@vactorynext/core/hooks"
import { overlayAnimationsFun, imageAnimationsFun } from "@vactorynext/core/utils"

export const AnimatedImage = ({ src, direction }) => {
	const imageContainer = useRef(null)
	const inView = useInView(imageContainer)
	const overlayAnimationControls = useAnimationControls()
	const imageAnimationControls = useAnimationControls()

	const overlayAnimations = overlayAnimationsFun(direction)
	const imageAnimations = imageAnimationsFun(direction)

	useUpdateEffect(() => {
		overlayAnimationControls.start(overlayAnimations.animate)
		setTimeout(() => {
			imageAnimationControls.start(imageAnimations.animate)
		}, 500)
	}, [inView])

	return (
		<div ref={imageContainer} className="h-full w-full">
			<motion.div
				initial={overlayAnimations.initial}
				animate={overlayAnimationControls}
				className="absolute inset-0 h-full w-full bg-gray-100"
			/>
			<motion.img
				initial={imageAnimations.initial}
				animate={imageAnimationControls}
				src={src}
				className="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
	)
}
