import { Icon, Image, Link, Slider, Text } from "@/ui"
import { useBreakPoint } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:slider_cards_aside",
}

const SlideCard = ({ slide }) => {
	return (
		<Link
			href={slide?.link?.url}
			className="keen-slider__slide relative flex h-[500px] w-full flex-col justify-between rounded-lg p-4 md:w-[400px] md:min-w-[400px] md:max-w-[400px]"
		>
			<Image
				className="-z-10 rounded-lg object-cover"
				alt={slide.image.meta.alt}
				src={slide.image._default}
				fill={true}
			/>
			<Text className="text-lg uppercase text-white [text-shadow:_0_0_10px_rgb(0_0_0_/_100%)]">
				{slide?.tag}
			</Text>
			<div className="flex flex-col gap-4">
				<Text className="text-3xl font-bold uppercase text-white [text-shadow:_0_0_10px_rgb(0_0_0_/_100%)]">
					{slide?.title}
				</Text>
				<span className="group flex w-fit flex-row items-center gap-2 rounded-full border border-white px-4 py-1 transition-all hover:bg-white">
					<Text className="uppercase text-white drop-shadow-md group-hover:text-gray-700">
						{slide?.link?.title}
					</Text>
					<Icon
						className="text-white group-hover:text-gray-700"
						id={"chevron-right-solid"}
						width={"10"}
						height={"10"}
					/>
				</span>
			</div>
		</Link>
	)
}

const SliderAside = ({ data }) => {
	const dataFormatted = {
		title: data?.extra_field?.title || "",
		description: data?.extra_field?.description || "",
		subtitle: data?.extra_field?.subtitle || "",
		link: data?.extra_field?.link || "",
		image: data?.extra_field?.image?.length > 0 ? data?.extra_field?.image[0] : null,

		slides: data?.components?.map((component) => ({
			...component,
			image: component?.image?.length > 0 ? component?.image[0] : null,
		})),
	}

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: true,
			// hideArrowDesktop: true,
		},
		loop: false,
		breakpoints: {
			"(min-width: 768px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: "auto",
					spacing: 20,
				},
			},
			"(min-width: 992px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: "auto",
					spacing: 20,
				},
			},
		},
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 20,
		},
	}
	const sliderPlugins = [() => {}]

	const device = useBreakPoint()

	return (
		<div className="w-screen overflow-hidden">
			<div className="flex flex-row ps-4 xl:ms-auto xl:w-[80%] xl:px-0">
				<div className="my-8 flex w-full flex-col items-center justify-end space-y-6 pe-10 md:my-0 md:w-[30%] md:items-start">
					<Text className="text-lg uppercase">{dataFormatted.subtitle}</Text>
					<Text className="relative text-4xl font-bold uppercase before:absolute before:-bottom-2 before:left-0 before:block before:h-2 before:w-[10%] before:bg-gray-700">
						{dataFormatted.title}
					</Text>
					<Text className="text-gray-950/80">{dataFormatted.description}</Text>
					<Link
						href={dataFormatted.link.url}
						className="group flex w-fit flex-row items-center gap-2 rounded-full border border-gray-700 px-4 py-1 transition-all hover:bg-gray-700"
					>
						<Text className="uppercase text-gray-700 group-hover:text-white">
							{dataFormatted.link?.title}
						</Text>
						<Icon
							className="text-gray-700 group-hover:text-white"
							id={"chevron-right-solid"}
							width={"10"}
							height={"10"}
						/>
					</Link>
				</div>
				<div className="hidden h-[500px] w-[70%] min-w-[70%] md:block">
					{device === undefined && (
						<div className="relative">
							<div className="group absolute -left-10 top-10 flex items-center justify-center rounded-full border-2 border-gray-800 p-2 transition-all hover:bg-gray-800">
								<Icon
									className="text-gray-800 drop-shadow-md transition-all group-hover:text-white"
									id={"chevron-right-solid"}
									width={"16"}
									height={"16"}
								/>
							</div>
							<div className="group absolute -left-10 top-0 flex rotate-180 items-center justify-center rounded-full border-2 border-gray-800 p-2 transition-all hover:bg-gray-800">
								<Icon
									className="text-gray-800 drop-shadow-md transition-all group-hover:text-white"
									id={"chevron-right-solid"}
									width={"16"}
									height={"16"}
								/>
							</div>
							<div className="flex h-full w-full flex-row gap-5 overflow-hidden">
								{dataFormatted.slides.slice(0, 3).map((slide, index) => (
									<SlideCard key={index} slide={slide} />
								))}
							</div>
						</div>
					)}
					{device && device !== "mobile" && (
						<Slider
							sliderSettings={sliderSettings}
							sliderPlugins={sliderPlugins}
							arrowIconNext={
								<div className="group flex items-center justify-center rounded-full border-2 border-gray-800 p-2 transition-all hover:bg-gray-800">
									<Icon
										className="text-gray-800 drop-shadow-md transition-all group-hover:text-white"
										id={"chevron-right-solid"}
										width={"16"}
										height={"16"}
									/>
								</div>
							}
							arrowIconPrev={
								<div className="group flex rotate-180 items-center justify-center rounded-full border-2 border-gray-800 p-2 transition-all hover:bg-gray-800">
									<Icon
										className="text-gray-800 drop-shadow-md transition-all group-hover:text-white"
										id={"chevron-right-solid"}
										width={"16"}
										height={"16"}
									/>
								</div>
							}
							variant="cardsAside"
							className=""
						>
							{dataFormatted.slides.map((slide, index) => {
								return <SlideCard key={`slide-card-${index}`} slide={slide} />
							})}
							<Link
								key={`slide-card-end`}
								href={dataFormatted.link.url}
								className="keen-slider__slide relative flex h-[500px] w-[400px] min-w-[400px] flex-col justify-between rounded-lg p-4"
							>
								<Image
									className="-z-10 rounded-lg object-cover"
									alt={dataFormatted.image.meta.alt}
									src={dataFormatted.image._default}
									fill={true}
								/>
								<div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white">
									<Text className="text-xl uppercase text-white drop-shadow-md">
										Toutes les activités
									</Text>
									<Icon
										className="stroke-2 text-white drop-shadow-md group-hover:text-gray-700"
										id={"chevron-right-circle"}
										width={"40"}
										height={"40"}
									/>
								</div>
							</Link>
						</Slider>
					)}
				</div>
			</div>
			{(device === "mobile" || device === "tablet") && (
				<div className="px-2 md:hidden">
					<Slider
						sliderSettings={sliderSettings}
						sliderPlugins={sliderPlugins}
						variant="default"
						className=""
					>
						{dataFormatted.slides.map((slide, index) => {
							return <SlideCard key={`slide-card-${index}`} slide={slide} />
						})}
					</Slider>
				</div>
			)}
		</div>
	)
}

export default SliderAside
