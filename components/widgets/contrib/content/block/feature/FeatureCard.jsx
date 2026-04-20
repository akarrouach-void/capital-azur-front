import { Text, Heading, Link, Image } from "@/ui"

export const FeatureCard = ({
	id,
	image,
	image_alt,
	title,
	description,
	link_title,
	link_url,
	link_attributes,
}) => {
	return (
		<div
			key={id}
			className=" rounded-lg border border-t-4 border-gray-100 border-t-primary shadow-lg"
		>
			<div className="group flex h-full flex-col items-center px-6 py-10">
				{image && (
					<div className="mx-auto mb-2 h-20 w-20">
						<Image {...image} alt={image_alt} className="rounded-full" />
					</div>
				)}
				<Heading level="5" variant="5" className="mb-4">
					{title}
				</Heading>
				{description && <Text className="mb-4">{description}</Text>}
				{link_title && link_url && (
					<div className="mt-auto text-center">
						<Link href={link_url} {...link_attributes} variant="permalink">
							{link_title}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
