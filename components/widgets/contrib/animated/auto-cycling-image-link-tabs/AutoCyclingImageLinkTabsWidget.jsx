import { Icon, Link, Text } from "@/ui"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export const config = {
	id: "vactory_default:54",
}

const AutoCyclingImageLinkTabs = ({ data }) => {
	const [current, setCurrent] = useState(0)
	const containerRef = useRef()
	const isInView = useInView(containerRef, { amount: "some", once: true })

	const items = data.components.map((item, index) => {
		return {
			id: index,
			title: item?.title,
			content: item?.content,
			image: {
				src: item?.image[0]?._default,
				alt: item?.image[0]?.meta?.alt,
				width: item?.image[0]?.meta?.width,
				height: item?.image[0]?.meta?.height,
			},
			url: {
				href: item?.link?.url || "#",
				label: item?.link?.title,
				id: item?.link?.attributes?.id,
				class: item?.link?.attributes?.class,
				rel: item?.link?.attributes?.rel,
				target: item?.link?.attributes?.target,
			},
		}
	})

	useEffect(() => {
		if (isInView) {
			setInterval(() => {
				setCurrent((prev) => {
					if (prev === items.length - 1) return 0
					return prev + 1
				})
			}, 5000)
		}
	}, [isInView])

	const elementContainer = {
		animate: {
			transition: { staggerChildren: 0.2 },
		},
	}

	const image = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 10 },
	}

	return (
		<div className="py-10">
			<div
				ref={containerRef}
				className="relative items-center md:flex md:flex-row md:gap-x-10"
			>
				<div className="relative left-0 z-10 h-[60vh] w-full md:min-h-[70vh] md:w-2/3">
					<AnimatePresence>
						<motion.img
							key={items[current].id}
							variants={image}
							transition={{ duration: 0.8 }}
							src={items[current].image?.src?._original}
							className="absolute inset-0 h-full w-full rounded-xl object-cover shadow-xl"
						/>
					</AnimatePresence>
				</div>
				<div className="relative z-10 w-full px-2 md:w-1/3 md:px-0">
					<motion.div
						initial="initial"
						animate="animate"
						variants={elementContainer}
						className="-mt-[50%] rounded-lg bg-white px-8 py-6 shadow-xl md:mt-0"
					>
						{items.map((item, index) => {
							return (
								<Element
									key={index}
									current={current}
									index={index}
									isInView={isInView}
									{...item}
								/>
							)
						})}
					</motion.div>
				</div>
			</div>
		</div>
	)
}

const Element = ({ current, index, title, content, url, isInView }) => {
	const elementContainer = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
	}
	const progress = {
		initial: {
			width: 0,
		},
		animate: {
			width: "100%",
			transition: { duration: 5 },
		},
		exit: {
			opacity: 0,
		},
	}
	const linkVariant = {
		initial: {
			x: 0,
		},
		hover: {
			x: 5,
		},
	}
	return (
		<motion.div
			variants={elementContainer}
			className="relative mb-2 border-b py-3 md:pb-8"
		>
			<Link {...url}>
				<motion.span
					initial={"initial"}
					whileHover={"hover"}
					className="mb-2 flex items-center gap-x-2 md:mb-3"
				>
					<Text variant="large" className="font-medium">
						{title}
					</Text>
					<motion.span variants={linkVariant}>
						<Icon id="chevron-right" className="h-3 w-3" />
					</motion.span>
				</motion.span>
			</Link>

			<Text variant="medium">{content}</Text>
			<AnimatePresence>
				{current === index && isInView && (
					<motion.span
						variants={progress}
						initial="initial"
						animate="animate"
						exit="exit"
						className="absolute bottom-0 left-0 block h-1 w-full bg-primary-500"
					></motion.span>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default AutoCyclingImageLinkTabs
