import { Text, Wysiwyg, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:27",
	lazy: false,
}

export const Block = ({ intro, items = [] }) => {
	return (
		<>
			{intro && (
				<Text className="mx-auto mb-8 w-full text-center md:w-2/3"> {intro}</Text>
			)}
			{items.map((item, i) => {
				return (
					<div
						key={i}
						className={vclsx(
							"mb-5 flex flex-col items-center overflow-hidden rounded-lg bg-white p-5 shadow-lg",
							item.mode ? "md:flex-row-reverse" : "md:flex-row"
						)}
					>
						<div className="mb-4 h-40 w-40 shrink-0 md:mb-0">
							<Image
								{...item.image}
								className="h-full rounded-full object-cover shadow-lg"
								alt={item.image_alt}
							/>
						</div>
						<div
							className={vclsx(
								"text-center md:text-left",
								item.mode ? "md:mr-8" : "md:ml-8"
							)}
						>
							<Wysiwyg className="mb-3" html={item.description?.value?.["#text"]} />
							<Text variant="base" className="mb-1 font-medium">
								{item.name}
							</Text>
							<Text variant="small" className="text-gray-500">
								{item.role}
							</Text>
						</div>
					</div>
				)
			})}
		</>
	)
}

const BlockContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
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

	return <Block {...props} />
}

export default BlockContainer
