import { Container, Heading } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:key-figures",
}

const KeyFiguresWidget = ({ data }) => {
	const extraFields = data?.extra_field || {}
	const items = data?.components || []

	const sectionTitle = extraFields?.title || ""
	const sectionDescription = extraFields?.description || ""
	const ctaLabel = extraFields?.cta_label || ""
	const ctaFileUrl =
		extraFields?.cta_file?.[0]?._default || extraFields?.cta_file?.[0]?.url || null
	const ctaLinkUrl = extraFields?.cta_link?.url || null
	const ctaLinkTitle = extraFields?.cta_link?.title || ""
	const ctaHref = ctaFileUrl || ctaLinkUrl
	const ctaText = ctaLabel || ctaLinkTitle

	return (
		<div className="px-6 py-20" style={{ backgroundColor: "#f0f4f8" }}>
			<Container className="mx-auto max-w-6xl">
				{sectionTitle && (
					<div className="mb-16 flex flex-col items-center gap-6 text-center">
						<span className="bg-main block h-[3px] w-16 shrink-0" />
						<Heading
							level={2}
							className="text-button text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[42px]"
						>
							{sectionTitle}
						</Heading>
						{sectionDescription && (
							<p className="mt-2 max-w-4xl text-[17px] leading-relaxed text-gray-600 md:text-[19px]">
								{sectionDescription}
							</p>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
					{items.map((item, index) => {
						const number = item?.number || ""
						const label = item?.label || ""
						return (
							<div
								key={index}
								className="border-main flex flex-col items-center justify-center rounded-lg border bg-white px-6 py-12"
							>
								<span className="text-main text-[110px] font-extrabold leading-none tracking-tight md:text-[140px]">
									{number}
								</span>
								{label && (
									<p className="text-button mt-6 text-center text-base font-medium">
										{label}
									</p>
								)}
							</div>
						)
					})}
				</div>

				{ctaHref && ctaText && (
					<div className="mt-16 flex justify-center">
						<a
							href={ctaHref}
							download={!!ctaFileUrl}
							className="bg-main inline-flex items-center gap-3 rounded-md px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-blue-700"
						>
							<span>{ctaText}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
						</a>
					</div>
				)}
			</Container>
		</div>
	)
}

export default KeyFiguresWidget
