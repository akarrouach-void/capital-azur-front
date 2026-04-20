import { motion } from "framer-motion"
import { Button, Heading, Icon, Link, Text } from "@/ui"

export const config = {
	id: "vactory_default:77",
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
			variants={cardAnimations}
			className="animate relative flex flex-1 flex-col items-start gap-4 overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-white via-gray-50/30 to-white p-8 shadow-sm hover:shadow-xl hover:shadow-primary-500/10"
		>
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-primary-600 shadow-lg">
				<Icon id={icon} className="h-8 w-8 text-white" />
			</div>

			<Heading
				level={3}
				variant={5}
				className="animate text-xl font-semibold text-gray-900"
			>
				{title}
			</Heading>
			<Text variant="cardExcerpt">{content}</Text>

			{link?.url ? (
				<Link {...link} variant="permalink" className="mt-auto">
					{link.title}
				</Link>
			) : null}
		</motion.div>
	)
}

export const AnimatedCardsV2 = ({ title, content, cta, cards }) => {
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
		<>
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="mx-auto mb-10 flex w-full flex-col items-center gap-4 md:w-2/3"
			>
				<motion.h2
					variants={titleAnimation}
					className="text-center text-3xl font-bold text-gray-900 md:text-4xl"
				>
					{title}
				</motion.h2>

				<motion.div variants={contentAnimation} className="prose text-center">
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
			<motion.div
				whileInView="animate"
				initial="initial"
				viewport={{ once: true }}
				className="flex flex-col gap-5 md:flex-row"
			>
				{cards.map((card, index) => {
					return <Card key={index} index={index} {...card} />
				})}
			</motion.div>
		</>
	)
}

const AnimatedCardsV2Container = ({ data }) => {
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
	return <AnimatedCardsV2 {...widgetData} />
}

export default AnimatedCardsV2Container
