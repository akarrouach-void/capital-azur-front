import { Heading, Text, Button, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:13",
	lazy: false,
}

const pushCard = ({ data }) => {
	const btn_attributes = {
			id: data?.components[0].btn_more.attributes.id,
			target: data?.components[0].btn_more.attributes.target,
			rel: data?.components[0].btn_more.attributes.rel,
			className: data?.components[0].btn_more.attributes.class,
		},
		link_attributes = {
			id: data?.components[0].link.attributes.id,
			target: data?.components[0].link.attributes.target,
			rel: data?.components[0].link.attributes.rel,
			className: data?.components[0].link.attributes.class,
		}
	return (
		<>
			{data?.components[0].intro && (
				<Text className="mb-8 text-center"> {data?.components[0].intro}</Text>
			)}

			<div className="group relative mb-8 w-full overflow-hidden rounded-lg bg-black p-6 md:h-full md:p-12">
				<Image
					src={data?.components[0].image[0]._default}
					fill
					alt={data?.components[0].image_alt}
					className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
				/>
				<div
					className={vclsx(
						"relative w-full rounded-lg bg-white p-8 shadow-lg md:w-[50%]",
						data?.components[0].mode ? "md:ml-auto" : ""
					)}
				>
					<Heading level="3" variant="3" className="mb-3">
						{data?.components[0].title}
					</Heading>
					<Text className="mb-5"> {data?.components[0].description} </Text>
					<Button
						href={data?.components[0].link.url}
						{...link_attributes}
						variant="gradient"
						className="mr-auto w-fit"
					>
						{data?.components[0].link.title}{" "}
					</Button>
				</div>
			</div>

			{data?.components[0].btn_more.url && data?.components[0].btn_more.title && (
				<div className="text-center">
					<Button
						href={data?.components[0].btn_more.url}
						{...btn_attributes}
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

export default pushCard
