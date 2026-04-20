import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button, Heading, Icon, Link, Text } from "@/ui"

export const config = {
	id: "vactory_default:76",
}

const Card = ({ index, icon, title, content, link, scrollYProgress }) => {
	const translateY = useTransform(scrollYProgress, [0, 1], [index * 100, 0])
	return (
		<motion.div
			style={{ y: translateY }}
			className="relative flex flex-1 flex-col items-start gap-4 rounded-2xl bg-white p-7 shadow-md"
		>
			<div className="absolute left-0 right-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
			<Icon id={icon} className="h-10 w-10" />
			<Heading level={3} variant={5}>
				{title}
				<span className="block h-1 w-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600" />
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

export const AnimatedCardsV1 = ({ title, content, cta, cards }) => {
	const containerRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end 0.7"],
	})

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
				ref={containerRef}
				className="flex flex-col gap-5 md:flex-row"
			>
				{cards.map((card, index) => {
					return (
						<Card scrollYProgress={scrollYProgress} key={index} index={index} {...card} />
					)
				})}
			</motion.div>
		</>
	)
}

const AnimatedCardsV1Container = ({ data }) => {
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

	return <AnimatedCardsV1 {...widgetData} />
}

export default AnimatedCardsV1Container
