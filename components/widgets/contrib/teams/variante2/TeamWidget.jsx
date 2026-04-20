import { Text, Image, CustomAnimation, fadeInDownRightAnimation } from "@/ui"

export const config = {
	id: "vactory_default:18",
	lazy: false,
}

export const Team = ({ items = [] }) => {
	return (
		<div className="flex flex-row flex-wrap	justify-center gap-5">
			<CustomAnimation
				keyFrame={fadeInDownRightAnimation}
				cascade={true}
				damping={0.1}
				className="w-half px-3 sm:w-third md:w-quarter lg:px-6 xl:px-10"
			>
				{items.map((item) => {
					return (
						<div key={item.id} className="flex flex-col items-center text-center">
							<div className="mb-3 overflow-hidden rounded-full border-4 border-primary-500 bg-white p-1 shadow-md dark:bg-black">
								<Image
									{...item.image}
									alt={item.image_alt}
									className="aspect-1 rounded-full object-cover"
								/>
							</div>
							<Text className="mb-1 text-lg font-semibold">{item.name}</Text>
							<Text variant="small"> {item.role} </Text>
						</div>
					)
				})}
			</CustomAnimation>
		</div>
	)
}

const TeamContainer = ({ data }) => {
	const props = {
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
		})),
	}

	return <Team {...props} />
}

export default TeamContainer
