import { Text, Button, Heading, Link, Image } from "@/ui"

export const config = {
	id: "vactory_default:9",
	lazy: false,
}

export const Team = ({ intro, btn_more, items = [] }) => {
	const MoreLinkAttributes = {
		id: btn_more.id,
		target: btn_more.target,
		rel: btn_more.rel,
		className: btn_more.class,
	}
	return (
		<>
			{intro && <Text className="mb-8 text-center"> {intro}</Text>}
			<div className="mb-8 flex flex-col gap-3 md:gap-5">
				{items.map((item) => {
					return (
						<div
							key={item.id}
							className="group flex flex-col overflow-hidden rounded-lg bg-white text-black shadow-lg md:flex-row"
						>
							<div className="relative flex w-full flex-shrink-0 items-center justify-center md:w-60">
								<div className="aspect-h-1 aspect-w-1 relative w-full overflow-hidden">
									<Image
										src={item.image.src}
										alt={item.image_alt}
										fill
										className="z-10 object-cover transition-all duration-700 group-hover:scale-105"
									/>
								</div>
							</div>
							<Link
								href={item.link_url}
								{...item.link_attributes}
								className="group flex w-full flex-col gap-5 p-10 md:flex-row md:items-center md:justify-between"
							>
								<div className="mb-2 md:mb-0 md:mr-2">
									<Heading level="6" className="mb-0.5">
										{item.title}
									</Heading>
									<Text className="mb-4 text-sm font-medium text-gray-500">
										{item.authors}
									</Text>
									<Text> {item.description} </Text>
								</div>
								<Text variant="permalink"> {item.link_title} </Text>
							</Link>
						</div>
					)
				})}
			</div>

			{btn_more.url && btn_more.title && (
				<Button
					href={btn_more.url}
					{...MoreLinkAttributes}
					variant="gradient"
					className="mx-auto w-fit"
				>
					{btn_more.title}
				</Button>
			)}
		</>
	)
}

const TeamContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
		btn_more: data?.extra_field.btn_more,
		items: data?.components.map((item, index) => ({
			id: index,
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			image_alt: item.image_alt,
			title: item.title,
			authors: item.authors,
			description: item.description,
			link_url: item.link.url,
			link_title: item.link.title,
			link_attributes: {
				id: item.link.attributes.id,
				target: item.link.attributes.target,
				rel: item.link.attributes.rel,
				className: item.link.attributes.class + "my-auto ml-auto whitespace-nowrap",
			},
		})),
	}

	return <Team {...props} />
}

export default TeamContainer
