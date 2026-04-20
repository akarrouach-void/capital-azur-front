import { useScroll, motion, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { Waypoint } from "react-waypoint"

import { Container, Heading, Icon, Image, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:82",
}

const Box = ({
	icon,
	title,
	content,
	index,
	setActiveElement,
	isLast = false,
	image,
}) => {
	const boxRef = useRef()
	const handleWaypointEnter = () => {
		setActiveElement(index)
	}

	return (
		<Waypoint topOffset="40%" bottomOffset="40%" onEnter={handleWaypointEnter}>
			<div
				ref={boxRef}
				className={vclsx(
					"flex flex-col gap-6 py-4 md:py-12",
					"lg:py-auto lg:h-[70vh] lg:justify-center lg:gap-4",
					isLast && "mb-16 lg:mb-44"
				)}
			>
				{/* Mobile/Tablet image - only visible below lg */}
				{image && (
					<div className="lg:hidden">
						<div className="aspect-h-3 aspect-w-4 relative overflow-hidden rounded-xl bg-gray-200 shadow-lg">
							<Image
								src={image.src?._original}
								alt={image?.alt}
								width={image?.width}
								height={image?.height}
								className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
							/>
							{/* Overlay for better text contrast */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
						</div>
					</div>
				)}

				{/* Content section */}
				<div className="flex flex-col gap-4">
					{/* Icon and index */}
					<div className="flex items-center gap-4">
						{icon && (
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
								<Icon id={icon} className="h-6 w-6 text-blue-600" />
							</div>
						)}
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
							{String(index + 1).padStart(2, "0")}
						</span>
					</div>

					{/* Title */}
					<Heading
						level={3}
						variant="none"
						className="text-xl font-semibold text-gray-900 md:text-2xl lg:text-xl"
					>
						{title}
					</Heading>

					{/* Content */}
					<div className="prose prose-gray max-w-none [&_p]:m-0 [&_p]:leading-relaxed [&_p]:text-gray-600">
						{content}
					</div>
				</div>
			</div>
		</Waypoint>
	)
}

const StickyImagesWithContent = ({ data }) => {
	const [activeElement, setActiveElement] = useState(0)
	const tragetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: tragetRef,
		offset: ["0 1", "0 0.1"],
	})

	const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

	const imageAnimation = {
		initial: {
			opacity: 0,
			y: 10,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.2,
			},
		},
		exit: {
			opacity: 0,
			y: 10,
		},
	}

	return (
		<div className="relative">
			{/* Desktop sticky image - only visible on lg+ */}
			<motion.div
				ref={tragetRef}
				style={{ x: translateX }}
				className="sticky top-[5vh] box-content hidden h-[95vh] lg:block"
			>
				<div className="relative h-full w-full">
					<AnimatePresence>
						<motion.img
							key={data[activeElement]?.image?.src?._original}
							variants={imageAnimation}
							initial="initial"
							animate="animate"
							exit="exit"
							src={data[activeElement]?.image.src?._original}
							alt={data[activeElement]?.image?.alt}
							width={data[activeElement]?.image?.width}
							height={data[activeElement]?.image?.height}
							className="absolute inset-0 h-full w-full rounded-md object-cover"
						/>
					</AnimatePresence>
				</div>
			</motion.div>

			{/* Content container */}
			<Container>
				<div className="w-full lg:flex lg:justify-end">
					<div className="relative w-full lg:w-6/12 lg:pl-16">
						{data.map((record, index) => {
							if (index === data.length - 1)
								return (
									<Box
										key={index}
										index={index}
										setActiveElement={setActiveElement}
										isLast={true}
										activeElement={activeElement}
										imageAnimation={imageAnimation}
										{...record}
									/>
								)
							return (
								<Box
									key={index}
									index={index}
									setActiveElement={setActiveElement}
									activeElement={activeElement}
									imageAnimation={imageAnimation}
									{...record}
								/>
							)
						})}
					</div>
				</div>
			</Container>
		</div>
	)
}
export const StickyImagesWithContentContainer = ({ data }) => {
	const widgetData = {
		items: data?.components?.map((item) => {
			return {
				image: {
					src: item?.image[0]?._default,
					alt: item?.image[0]?.meta?.alt,
					width: item?.image[0]?.meta?.width,
					height: item?.image[0]?.meta?.height,
				},
				title: item?.title,
				icon: item?.icon,
				content: item?.content?.value["#text"] ? (
					<Wysiwyg html={item?.content?.value["#text"]} />
				) : null,
				link: {
					title: item?.link?.title,
					url: item?.link?.url,
					id: item?.link?.attributes?.id,
					class: item?.link?.attributes?.class,
					rel: item?.link?.attributes?.rel,
					target: item?.link?.attributes?.rel,
				},
			}
		}),
	}
	return <StickyImagesWithContent data={widgetData.items} />
}

export default StickyImagesWithContentContainer
