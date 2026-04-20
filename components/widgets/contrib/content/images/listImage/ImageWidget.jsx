import { Text, Button, Link, Image } from "@/ui"

export const config = {
	id: "vactory_default:11",
	lazy: false,
}

const ListImage = ({ data }) => {
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
			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
				{data?.components.map((item, i) => {
					const image_info = {
							src: item.image[0]._default,
							width: item.image[0].meta.width,
							height: item.image[0].meta.height,
						},
						link_attributes = {
							id: data?.extra_field.btn_more.id,
							target: data?.extra_field.btn_more.target,
							rel: data?.extra_field.btn_more.rel,
							className: data?.extra_field.btn_more.class,
						}

					return (
						<div
							key={i}
							className="group relative flex flex-col overflow-hidden rounded-lg bg-white pb-6 shadow-lg hover:shadow-xl"
						>
							<Link
								href={item.link.url}
								{...link_attributes}
								className="absolute left-0 top-0 z-30 h-full w-full"
							></Link>
							<div className="aspect-h-1 aspect-w-1 w-full ">
								<div className="h-full w-full overflow-hidden">
									{image_info && (
										<Image
											{...image_info}
											alt={item.image_alt}
											className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
										/>
									)}
								</div>
							</div>

							{item.link.url && item.link.title && (
								<div className="mt-6 text-center">
									<Link variant="permalink" href={item.link.url} {...link_attributes}>
										{item.link.title}
									</Link>
								</div>
							)}
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

export default ListImage
