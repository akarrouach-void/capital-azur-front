import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import YouTube from "react-youtube"
import { Icon } from "../icon/Icon"

const Trigger = ({ trigger, openVideo }) => {
	const triggerRef = useRef()
	const handleModalOpening = () => {
		const elementCords = triggerRef.current.getBoundingClientRect()
		openVideo(elementCords)
	}
	return (
		<motion.div
			ref={triggerRef}
			className="relative inline-block h-full w-full"
			onClick={handleModalOpening}
		>
			{trigger}
		</motion.div>
	)
}

const Modal = forwardRef(({ videoId }, ref) => {
	const [isVideoVisible, setIsVideoVisible] = useState(false)
	const [clientRect, setClientRect] = useState(null)

	useImperativeHandle(ref, () => {
		return {
			open: (elementCords) => {
				setClientRect(elementCords)
				setIsVideoVisible(true)
			},
		}
	})

	const closeVideoPlayer = () => {
		setIsVideoVisible(false)
	}

	return (
		<AnimatePresence mode="wait">
			{isVideoVisible && (
				<ModalContent
					videoId={videoId}
					clientRect={clientRect}
					closeVideoPlayer={closeVideoPlayer}
				/>
			)}
		</AnimatePresence>
	)
})

const ModalContent = ({ videoId, clientRect, closeVideoPlayer }) => {
	let width
	let height

	if (typeof window !== "undefined") {
		width = window.innerWidth * 0.8
		height = width / (16 / 9)
	}

	const [isVideoRunning, setIsVideoRunning] = useState(false)

	const overlayVariants = {
		initial: {
			opacity: 0,
		},
		animate: {
			opacity: 1,
			transition: { duration: 0.8 },
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.8 },
		},
	}
	const videoVariants = {
		initial: {
			width: clientRect?.width,
			height: clientRect?.height,
			top: clientRect?.top,
			left: clientRect?.left,
		},
		animate: {
			width: `${width}px`,
			height: `${height}px`,
			left: "50%",
			x: "-50%",
			top: "50%",
			y: "-50%",
			transition: { duration: 1, delay: 0.2 },
		},
		exit: {
			opacity: 0,
			y: 100,
			transition: { duration: 0.2 },
		},
	}
	const closeHandlerVariants = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { delay: 0.6 } },
		exit: { opacity: 0, transition: { duration: 0 } },
	}

	const opts = {
		playerVars: {
			autoplay: 1,
			rel: 0,
		},
	}

	useEffect(() => {
		setTimeout(() => {
			setIsVideoRunning(true)
		}, 1000)
	}, [])

	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			className="fixed inset-0 z-[1000] h-screen w-screen"
		>
			<motion.div
				variants={overlayVariants}
				className="fixed inset-0 h-screen w-screen bg-black/40"
			></motion.div>
			<motion.div
				variants={videoVariants}
				onClick={closeVideoPlayer}
				className="fixed rounded-md bg-black"
			>
				<div className="group relative h-full w-full">
					<motion.div
						variants={closeHandlerVariants}
						className="absolute bottom-full right-0 z-50 mb-1 rtl:left-0"
					>
						<button
							onClick={(e) => {
								e.stopPropagation()
								closeVideoPlayer()
							}}
							type="button"
							className="rounded-md bg-black bg-opacity-50 p-2 text-white hover:text-primary-300"
						>
							<Icon id={"x"} className="h-5 w-5" />
						</button>
					</motion.div>

					{isVideoRunning && (
						<YouTube
							id={videoId}
							opts={opts}
							videoId={videoId}
							iframeClassName="w-full h-full rounded-md"
							className="absolute bottom-0 left-0 top-0 my-auto h-full w-full rounded-md"
						/>
					)}
				</div>
			</motion.div>
		</motion.div>
	)
}

export const AnimatedVideoModal = ({ children, videoId }) => {
	const videoPlayer = useRef(null)
	const openVideo = (elementCords) => {
		videoPlayer.current.open(elementCords)
	}
	return (
		<>
			<Trigger trigger={children} openVideo={openVideo} />
			<Modal ref={videoPlayer} videoId={videoId} />
		</>
	)
}

export default AnimatedVideoModal
