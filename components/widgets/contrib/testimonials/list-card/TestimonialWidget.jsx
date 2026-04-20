import { Button, Text, Image, fadeInUpAnimation, CustomAnimation } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:14",
	lazy: false,
}

export const Cards = ({ intro, btn_more, items = [] }) => {
	const MoreLinkAttributes = {
		id: btn_more.id,
		target: btn_more.target,
		rel: btn_more.rel,
		className: btn_more.class,
	}
	return (
		<>
			{intro && (
				<Text className="mx-auto mb-8 w-full text-center md:w-2/3"> {intro}</Text>
			)}
			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
				<CustomAnimation keyFrame={fadeInUpAnimation} cascade={true}>
					{items.map((item, i) => {
						return (
							<div
								key={i}
								className="relative h-full overflow-hidden rounded-lg bg-white text-center shadow-lg"
							>
								<div
									className={vclsx(
										"absolute h-[100px] w-full ",
										item.mode ? "bottom-0" : "top-0"
									)}
									style={{
										backgroundImage:
											"repeating-radial-gradient( circle at 50% 105px, transparent 0, #e5e5f7 28px ), repeating-linear-gradient( #000, #000 )",
									}}
								></div>
								<div
									className={vclsx("z-1 p-5", item.mode ? "flex flex-col-reverse" : "")}
								>
									<div className="relative mx-auto mb-4 mt-6 h-[120px] w-[120px]">
										<Image
											{...item.image}
											className="h-full rounded-full border-[2px] border-primary-500 bg-white object-cover p-1"
											alt={item.image_alt}
										/>
									</div>
									<Text variant="base" className="mb-1 font-bold">
										{item.name}
									</Text>
									<Text variant="small" className="mb-2 font-medium text-gray-500">
										{item.role}
									</Text>
									<Text className="mb-1 font-light"> {item.description}</Text>
								</div>
							</div>
						)
					})}
				</CustomAnimation>
			</div>
			{btn_more.url && btn_more.title && (
				<div className="text-center">
					<Button
						href={btn_more.url}
						{...MoreLinkAttributes}
						variant="gradient"
						className="mx-auto w-fit"
					>
						{btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

const CardsContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
		btn_more: data?.extra_field.btn_more,
		items: data?.components.map((item, index) => ({
			id: index,
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			image_alt: item.image_alt,
			name: item.name,
			role: item.role,
			description: item.description,
			mode: item.mode,
		})),
	}

	return <Cards {...props} />
}

export default CardsContainer
