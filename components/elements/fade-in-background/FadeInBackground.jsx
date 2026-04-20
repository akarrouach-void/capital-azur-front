// import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { vclsx } from "@vactorynext/core/utils"
import { motion, useScroll, useTransform } from "framer-motion"

export const FadeInBackground = () => {
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		// Set a timeout to simulate loading time
		const timeout = setTimeout(() => {
			setIsLoaded(true)
		}, 500)

		return () => clearTimeout(timeout)
	}, [])

	const ref = useRef(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	})

	const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])

	return (
		<div
			className={vclsx(
				"animate max-lg::hidden pointer-events-none absolute inset-0 overflow-clip",
				isLoaded ? "opacity-100" : "opacity-0"
			)}
		>
			<motion.div ref={ref} className="relative -z-10 h-full w-full">
				<motion.div
					style={{
						y: bgY,
					}}
					className="bottom-overflow-fade absolute bottom-0 left-0 right-0 top-[40vh] -z-10 bg-[url('/assets/img/bg_pattern_desktop.svg')] bg-[size:100%_auto] bg-repeat-y"
				></motion.div>
			</motion.div>
		</div>
	)
}

export default FadeInBackground
