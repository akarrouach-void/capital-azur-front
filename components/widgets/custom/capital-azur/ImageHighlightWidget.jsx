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
	const linkUrl = component?.link?.url || null
	const linkTitle = component?.link?.title || null

	return (
		<div style={{ backgroundColor: bgColor }}>
			<div
				className="flex flex-col md:flex-row items-center justify-between"
				style={{ maxWidth: 1400, margin: "0 auto", minHeight: 600 }}
			>
				{/* Image: top on mobile, left on desktop */}
				{imageSrc && (
					<div className="w-full md:w-1/2 flex justify-center items-center p-10 shrink-0">
						<Image
							src={imageSrc}
							width={imageWidth}
							height={imageHeight}
							alt={title}
							className="w-full h-auto object-contain drop-shadow-2xl"
							style={{ maxHeight: 500 }}
						/>
					</div>
				)}

				{/* Text content */}
				<div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-16 md:py-24">
					<div className="flex items-start gap-5 mb-8">
						<span className="mt-3 block w-10 h-[3px] bg-white shrink-0" />
						{title && (
							<Heading
								level={2}
								className="text-3xl md:text-[38px] font-extrabold uppercase text-white leading-tight tracking-wide"
							>
								{title}
							</Heading>
						)}
					</div>

					{description && (
						<Wysiwyg
							html={description}
							className="text-white text-[17px] leading-relaxed mb-12 max-w-xl"
						/>
					)}

					{linkUrl && linkTitle && (
						<div>
							<a
								href={linkUrl}
								className="inline-block px-10 py-4 bg-white text-base font-bold uppercase tracking-widest rounded shadow-md hover:bg-gray-100 transition"
								style={{ color: bgColor }}
							>
								{linkTitle}
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ImageHighlightWidget
