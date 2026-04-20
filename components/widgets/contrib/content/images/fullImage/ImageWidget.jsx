import { Button, Wysiwyg, Image, Heading } from "@/ui"

export const config = {
	id: "vactory_default:10",
	lazy: false,
}

const FullImage = ({ data }) => {
	const link_attributes = {
			id: data?.components[0].id,
			target: data?.components[0].target,
			rel: data?.components[0].rel,
			className: data?.components[0].class,
		},
		image_info = {
			src: data?.components[0].image[0]._default,
			width: data?.components[0].image[0].meta.width,
			height: data?.components[0].image[0].meta.height,
			alt: data?.components[0].image[0].meta.alt,
		}
	return (
		<>
			{data?.components[0].intro && (
				<Heading variant={3} level={3} className="mb-5 text-center">
					{" "}
					{data?.components[0].intro}
				</Heading>
			)}

			{data?.components[0].description && (
				<Wysiwyg
					className="mx-auto mb-8 text-center"
					html={data?.components[0].description.value["#text"]}
				/>
			)}

			<div className="relative mb-8 aspect-1 overflow-hidden rounded-lg shadow-lg md:mx-auto md:max-h-[70vh]">
				{image_info && (
					<Image
						src={image_info.src}
						alt={image_info.alt}
						className="h-full w-full object-cover"
						fill
					/>
				)}
			</div>

			{data?.components[0].btn_more.url && data?.components[0].btn_more.title && (
				<div className="text-center">
					<Button
						href={data?.components[0].btn_more.url}
						{...link_attributes}
						variant="gradient"
						className="mx-auto w-fit"
					>
						{data?.components[0].btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

export default FullImage
