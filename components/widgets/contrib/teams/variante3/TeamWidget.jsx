import { Text, Image } from "@/ui"

export const config = {
	id: "vactory_default:19",
	lazy: false,
}

export const Team = ({ cols, items = [] }) => {
	return (
		<div className={`grid md:grid-cols-${cols} mt-10 gap-4 md:gap-10`}>
			{items.map((item) => {
				return (
					<div key={item.id} className="mb-8 flex flex-row items-center">
						<div className="my-auto mr-5 basis-1/4">
							<div className="aspect-h-1 aspect-w-1 relative">
								<Image
									src={item.image.src}
									alt={item.image_alt}
									className="z-10 h-full rounded-full object-cover shadow-lg"
									fill
								/>
							</div>
						</div>
						<div className="basis-3/4">
							<Text variant="large" className="mb-1 font-semibold">
								{item.name}
							</Text>
							<Text variant="small" className="mb-2 font-medium text-gray-500">
								{item.role}
							</Text>
							<Text className="text-gray-600">{item.description}</Text>
						</div>
					</div>
				)
			})}
		</div>
	)
}

const TeamContainer = ({ data }) => {
	const props = {
		cols: data.extra_field.cols,
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
		})),
	}

	return <Team {...props} />
}

export default TeamContainer
