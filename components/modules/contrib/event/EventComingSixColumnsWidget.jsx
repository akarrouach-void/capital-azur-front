import React from "react"
import get from "lodash.get"
import {
	Wysiwyg,
	Heading,
	Text,
	Button,
	fadeInRightAnimation,
	CustomAnimation,
} from "@/ui"
import { EventCard } from "./EventCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"

export const config = {
	id: "vactory_event:six-columns-coming",
}

const EventComingSixColumnsWidget = ({ data }) => {
	const response = deserialise(get(data, "components.0.collection.data", {}))
	const title = get(data, "components.0.title", "")
	const raw_description = get(data, "components.0.description.value.#text", null)
	const description = <Wysiwyg html={raw_description} />
	const link = get(data, "components.0.link.url", null)
	const link_label = get(data, "components.0.link.title", "")
	const posts = normalizeNodes(response.data)

	return (
		<div className="relative">
			<div className="relative">
				<div>
					{title && (
						<Heading level="2" variant="title-paragraph" className="text-gray-900">
							{title}
						</Heading>
					)}
					{raw_description.length > 0 && (
						<Text as="div" variant="intro" className="text-center">
							{description}
						</Text>
					)}
				</div>
				<div className="mt-12 grid gap-5 lg:grid-cols-3">
					<CustomAnimation keyFrame={fadeInRightAnimation} cascade={true}>
						{posts.map((post) => (
							<EventCard
								{...post}
								viewMoreLink={link}
								listingLayout={"grid"}
								key={post.id}
							/>
						))}
					</CustomAnimation>
				</div>
				{link && link_label && (
					<div className="mt-12 flex justify-center">
						<Button href={link}>{link_label}</Button>
					</div>
				)}
			</div>
		</div>
	)
}

export default EventComingSixColumnsWidget
