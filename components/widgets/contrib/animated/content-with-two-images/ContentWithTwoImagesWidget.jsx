import { Button, Heading, Wysiwyg } from "@/ui"
import { motion, useAnimationControls, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

export const config = {
	id: "vactory_default:59",
}

const ContentWithTwoImages = ({ title, content, cta, bigImage, smallImage }) => {
	const containerRef = useRef(null)
	const isInView = useInView(containerRef, { amount: "some", once: true })
	const overlayControls = useAnimationControls()

	const image = {
		initial: { x: 0 },
		animate: { x: "-100%" },
	}

	useEffect(() => {
		if (isInView) {
			overlayControls.start(image.animate)
		}
	}, [isInView])

	return (
		<div ref={containerRef} className="mx-auto max-w-screen-xl md:mb-[200px]">
			<div className="flex flex-col gap-6 md:flex-row md:gap-20">
				<div className="relative flex flex-col items-start md:flex-1">
					<Heading level={2} variant="none" className="text-3xl font-bold md:text-4xl">
						{title}
					</Heading>
					<div className="prose">{content}</div>
					{cta?.href && (
						<Button href={cta.href} variant="gradient">
							{cta.text}
						</Button>
					)}
				</div>
				<div className="relative md:flex-1 max-md:overflow-hidden max-md:rounded-2xl">
					<div className="relative h-full w-full overflow-hidden md:rounded-r-2xl md:rounded-tl-2xl">
						<motion.div
							variants={image}
							animate={overlayControls}
							initial="initial"
							transition={{ duration: 1.4 }}
							className="absolute right-0 top-0 z-40 hidden h-full w-full bg-white md:block"
						></motion.div>
						<motion.img
							src={bigImage?.src?._original}
							className="h-full w-full object-cover md:absolute md:right-0 md:top-0"
						/>
					</div>
					<div className="overflow-hidden md:absolute md:right-full md:top-full md:h-[200px] md:w-1/2 md:rounded-b-2xl md:rounded-tl-2xl">
						<motion.div
							variants={image}
							animate={overlayControls}
							initial="initial"
							transition={{ delay: 0.8, duration: 1.4 }}
							className="relative z-40 hidden h-full w-full bg-white md:block"
						></motion.div>
						<motion.img
							src={smallImage?.src?._original}
							className="h-full w-full object-cover md:absolute md:left-0 md:top-0 md:z-30"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

const ContentWithTwoImagesContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: data?.components[0]?.content?.value["#text"] ? (
			<Wysiwyg html={data?.components[0]?.content?.value["#text"]} />
		) : null,
		cta: {
			text: data?.components[0]?.cta?.title,
			href: data?.components[0]?.cta?.url,
			id: data?.components[0]?.cta?.attributes?.id,
			class: data?.components[0]?.cta?.attributes?.class,
			rel: data?.components[0]?.cta?.attributes?.rel,
			target: data?.components[0]?.cta?.attributes?.target,
		},
		bigImage: {
			src: data?.components[0]?.bigImage[0]?._default,
			alt: data?.components[0]?.bigImage[0]?.meta?.alt,
			width: data?.components[0]?.bigImage[0]?.meta?.width,
			height: data?.components[0]?.bigImage[0]?.meta?.height,
		},
		smallImage: {
			src: data?.components[0]?.smallImage[0]?._default,
			alt: data?.components[0]?.smallImage[0]?.meta?.alt,
			width: data?.components[0]?.smallImage[0]?.meta?.width,
			height: data?.components[0]?.smallImage[0]?.meta?.height,
		},
	}
	return <ContentWithTwoImages {...widgetData} />
}

export default ContentWithTwoImagesContainer
