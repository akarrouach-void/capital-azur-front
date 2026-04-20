import { Image, Heading, Wysiwyg } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:image-highlight",
}

const ImageHighlightWidget = ({ data }) => {
	const component = data?.components?.[0]
	const title = component?.title || ""
	const description = component?.description || ""
	const imageSrc = component?.image?.[0]?._default || null
	const imageWidth = component?.image?.[0]?.meta?.width || null
	const imageHeight = component?.image?.[0]?.meta?.height || null
	const bgColor = component?.background_color || "#1a6dd1"
	const textColor = component?.text_color || "#ffffff"
	const imagePosition = component?.image_position || "left"
	const linkUrl = component?.link?.url || null
	const linkTitle = component?.link?.title || null

	const imageBlock = imageSrc && (
		<div className="flex w-full shrink-0 items-center justify-center p-10 md:w-1/2">
			<Image
				src={imageSrc}
				width={imageWidth}
				height={imageHeight}
				alt={title}
				className="h-auto w-full object-contain drop-shadow-2xl"
				style={{ maxHeight: 500 }}
			/>
		</div>
	)

	const textBlock = (
		<div className="flex flex-1 flex-col justify-center px-10 py-16 md:px-16 md:py-24">
			<div className="mb-8 flex items-start gap-5">
				<span className="mt-3 block h-[3px] w-10 shrink-0" style={{ backgroundColor: textColor }} />
				{title && (
					<Heading
						level={2}
						className="text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[38px]"
						style={{ color: textColor }}
					>
						{title}
					</Heading>
				)}
			</div>

			{description && (
				<Wysiwyg
					html={description}
					className="mb-12 max-w-xl text-[17px] leading-relaxed"
					style={{ color: textColor }}
				/>
			)}

			{linkUrl && linkTitle && (
				<div>
					<a
						href={linkUrl}
						className="inline-block rounded px-10 py-4 text-base font-bold uppercase tracking-widest shadow-md transition hover:opacity-90"
						style={{ backgroundColor: textColor, color: bgColor }}
					>
						{linkTitle}
					</a>
				</div>
			)}
		</div>
	)

	return (
		<div style={{ backgroundColor: bgColor }}>
			<div
				className="flex flex-col items-center justify-between md:flex-row"
				style={{ maxWidth: 1400, margin: "0 auto", minHeight: 600 }}
			>
				{imagePosition === "right" ? (
					<>
						{textBlock}
						{imageBlock}
					</>
				) : (
					<>
						{imageBlock}
						{textBlock}
					</>
				)}
			</div>
		</div>
	)
}

export default ImageHighlightWidget
