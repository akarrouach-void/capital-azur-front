import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useMedia } from "@vactorynext/core/hooks"
import { Button, Heading, Icon, Link, Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:78",
}

const Card = ({ icon, title, content, link, isLastElement }) => {
	const cardAnimations = {
		initial: {
			opacity: 0,
			y: -20,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
			},
		},
	}
	return (
		<motion.div
			variants={cardAnimations}
			whileInView="animate"
			initial="initial"
			viewport={{ once: true }}
			className={vclsx(
				"group relative h-[400px] min-w-[25vw] flex-1 self-stretch md:h-[400px]",
				isLastElement ? "mr-0" : "md:mr-6"
			)}
		>
			<motion.div className="animate relative flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-8 shadow-lg backdrop-blur-sm hover:bg-white hover:shadow-2xl hover:shadow-primary-500/20">
				{/* Subtle background pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-purple-50/20" />
				<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary-100/40 to-transparent" />

				<div className="relative mb-3 flex flex-col items-start gap-4">
					{/* Icon with modern styling */}
					<div className="inline-flex items-center justify-center">
						<div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 shadow-lg shadow-primary-500/25">
							<Icon id={icon} className="h-8 w-8 text-white" />
						</div>
					</div>

					<Heading
						level={3}
						variant="none"
						className="animate text-2xl font-bold text-gray-900 group-hover:text-primary-700"
					>
						{title}
					</Heading>

					<Text variant="cardExcerpt" className="flex-grow leading-relaxed text-gray-600">
						{content}
					</Text>
				</div>

				{/* Link with modern styling */}
				{link?.url ? (
					<Link {...link} variant="permalink" className="mt-auto">
						{link.title}
					</Link>
				) : null}
			</motion.div>
		</motion.div>
	)
}

export const ContentHorizontalScrollCards = ({ title, content, cta, cards }) => {
	const targetRef = useRef(null)
	const cardContainerRef = useRef(null)
	const [scrolledWidth, setScrolledWidth] = useState(null)

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start start", "end end"],
	})

	useEffect(() => {
		const _scrolledWidth =
			cardContainerRef?.current?.getBoundingClientRect()?.width -
			targetRef.current.getBoundingClientRect()?.width
		setScrolledWidth(_scrolledWidth)
	}, [])

	const translateX = useTransform(scrollYProgress, [0, 1], [0, -1 * scrolledWidth])

	const stroke = useTransform(scrollYProgress, [0, 1], [0, 1])
	const isMobile = useMedia("(max-width: 600px)", false)
	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 120 },
		animate: { opacity: 1, y: 0, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
	}

	return (
		<div ref={targetRef} className="w-full md:h-[calc(100vh+200vw)] ">
			<div className="md:sticky md:top-0 md:py-10">
				<div className="relative mb-10">
					<div className="flex w-full items-end justify-between">
						<motion.div
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex w-full flex-col gap-6 md:w-8/12"
						>
							<motion.h2
								variants={titleAnimation}
								className="text-3xl font-bold text-gray-900 md:text-4xl"
							>
								{title}
							</motion.h2>

							<motion.div variants={contentAnimation} className="prose">
								{content}
							</motion.div>

							{cta?.url ? (
								<motion.div variants={ctaAnimation}>
									<Button {...cta} variant="gradient">
										{cta.title}
									</Button>
								</motion.div>
							) : null}
						</motion.div>
						{!isMobile && (
							<div>
								<svg id="progress" width="100" height="100" viewBox="0 0 100 100">
									<circle
										cx="50"
										cy="50"
										r="30"
										pathLength="1"
										className="fill-transparent stroke-primary-400/30 stroke-[20px]"
									/>
									<motion.circle
										cx="50"
										cy="50"
										r="30"
										pathLength="1"
										className="fill-transparent stroke-primary-500 stroke-[20px]"
										style={{ pathLength: stroke }}
									/>
								</svg>
							</div>
						)}
					</div>
				</div>

				<motion.div
					ref={cardContainerRef}
					style={{ x: translateX }}
					className="flex w-full flex-col gap-6 md:min-w-fit md:flex-row"
				>
					{cards.map((card, index) => {
						if (index === cards.length) {
							return <Card key={index} index={index} isLastElement={true} {...card} />
						}

						return <Card key={index} index={index} {...card} />
					})}
				</motion.div>
			</div>
		</div>
	)
}
const ContentHorizontalScrollCardsContainer = ({ data }) => {
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
		cards: data?.components?.map((card) => {
			return {
				icon: card?.icon,
				title: card?.title,
				content: card?.content,
				link: {
					title: card?.link?.title,
					url: card?.link?.url,
					id: card?.link?.attributes?.id,
					class: card?.link?.attributes?.class,
					rel: card?.link?.attributes?.rel,
					target: card?.link?.attributes?.target,
				},
			}
		}),
	}
	return <ContentHorizontalScrollCards {...widgetData} />
}

export default ContentHorizontalScrollCardsContainer
