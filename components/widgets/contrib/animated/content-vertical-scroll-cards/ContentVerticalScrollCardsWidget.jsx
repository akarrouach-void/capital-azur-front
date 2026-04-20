import { motion } from "framer-motion"

import { Button, Heading, Icon, Link, Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:79",
}

const Card = ({ icon, title, content, link, index }) => {
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
				delay: 0.3 * index,
			},
		},
	}
	return (
		<motion.div
			whileInView="animate"
			initial="initial"
			viewport={{ once: true }}
			variants={cardAnimations}
			className={vclsx("relative mb-8 flex-1 ")}
		>
			<motion.div className="animate relative flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-8 shadow-lg backdrop-blur-sm hover:bg-white hover:shadow-2xl hover:shadow-primary-500/20">
				{/* Subtle background pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-purple-50/20" />
				<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary-100/40 to-transparent" />

				<div className="relative mb-8 flex flex-col items-start gap-4">
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

export const ContentVerticalScrollCards = ({ title, content, cta, cards }) => {
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
		<div>
			<div className="flex flex-col justify-between gap-10 md:flex-row md:gap-12">
				<div className="w-full md:w-2/3">
					<div className="sticky top-24">
						<motion.div
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex w-full flex-col gap-6"
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
					</div>
				</div>

				<motion.div className="relative flex w-full flex-col md:w-6/12">
					{cards.map((card, index) => {
						return <Card key={index} index={index} {...card} />
					})}
				</motion.div>
			</div>
		</div>
	)
}

const ContentVerticalScrollCardsContainer = ({ data }) => {
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
	return <ContentVerticalScrollCards {...widgetData} />
}

export default ContentVerticalScrollCardsContainer
