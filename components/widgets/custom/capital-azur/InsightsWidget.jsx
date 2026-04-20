import { Container, Heading, Image } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:insights",
}

const InsightsWidget = ({ data }) => {
	const extraFields = data?.extra_field || {}
	const items = data?.components || []

	const sectionTitle = extraFields?.title || ""
	const sectionDescription = extraFields?.description || ""
	const globalLinkUrl = extraFields?.link?.url || null
	const globalLinkTitle = extraFields?.link?.title || null

	return (
		<div className="px-6 py-20">
			<Container className="mx-auto max-w-6xl">
				{/* Section header */}
				<div className="mb-16 flex flex-col items-center gap-5 text-center">
					<div className="flex items-center gap-4">
						<span className="block h-[3px] w-12 shrink-0 bg-[#2b6df7]" />
						{sectionTitle && (
							<Heading
								level={2}
								className="text-3xl font-extrabold uppercase leading-tight tracking-wide text-[#0B1526] md:text-[38px]"
							>
								{sectionTitle}
							</Heading>
						)}
					</div>
					{sectionDescription && (
						<p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-gray-600 md:text-[19px]">
							{sectionDescription}
						</p>
					)}
				</div>

				{/* Cards grid */}
				<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{items.map((item, index) => {
						const imageSrc = item?.image?.[0]?._default || null
						const imageWidth = item?.image?.[0]?.meta?.width || null
						const imageHeight = item?.image?.[0]?.meta?.height || null
						const category = item?.category || ""
						const date = item?.date || ""
						const title = item?.title || ""
						const linkUrl = item?.link?.url || "#"
						const linkTitle = item?.link?.title || "LIRE PLUS"

						return (
							<div
								key={index}
								className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
							>
								{imageSrc && (
									<a href={linkUrl} className="block shrink-0">
										<Image
											src={imageSrc}
											width={imageWidth}
											height={imageHeight}
											alt={title}
											className="h-56 w-full object-cover object-center"
										/>
									</a>
								)}

								<div className="flex flex-1 flex-col p-8">
									<div className="mb-4 flex items-center gap-4">
										{category && (
											<span className="inline-block rounded-full bg-[#09224A] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
												{category}
											</span>
										)}
										{date && (
											<span className="text-sm font-medium text-gray-400">{date}</span>
										)}
									</div>

									{title && (
										<h3 className="mb-8 text-[22px] font-bold leading-snug text-[#0B1526]">
											<a
												href={linkUrl}
												className="transition-colors hover:text-[#2b6df7]"
											>
												{title}
											</a>
										</h3>
									)}

									<div className="mt-auto">
										<a
											href={linkUrl}
											className="group relative inline-block pb-1 text-sm font-extrabold uppercase tracking-widest text-[#2b6df7] transition hover:text-blue-800"
										>
											{linkTitle}
											<span className="absolute bottom-0 left-0 h-[2px] w-full origin-left transform bg-[#2b6df7] transition-transform group-hover:scale-x-110" />
										</a>
									</div>
								</div>
							</div>
						)
					})}
				</div>

				{/* Global bottom CTA */}
				{globalLinkUrl && globalLinkTitle && (
					<div className="flex justify-center">
						<a
							href={globalLinkUrl}
							className="inline-block rounded-lg border-2 border-[#2b6df7] bg-transparent px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-[#2b6df7] transition-colors duration-300 hover:bg-[#2b6df7] hover:text-white"
						>
							{globalLinkTitle}
						</a>
					</div>
				)}
			</Container>
		</div>
	)
}

export default InsightsWidget
