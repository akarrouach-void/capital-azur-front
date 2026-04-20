import { Image, Heading } from "@/ui"

export const config = {
	id: "vactory_decoupled_image_styles:sample-image-styles",
}

export const Template = ({ items }) => {
	return (
		<div>
			{items.map((item) => {
				return (
					<div key={item.id}>
						<Heading level="3" variant="3" className="mx-auto mb-5 text-center">
							{item.title}{" "}
						</Heading>
						<Image
							{...item["image"]}
							alt={item?.alt || ""}
							styleMode={item?.image_style_id}
							className="rounded-lg shadow-lg"
						/>
					</div>
				)
			})}
		</div>
	)
}

const SampleImageStyleWidget = ({ data }) => {
	const props = {
		items: data?.components.map((item, index) => ({
			id: index,
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			title: item.title,
			image_style_id: item.image_style_id,
		})),
	}

	return <Template {...props} />
}

export default SampleImageStyleWidget
