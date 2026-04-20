import { Heading, Icon, Link, Text, Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:62",
}

const container = {
	initial: { opacity: 0 },
	animate: {
		opacity: 1,
		transition: { staggerChildren: 0.15 },
	},
}

const items = {
	initial: {
		opacity: 0,
		x: -60,
		scale: 0.95,
	},
	animate: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: [0.25, 0.46, 0.45, 0.94],
		},
	},
}

const Card = ({ title, content, link }) => {
	return (
		<motion.div
			variants={items}
			initial="initial"
			whileInView="animate"
			viewport={{ once: true }}
			className="animate group relative w-full rounded-2xl border border-primary-50 bg-white shadow-sm backdrop-blur-sm hover:shadow-lg hover:shadow-gray-50"
		>
			<div className="absolute left-0 right-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent" />

			{link.url ? (
				<Link href={link.url} className="inline-block w-full p-4 md:p-6">
					<Heading
						level={3}
						variant="none"
						className="animate group flex items-center justify-between gap-x-4 text-xl font-semibold text-gray-900 hover:text-primary-600 md:text-2xl"
					>
						{title}
						<Icon
							id="chevron-right"
							className="animate h-4 w-4 text-primary-500 group-hover:translate-x-1 group-hover:opacity-100 md:opacity-0"
						/>
					</Heading>
					<div className="prose-sm [&_p]:mb-0">{content}</div>
				</Link>
			) : (
				<div className="p-4 md:p-6">
					<Heading
						level={3}
						variant="none"
						className="text-xl font-semibold text-gray-900 md:text-2xl"
					>
						{title}
					</Heading>
					<div className="prose-sm [&_p]:mb-0">{content}</div>
				</div>
			)}
		</motion.div>
	)
}

const StickyContentSideCards = ({ title, content, cards }) => {
	return (
		<div className="relative">
			<div className="flex flex-col justify-between gap-8 md:flex-row md:gap-20">
				<div className="w-full md:w-5/12">
					<div className="sticky top-24">
						<Heading
							level={2}
							variant="none"
							className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl"
						>
							{title}
						</Heading>
						<div className="my-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary-600 to-purple-600" />
						<Text className="prose prose-lg leading-relaxed text-gray-600">
							{content}
						</Text>
					</div>
				</div>

				<motion.div
					variants={container}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="relative flex w-full flex-col gap-y-4 md:w-7/12"
				>
					{cards.map((card, index) => {
						return <Card key={index} {...card} />
					})}
				</motion.div>
			</div>
		</div>
	)
}

const StickyContentSideCardsContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		link: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
			id: data?.extra_field?.cta?.attributes?.id,
			class: data?.extra_field?.cta?.attributes?.class,
			rel: data?.extra_field?.cta?.attributes?.rel,
			target: data?.extra_field?.cta?.attributes?.target,
		},
		cards: data?.components?.map((card) => {
			return {
				title: card?.title,
				content: card?.content?.value["#text"] ? (
					<Wysiwyg html={card?.content?.value["#text"]} />
				) : null,
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

	return <StickyContentSideCards {...widgetData} />
}

export default StickyContentSideCardsContainer
