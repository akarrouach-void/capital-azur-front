import { Icon, Wysiwyg, Text, Heading, Slider, SliderSlides, Image } from "@/ui"
import get from "lodash.get"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:33",
}

function PrintStars(props) {
	let stars = []
	for (let i = 0; i < 5; i++) {
		if (i < props.rating) {
			stars.push(
				<Icon
					key={i}
					id="favorite-star"
					className="text-warning-500 "
					width="16"
					height="16"
				/>
			)
		} else {
			stars.push(
				<Icon key={i} id="favorite-star" className="text-white " width="24" height="24" />
			)
		}
	}
	return stars
}

export const TestemonialRatingCard = ({
	name,
	role,
	description,
	image,
	rating,
	className,
}) => {
	return (
		<div className={vclsx(className, "h-full rounded-lg bg-white p-5 shadow-lg")}>
			<div className="mb-2.5 flex items-center">
				{image.src && (
					<div className="relative mr-4 h-[75px] w-[75px] shrink-0 overflow-hidden rounded-full shadow-lg">
						<Image
							src={image.src}
							width={image.width}
							height={image.height}
							alt={image.alt}
							className="h-full w-full object-cover"
						/>
					</div>
				)}
				<div className="flex grow flex-col">
					<div className="mb-1 flex items-center gap-1">
						<PrintStars rating={rating} />
					</div>
					<div>
						<Heading level="3" variant="none" className="font-semibold">
							{name}
						</Heading>
						<Text variant="small" as="span" className="mb-2 inline-block text-gray-500">
							{role}
						</Text>
					</div>
				</div>
			</div>
			<div className="prose mb-4 max-w-none">
				<Text className="h-full">{description}</Text>
			</div>
		</div>
	)
}

const TestemonialContainer = ({ data }) => {
	const props = {
		isSlider: get(data, "extra_field.slider", false),
		introduction: get(data, "extra_field.intro.value['#text']", null),
		items: data?.components?.map((item) => ({
			name: get(item, "name", null),
			role: get(item, "post", null),
			rating: get(item, "rate", null),
			description: get(item, "description", null),
			image: {
				src: get(item, "image[0]._default", null),
				alt: get(item, "image[0].meta.alt", null),
				height: get(item, "image[0].meta.height", null),
				width: get(item, "image[0].meta.width", null),
				title: get(item, "image_alt", null),
			},
		})),
	}

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		rtl: false,
		loop: true,
		disabled: false,
		centred: false,
		initial: 0,
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 20,
		},
		mode: "snap",
		rubberband: true,
		renderMode: "precision",
		defaultAnimation: { duration: 500 },
		vertical: false,
		opacity: false,
		breakpoints: {
			"(min-width: 992px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: 2,
					spacing: 20,
				},
			},
			"(min-width: 1200px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: 3,
					spacing: 20,
				},
			},
		},
	}

	return (
		<div>
			<Wysiwyg
				html={props.introduction}
				className="prose mx-auto mb-8 w-2/3 text-center"
			/>
			{props.isSlider ? (
				<Slider sliderSettings={sliderSettings} variant="default">
					{props.items.map((item, index) => {
						return (
							<SliderSlides key={index} className="mb-10">
								<TestemonialRatingCard {...item} />
							</SliderSlides>
						)
					})}
				</Slider>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
					{props.items.map((item, index) => {
						return (
							<div key={index} className="mb-6 md:mb-8">
								<TestemonialRatingCard {...item} />
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default TestemonialContainer
