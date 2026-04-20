import { Text, Heading, Slider, SliderSlides, Image } from "@/ui"

export const config = {
	id: "vactory_default:22",
}

export const TestemonialCard = ({ name, role, description, image }) => {
	return (
		<div className="relative h-full pb-5 pt-20 md:px-3">
			<div className="absolute left-[50%] top-0 z-[1] translate-x-[-50%] rtl:translate-x-[50%]">
				<div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-white shadow-lg">
					<Image {...image} alt={image.alt} className="h-full w-full object-cover" />
				</div>
			</div>
			<div className="h-full rounded-lg bg-white px-8 pb-8 pt-[100px] shadow-lg">
				<Heading level="3" className="mb-3 text-center">
					{name}
				</Heading>
				<Text className="mb-5 text-center text-base text-gray-400">{role}</Text>
				{/* <Wysiwyg html={description} as="p"/> */}
				<div className="prose max-w-none text-center">
					<Text>{description}</Text>
				</div>
			</div>
		</div>
	)
}

const TestemonialSlider = ({ data }) => {
	const props = {
		slideToShowTablet: data?.extra_field?.slideToShowTablet,
		slideToShowDesktop: data?.extra_field?.slideToShowDesktop,
		introduction: data?.extra_field?.intro,
		items: data?.components?.map((item) => ({
			name: item?.name,
			role: item?.role,
			description: item?.description,
			image: {
				src: item?.image[0]._default,
				alt: item?.image[0].meta.alt,
				height: item?.image[0].meta.height,
				width: item?.image[0].meta.width,
				title: item?.image_alt,
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
			spacing: 16,
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
					perView: props.slideToShowTablet,
					spacing: 20,
				},
			},
			"(min-width: 1200px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: props.slideToShowDesktop,
					spacing: 10,
				},
			},
		},
	}

	return (
		<div>
			<Text className="prose mx-auto mb-8 w-full text-center md:w-2/3">
				{props.introduction}
			</Text>
			<Slider sliderSettings={sliderSettings} variant="default">
				{props.items.map((item, index) => {
					return (
						<SliderSlides key={index}>
							<TestemonialCard {...item} />
						</SliderSlides>
					)
				})}
			</Slider>
		</div>
	)
}

export default TestemonialSlider
