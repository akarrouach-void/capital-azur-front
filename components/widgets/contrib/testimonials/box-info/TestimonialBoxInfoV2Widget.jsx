import get from "lodash.get"

import { Wysiwyg, Heading, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:34",
}

export const TestemonialPushInfo = ({
	name,
	description,
	image,
	reversed,
	className,
}) => {
	return (
		<div
			className={vclsx(
				className,
				reversed ? "flex-col-reverse justify-end" : "flex-col",
				"shadowlg flex h-full rounded-lg bg-white px-6 py-8 shadow-lg"
			)}
		>
			<Wysiwyg html={description} className="prose mb-5 max-w-none" />

			<div className={vclsx(reversed && "mb-6", "flex items-center")}>
				{image.src && (
					<div
						className={vclsx(
							"relative mr-5 h-[75px] w-[75px] shrink-0 overflow-hidden rounded-full shadow-lg"
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
				<Heading
					level="3"
					variant="none"
					className={vclsx("text-20 grow font-semibold leading-[27px] tracking-[.15px]")}
				>
					{name}
				</Heading>
			</div>
		</div>
	)
}

const TestemonialContainer = ({ data }) => {
	const props = {
		introduction: get(data, "extra_field.intro", null),
		reversed: get(data, "extra_field.reverse_mode", false),
		items: data?.components?.map((item) => ({
			name: get(item, "name", null),
			description: get(item, "description.value['#text']", null),
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
			<Wysiwyg
				html={props.introduction}
				className="prose mx-auto mb-8 w-full text-center md:w-2/3"
			/>
			<div className="flex flex-col gap-3 md:flex-row md:gap-5">
				{props.items.map((item, index) => {
					return (
						<div key={index}>
							<TestemonialPushInfo {...item} reversed={props.reversed} />
						</div>
					)
				})}
			</div>
		</>
	)
}

export default TestemonialContainer
