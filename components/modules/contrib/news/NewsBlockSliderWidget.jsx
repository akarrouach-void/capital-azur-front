import React from "react"
import get from "lodash.get"
import { Link, Wysiwyg, Heading, Slider, SliderSlides } from "@/ui"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_news:block-slider",
}

const NewsBlockSliderWidget = ({ data }) => {
	const { t } = useI18n()

	const response = deserialise(get(data, "components.0.collection.data", {}))
	const posts = normalizeNodes(response.data)
	const title = get(data, "components.0.title", "")
	const description = get(data, "components.0.description.value.#text", null)

	const viewMoreLink = {
		title: get(data, "components.0.link.title", null),
		url: get(data, "components.0.link.url", null),
		className: get(data, "components.0.link.attributes.class", null),
		id: get(data, "components.0.link.attributes.id", null),
		rel: get(data, "components.0.link.attributes.rel", null),
		target: get(data, "components.0.link.attributes.target", null),
	}

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
	}

	return (
		<div className="relative">
			<div className="relative mx-auto max-w-7xl">
				<div className="mb-5 text-center">
					{title && (
						<Heading variant="3" level="2" className="mb-5 text-center">
							{title}
						</Heading>
					)}
					{description && <Wysiwyg className={"prose max-w-none"} html={description} />}
				</div>

				<Slider sliderSettings={sliderSettings} variant="default" className="">
					{posts.map((post, index) => {
						return (
							<SliderSlides key={index}>
								<NewsCard
									{...post}
									listingLayout="grid"
									viewMoreLink={viewMoreLink?.url}
								/>
							</SliderSlides>
						)
					})}
				</Slider>

				{viewMoreLink.url && (
					<div className="mt-10 text-center">
						<Link
							href={viewMoreLink.url}
							className={viewMoreLink.className}
							variant={"btnPrimary"}
							id={viewMoreLink.id}
							rel={viewMoreLink.rel}
							target={viewMoreLink.target}
						>
							{viewMoreLink.title ? viewMoreLink.title : t("Nx:Voir plus")}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export default NewsBlockSliderWidget
