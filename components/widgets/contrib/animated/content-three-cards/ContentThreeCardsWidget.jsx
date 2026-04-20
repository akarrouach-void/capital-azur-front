import { Heading, Icon, Image, Link, Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:61",
}

const Card = ({ title, content, image, link }) => {
	const card = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5 } },
	}

	return (
		<motion.div variants={card} className="group relative flex-1">
			<Link
				href={link?.url}
				className="group inline-block h-full overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl"
			>
				<div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden">
					<Image
						src={image?.src?._original}
						alt={image?.alt}
						width={image?.width}
						height={image?.height}
						className="animate absolute left-0 top-0 h-full w-full object-cover group-hover:scale-105"
					/>
				</div>

				<div className="group relative flex h-full flex-col items-start p-6">
					<Heading
						level={4}
						variant={6}
						className="flex w-full items-center justify-between"
					>
						{title}
						<Icon
							id="chevron-right"
							className="animate h-4 w-4 text-primary-500 group-hover:translate-x-1"
						/>
					</Heading>

					{content && <div className="prose-sm [&_p]:m-0">{content}</div>}
				</div>
			</Link>
		</motion.div>
	)
}

const ContentThreeCards = ({ title, content, cards }) => {
	const listContainer = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: { staggerChildren: 0.3 },
		},
	}
	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 120 },
		animate: { opacity: 1, y: 0, transition: { duration: 1.3 } },
	}

	return (
		<>
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="mb-6 flex flex-col items-center gap-4 md:mb-8"
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
			</motion.div>

			<motion.div
				whileInView="animate"
				whileHover="hover"
				initial="initial"
				viewport={{ once: true }}
				variants={listContainer}
				className="grid grid-cols-1 gap-4 md:grid-cols-3"
			>
				{cards.map((card, index) => {
					return <Card key={index} {...card} />
				})}
			</motion.div>
		</>
	)
}

const ContentThreeCardsContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cards: data?.components?.map((card) => {
			return {
				title: card?.title,
				content: card?.content?.value["#text"] ? (
					<Wysiwyg html={card?.content?.value["#text"]} />
				) : null,
				image: {
					src: card?.image[0]?._default,
					alt: card?.image[0]?.meta?.alt,
					width: card?.image[0]?.meta?.width,
					height: card?.image[0]?.meta?.height,
				},
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
	return <ContentThreeCards {...widgetData} />
}

export default ContentThreeCardsContainer
