import { Container, Icon, Link, Text, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:60",
}

const cardsContainer = {
	animate: {
		transition: {
			staggerChildren: 0.3,
		},
	},
}

const cardContainer = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
}

const ThreeCardWithImage = ({ title, content, image, cards }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})

	const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

	return (
		<div className="relative">
			<div className="mx-auto px-4">
				<motion.h3
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl"
					transition={{ type: "ease", duration: 1 }}
				>
					{title}
				</motion.h3>
				<motion.div className="prose text-center md:mx-auto md:w-2/3">
					{content}
				</motion.div>
				<Container className="mx-auto mt-8 flex flex-col items-center">
					<motion.div
						variants={cardsContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, amount: 0.3 }}
						className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3"
					>
						{cards.map((card, index) => {
							return (
								<motion.div
									key={index}
									variants={cardContainer}
									className="animate group flex flex-col items-center gap-4 rounded-xl bg-white p-5 shadow-lg hover:scale-105 hover:shadow-xl"
								>
									{card.link.href ? (
										<Link
											key={index}
											{...card.link}
											className="flex flex-col items-center gap-2"
										>
											<Icon id="plus" className="h-4 w-4 text-primary-500" />
											<Text className="relative inline-flex items-center gap-2 border-primary-500 font-medium text-primary-500 before:absolute before:-bottom-1 before:left-0 before:w-full before:border-b-0 before:border-primary-500 before:content-[''] group-hover:before:border-b-[3px]">
												{card.title}
											</Text>
										</Link>
									) : null}
									<div className="text-center text-sm text-gray-600">{card.content}</div>
								</motion.div>
							)
						})}
					</motion.div>
				</Container>
			</div>
			<motion.div
				ref={containerRef}
				style={{ scale: scale }}
				className="relative mx-auto h-[50vh] w-full overflow-hidden rounded-3xl shadow-lg md:w-[70vw]"
			>
				<motion.img
					src={image?.src?._original}
					className="absolute h-full w-full object-cover"
				/>
			</motion.div>
		</div>
	)
}
const ThreeCardWithImageContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		image: {
			src: data?.extra_field?.image[0]?._default,
			alt: data?.extra_field?.image[0]?.meta?.alt,
			width: data?.extra_field?.image[0]?.meta?.width,
			height: data?.extra_field?.image[0]?.meta?.height,
		},
		cards: data?.components?.map((cardItem) => {
			return {
				name: cardItem?.icon_name,
				title: cardItem?.card_title,
				content: cardItem?.card_content?.value["#text"] ? (
					<Wysiwyg html={cardItem?.card_content?.value["#text"]} />
				) : null,
				link: {
					href: cardItem?.link?.url,
					title: cardItem?.link?.title,
					id: cardItem?.link?.attributes?.id,
					class: cardItem?.link?.attributes?.class,
					rel: cardItem?.link?.attributes?.rel,
					target: cardItem?.link?.attributes?.target,
				},
			}
		}),
	}

	return <ThreeCardWithImage {...widgetData} />
}

export default ThreeCardWithImageContainer
