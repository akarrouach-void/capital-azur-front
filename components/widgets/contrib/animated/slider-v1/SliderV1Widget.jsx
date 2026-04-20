import { motion, useAnimationControls } from "framer-motion"
import { forwardRef, useEffect, useRef, useState } from "react"
import { Button, Container, Heading, Icon, Link, Text } from "@/ui"

export const config = {
	id: "vactory_default:80",
}

const Slide = forwardRef(({ image, title, content, link }, ref) => {
	return (
		<div
			className="relative flex shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md md:w-full md:basis-1/2 lg:basis-1/3 max-md:w-[calc(100vw-32px)]"
			ref={ref}
		>
			<div className="relative h-[300px] w-full shrink-0 overflow-hidden">
				<motion.img
					src={image?.src?._original}
					alt={image?.alt}
					width={image?.width}
					height={image?.height}
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			<div className="flex h-full flex-col items-start gap-3 p-7">
				<Heading level={3} variant={5} className="mb-0">
					{title}
				</Heading>
				<Text className="text-base text-gray-400">{content}</Text>
				{link.url ? (
					<Link {...link} variant="permalink" className="mt-auto">
						{link.title}
					</Link>
				) : null}
			</div>
		</div>
	)
})

export const Slider = ({ title, content, cta, slides }) => {
	const cardRef = useRef(null)
	const trackRef = useRef(null)
	const containerRef = useRef(null)
	const currentSlide = useRef(0)
	const trackAnimationControls = useAnimationControls()

	const [cardWidth, setCardWidth] = useState(null)
	const [containerWidth, setContainerWidth] = useState(null)

	useEffect(() => {
		setCardWidth(cardRef.current.getBoundingClientRect().width)
		setContainerWidth(containerRef.current.getBoundingClientRect().width)
	}, [])

	const handleClick = () => {
		trackAnimationControls.start({
			x: -1 * cardWidth * currentSlide.current,
			transition: {
				duration: 1,
				type: "spring",
				stiffness: 50,
				damping: 20,
			},
		})
	}

	const movePrev = () => {
		handleClick()
		currentSlide.current = currentSlide.current - 1 < 0 ? 0 : currentSlide.current - 1
	}
	const moveNext = () => {
		const visibleCards = parseInt(containerWidth / cardWidth)
		const number = slides.length - visibleCards
		handleClick()
		currentSlide.current =
			currentSlide.current + 1 > number ? 0 : currentSlide.current + 1
	}

	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
	}

	return (
		<div style={{ contain: "paint" }}>
			<Container className="mb-4">
				<div ref={containerRef}>
					<div className="mb-10 flex items-end justify-between">
						<motion.div
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex w-8/12 flex-col items-start gap-4"
						>
							<motion.h2
								variants={titleAnimation}
								className="text-3xl font-bold text-gray-900 md:text-4xl"
							>
								{title}
							</motion.h2>

							<motion.p variants={contentAnimation} className="prose">
								{content}
							</motion.p>

							{cta?.url && (
								<motion.div variants={ctaAnimation}>
									<Button {...cta} variant="gradient">
										{cta.title}
									</Button>
								</motion.div>
							)}
						</motion.div>
						<div className="flex gap-2 max-md:hidden">
							<button onClick={movePrev} className="rounded-full bg-gray-100 p-3">
								<Icon id="chevron-left" className="h-4 w-4" />
							</button>
							<button onClick={moveNext} className="rounded-full bg-gray-100 p-3">
								<Icon id="chevron-right" className="h-4 w-4" />
							</button>
						</div>
					</div>
					<motion.div
						ref={trackRef}
						animate={trackAnimationControls}
						className="flex gap-6 overflow-scroll pb-3 md:overflow-visible"
					>
						{slides.map((slide, index) => {
							return <Slide key={index} {...slide} ref={cardRef} />
						})}
					</motion.div>
				</div>
			</Container>
		</div>
	)
}

const SliderV1Container = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
			id: data?.extra_field?.cta?.attributes?.id,
			class: data?.extra_field?.cta?.attributes?.class,
			rel: data?.extra_field?.cta?.attributes?.rel,
			target: data?.extra_field?.cta?.attributes?.target,
		},
		slides: data?.components?.map((slide) => {
			return {
				image: {
					src: slide?.image[0]?._default,
					alt: slide?.image[0]?.meta?._alt,
					width: slide?.image[0]?.meta?._width,
					height: slide?.image[0]?.meta?._height,
				},
				title: slide?.title,
				content: slide?.content,
				link: {
					title: slide?.link?.title,
					url: slide?.link?.url,
					id: slide?.link?.attributes?.id,
					class: slide?.link?.attributes?.class,
					rel: slide?.link?.attributes?.rel,
					target: slide?.link?.attributes?.target,
				},
			}
		}),
	}
	return <Slider {...widgetData} />
}

export default SliderV1Container
