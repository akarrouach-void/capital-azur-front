import get from "lodash.get"

import { Text, Heading, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:35",
}

export const TestemonialPushInfo = ({
	name,
	role,
	description,
	image,
	imgTop,
	reversed,
	className,
}) => {
	return (
		<div
			className={vclsx(
				className,
				reversed && "flex-row-reverse",
				"flex h-full rounded-lg border border-t-4 border-gray-50 border-t-primary-500 bg-white px-6 py-8 shadow-xl max-md:flex-col"
			)}
		>
			{image.src && (
				<div
					className={vclsx(
						"relative mr-5 h-[75px] w-[75px] shrink-0 overflow-hidden rounded-full shadow-lg max-md:mb-4"
					)}
				>
					<Image
						src={image.src}
						width={image.width}
						height={image.height}
						alt={image.alt}
						className="h-full w-full object-cover"
					/>
				</div>
			)}
			<div className="flex grow flex-col">
				<div className="prose mb-4 max-w-none">
					<Text className="">{description}</Text>
				</div>

				<div className={vclsx("mt-auto", !imgTop && reversed && "text-right")}>
					<Heading
						level="3"
						variant="none"
						className={vclsx("text-20 font-semibold leading-[27px] tracking-[.15px]")}
					>
						{name}
					</Heading>
					<Text variant="small" className="text-gray-500">
						{role}
					</Text>
				</div>
			</div>
		</div>
	)
}

const TestemonialContainer = ({ data }) => {
	const props = {
		introduction: get(data, "extra_field.intro", null),
		reversed: get(data, "extra_field.reverse_mode", false),
		imgTop: get(data, "extra_field.mode_top", false),
		items: data?.components?.map((item) => ({
			name: get(item, "name", null),
			role: get(item, "role", null),
			description: get(item, "description", null),
			image: {
				src: get(item, "image[0]._default", null),
				alt: get(item, "image[0].meta.alt", null),
				height: get(item, "image[0].meta.height", null),
				width: get(item, "image[0].meta.width", null),
				title: get(item, "image_alt", null),
			},
		})),
	}

	return (
		<>
			<div className="prose mx-auto mb-12 w-full text-center md:w-2/3">
				<Text variant="none">{props.introduction}</Text>
			</div>
			<div className="flex flex-col gap-3 md:flex-row md:gap-5">
				{props.items.map((item, index) => {
					return (
						<div key={index}>
							<TestemonialPushInfo
								{...item}
								imgTop={props.imgTop}
								reversed={props.reversed}
							/>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default TestemonialContainer
