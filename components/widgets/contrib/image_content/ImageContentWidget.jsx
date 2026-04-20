import { Button, Image, Text, Heading, Animate } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	// TODO: Create a DF (backend) for this widget
	id: "vactory_default:not_assigned",
}

const ImageContant = ({
	title,
	description,
	link,
	image,
	imageCols = "lg:col-start-1 lg:col-end-5",
	descriptionCols = "lg:col-start-5 lg:col-end-13",
}) => {
	return (
		<Animate animationType="fade" direction="left" damping={0.2}>
			<div className="grid grid-cols-12 items-center justify-items-center gap-4 lg:gap-5">
				<div
					className={vclsx(
						"max-lg::max-w-sm col-span-full overflow-hidden rounded-full p-5 xl:p-7",
						imageCols
					)}
				>
					<Image
						{...image}
						alt={image.alt}
						className="shadows aspect-1 rounded-full border-4 border-primary-300 object-cover p-2"
					/>
				</div>
				<div
					className={vclsx(
						"max-lg::max-w-xl col-span-full rounded-lg bg-white p-6 shadow-md",
						descriptionCols
					)}
				>
					{title && (
						<Heading level={3} className="mb-4">
							{title}
						</Heading>
					)}
					{description && <Text className="mb-6">{description}</Text>}
					{link && <Button {...link}>{link.title}</Button>}
				</div>
			</div>
		</Animate>
	)
}

const ImageContantWidget = ({ data, imageCols, descriptionCols }) => {
	const props = {
		title: data.components[0].title,
		description: data.components[0].description,
		link: {
			href: data?.components?.[0]?.link?.url,
			title: data?.components?.[0]?.link?.title,
			id: data?.components?.[0]?.link?.id,
			target: data?.components?.[0]?.link?.target,
			rel: data?.components?.[0]?.link?.rel,
			className: data?.components?.[0]?.link?.class,
		},
		image: {
			src: data?.components?.[0]?.image._default,
			width: data?.components?.[0]?.image.meta.width,
			height: data?.components?.[0]?.image.meta.height,
			alt: data?.components?.[0]?.image.meta.alt,
		},
		imageCols: imageCols,
		descriptionCols: descriptionCols,
	}
	return <ImageContant {...props} />
}

export default ImageContantWidget
