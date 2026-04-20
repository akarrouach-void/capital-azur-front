import { Text, Link, Button, Icon, Image } from "@/ui"

export const config = {
	id: "vactory_default:32",
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
			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
				{items.map((item) => {
					return (
						<div
							key={item.id}
							className="relative mt-20 rounded-lg bg-white text-center shadow-lg"
						>
							<div className="relative mx-auto -mt-16 mb-2 h-[120px] w-[120px]">
								<Image
									{...item.image}
									className="h-full rounded-full object-cover shadow"
									alt={item?.image_alt}
								/>
							</div>
							<div className="w-full px-5 pb-5 pt-3">
								<div className="mb-4">
									<Text className="text-lg font-medium">{item.name}</Text>
									<Text variant="medium" className="mb-4 text-gray-500">
										{item.role}
									</Text>
								</div>
								<div className="flex justify-center gap-3">
									{item.linkedin && (
										<Link href={item.linkedin} target="_blank" aria-label="linkedin">
											<Icon
												className="h-6 w-6 text-primary-500 hover:text-primary-700"
												id="linkedin"
											/>
										</Link>
									)}
									{item.youtube && (
										<Link href={item.youtube} target="_blank" aria-label="youtube">
											<Icon
												className="h-6 w-6 text-primary-500 hover:text-primary-700"
												id="youtube"
											/>
										</Link>
									)}
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{btn_more.url && btn_more.title && (
				<div className="text-center">
					<Button
						href={btn_more.url}
						{...MoreLinkAttributes}
						variant="gradient"
						className="mx-auto w-fit"
					>
						{btn_more.title}
					</Button>
				</div>
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
			name: item.name,
			role: item.role,
			linkedin: "item.linkedin",
			twitter: "item.twitter",
			youtube: "item.youtube",
		})),
	}

	return <Team {...props} />
}

export default TeamContainer
