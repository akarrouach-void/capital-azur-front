import { Link, Image, Button } from "@/ui"

export const config = {
	id: "vactory_default:16",
	lazy: false,
}

const WidgetLiensContainer = ({ data }) => {
	const props = {
		items: data?.components?.map((item) => ({
			link_title: item?.link?.title,
			link: {
				href: item?.link?.url,
				id: item?.link?.attributes?.id,
				rel: item?.link?.attributes?.rel,
				target: item?.link?.attributes?.target || "_self",
				className: item?.link.attributes?.class,
			},
			image: {
				src: item?.image?.[0]?._default,
				width: item?.image?.[0]?.meta?.width,
				height: item?.image?.[0]?.meta?.height,
				alt: item?.image_alt,
			},
			description: item?.description,
		})),
	}

	return <WidgetLiens {...props} />
}

const Lineitem = ({ item }) => {
	return (
		<>
			{item.link.href && (
				<Link
					{...item.link}
					className="group flex flex-col justify-between gap-x-6 overflow-hidden rounded-lg bg-white p-6 shadow-lg hover:shadow-xl md:flex-row md:items-center"
				>
					<div className="flex grow gap-x-6">
						{item.image.src && (
							<div className="my-auto h-auto w-[120px] shrink-0 px-3 py-2 text-center">
								<Image
									{...item.image}
									alt={item.image.alt}
									className="h-full w-full object-cover"
								/>
							</div>
						)}
					</div>
					<div className="flex flex-col items-start md:items-start">
						{item.description && <div className="mb-5 mr-4">{item.description}</div>}
						<Button variant="gradient" className="mr-auto w-fit whitespace-nowrap">
							{item.link_title}
						</Button>
					</div>
				</Link>
			)}
		</>
	)
}

const WidgetLiens = ({ items }) => {
	return (
		<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
			{items.map((item, i) => {
				return <Lineitem item={item} key={i} />
			})}
		</div>
	)
}

export default WidgetLiensContainer
