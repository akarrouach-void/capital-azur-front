import { Heading, Icon, Image, Link, Text } from "@/ui"

export const config = {
	id: "vactory_default:discover",
}

export const DiscoverComponent = ({ data }) => {
	const props = {
		title: data?.extra_field?.title,
		description: data?.extra_field?.description,
		items: data?.components?.map((item) => ({
			title: item?.title,
			description: item?.description,
			link: {
				title: item?.link?.title,
				href: item?.link?.url || null,
				id: item?.link?.attributes.id || "",
				className: item?.link?.attributes?.class || "",
				target: item?.link?.attributes?.target || "_self",
			},
			image: {
				src: item?.image?.[0]?._default || null,
				width: item?.image?.[0]?.meta?.width,
				height: item?.image?.[0]?.meta?.height,
				alt: item?.image?.[0]?.meta?.alt,
			},
			icon: item?.icon,
		})),
	}

	return (
		<>
			{(props.title || props.description) && (
				<div className="mb-10 text-center">
					<Heading className="mb-4" level={2}>
						{props.title}
					</Heading>
					<Text variant="large" className="text-gray-600">
						{props.description}
					</Text>
				</div>
			)}
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{props.items.map((item, index) => (
					<Link
						href={item.link.href}
						key={index}
						className="animate group overflow-hidden rounded-xl bg-gray-25 shadow hover:shadow-xl"
					>
						<div className="relative bg-gray-800">
							<Image
								src={item.image.src}
								alt={item.image.alt}
								width={item.image.width}
								height={item.image.height}
								className="animate h-full w-full object-cover group-hover:scale-105 "
								imageContainerClassName="aspect-[16/9] overflow-hidden"
							/>
							<div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90">
								<Icon id={item.icon} className="h-5 w-5 text-gray-700" />
							</div>
						</div>
						<div className="p-6">
							<Heading level={3} variant={5} className="text-gray-900">
								{item.title}
							</Heading>
							<Text variant="medium" className="text-gray-600">
								{item.description}
							</Text>
						</div>
					</Link>
				))}
			</div>
		</>
	)
}

export default DiscoverComponent
