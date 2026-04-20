import { Heading, Text, Button, Image, Link } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:12",
	lazy: false,
}

const PushImage = ({ data }) => {
	const btn_attributes = {
		id: data?.extra_field.btn_more.id,
		target: data?.extra_field.btn_more.target,
		rel: data?.extra_field.btn_more.rel,
		className: data?.extra_field.btn_more.class,
	}
	return (
		<>
			{data?.extra_field.intro && (
				<Text className="mb-8 text-center"> {data?.extra_field.intro}</Text>
			)}
			<div
				className={vclsx(
					"mb-8 grid grid-cols-1",
					data?.extra_field.mode ? "" : "md:grid-cols-2 md:gap-4"
				)}
			>
				{data?.components.map((item, i) => {
					const link_attributes = {
						id: item.link.attributes.id,
						target: item.link.attributes.target,
						rel: item.link.attributes.rel,
						className: item.link.attributes.class,
					}
					const image_info = {
						src: item.image[0]._default,
						width: item.image[0].meta.width,
						height: item.image[0].meta.height,
					}
					return (
						<div
							key={i}
							className="group relative mb-3 cursor-pointer overflow-hidden rounded-lg bg-black text-center text-white shadow-lg hover:shadow-xl"
						>
							<div className="relative z-10 px-8 py-12">
								<Link
									href={item.link.url}
									{...link_attributes}
									className="absolute inset-0 z-10"
								></Link>
								<Heading level="3" variant="3">
									{item.titre}
								</Heading>
								<Text className="mb-5"> {item.description} </Text>
								<Button
									href={item.link.url}
									{...link_attributes}
									variant="gradient"
									className="relative z-20 mx-auto w-fit"
								>
									{item.link.title}
								</Button>
							</div>
							<Image
								src={image_info.src}
								alt={item.image_alt}
								className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
								fill
							/>
							<div className="absolute inset-0 bg-black/30" />
						</div>
					)
				})}
			</div>
			{data?.extra_field.btn_more.url && data?.extra_field.btn_more.title && (
				<div className="text-center">
					<Button
						href={data?.extra_field.btn_more.url}
						{...btn_attributes}
						variant="gradient"
						className="mx-auto w-fit"
					>
						{data?.extra_field.btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

export default PushImage
