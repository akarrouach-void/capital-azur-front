import { motion } from "framer-motion"
import { Fade, Zoom, Reveal } from "react-awesome-reveal"
import Cookies from "js-cookie"

/* Standard Animation */
export const Animate = ({
	animationType = "fade",
	direction = "",
	triggerOnce = true,
	cascade = false,
	duration = 800,
	delay = 0,
	damping = 0.5,
	className = "",
	children,
}) => {
	if (animationType === "fade") {
		return (
			<Fade
				direction={direction}
				triggerOnce={triggerOnce}
				cascade={cascade}
				duration={duration}
				delay={delay}
				className={className}
				damping={damping}
			>
				{children}
			</Fade>
		)
	} else if (animationType === "zoom") {
		return (
			<Zoom
				direction={direction}
				triggerOnce={triggerOnce}
				cascade={cascade}
				duration={duration}
				delay={delay}
				className={className}
				damping={damping}
			>
				{children}
			</Zoom>
		)
	} else {
		return <div>You specified incorrect animationType</div>
	}
}

/* Custom Animation */
// Just create a custom keyframe and pass it to the CustomAnimation component
export const CustomAnimation = ({
	keyFrame,
	triggerOnce = true,
	cascade = false,
	duration = 800,
	delay = 0,
	damping = 0.5,
	className = "",
	children,
}) => {
	return (
		<Reveal
			keyframes={keyFrame}
			triggerOnce={triggerOnce}
			cascade={cascade}
			duration={duration}
			delay={delay}
			className={className}
			damping={damping}
		>
			{children}
		</Reveal>
	)
}

export const ParentTransition = {
	initial: {
		opacity: 1,
	},
	animate: {
		opacity: 1,
		transition: {
			delayChildren: 0.2,
			staggerChildren: 0.3,
		},
	},
}

export const ChildTransition = (index) => ({
	initial: {
		opacity: 0,
		y: 20,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			damping: 12,
			delay: index * 0.2, // Adjust this value to control the stagger timing
		},
	},
})

export const ChildTransitionFromLeft = (index) => ({
	initial: {
		opacity: 0,
		x: -30,
	},
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			type: "spring",
			damping: 12,
			delay: index * 0.2, // Adjust this value to control the stagger timing
		},
	},
})

// To trim and animate strings
export const MotionTrim = ({ children }) => {
	const isLiveMode = Cookies.get("isLiveMode") === "true"

	return isLiveMode
		? children
		: children
				?.trim()
				?.replace(/(\r\n|\n|\r)/gm, "")
				?.split(" ")
				.map((word) => (
					<motion.span
						key={word}
						variants={{
							initial: {
								opacity: 0,
								y: "2rem",
							},
							animate: {
								opacity: 1,
								y: "0rem",
							},
						}}
						className="whitespace-pre-wrap"
					>
						{`${word} `}
					</motion.span>
				))
}
