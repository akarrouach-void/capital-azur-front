import { Container, Heading, Image, Wysiwyg } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:president-word",
}

const PresidentWordWidget = ({ data }) => {
	const component = data?.components?.[0] || {}
	const title = component?.title || ""
	const name = component?.name || ""
	const role = component?.role || ""
	const quote = component?.quote?.value || component?.quote || ""
	const imageSrc = component?.image?.[0]?._default || null
	const imageWidth = component?.image?.[0]?.meta?.width || null
	const imageHeight = component?.image?.[0]?.meta?.height || null

	return (
		<div className="px-6 py-16">
			<Container className="mx-auto max-w-6xl">
				<div className="relative overflow-hidden rounded-lg bg-white px-8 py-16 shadow-[0_4px_30px_rgba(0,0,0,0.06)] md:px-16 md:py-20">
					<span
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-4 -right-4 select-none font-serif text-[260px] leading-none text-[#e8eef8] md:text-[340px]"
					>
						&#8221;
					</span>

					<div className="relative flex flex-col items-start gap-12 md:flex-row md:gap-16">
						<div className="flex w-full shrink-0 flex-col items-center md:w-[260px]">
							{imageSrc && (
								<div className="overflow-hidden rounded-md">
									<Image
										src={imageSrc}
										width={imageWidth}
										height={imageHeight}
										alt={name || title}
										className="h-auto w-full object-cover"
									/>
								</div>
							)}
							{name && (
								<div className="mt-6 flex items-center gap-3 text-center">
									<span className="bg-main block h-[2px] w-6 shrink-0" />
									<p className="text-button text-base font-extrabold uppercase tracking-wide">
										{name}
									</p>
								</div>
							)}
							{role && <p className="text-main mt-1 pl-9 text-sm italic">{role}</p>}
						</div>

						<div className="flex-1">
							<div className="mb-8 flex items-start gap-5">
								<span className="bg-main mt-3 block h-[3px] w-10 shrink-0" />
								{title && (
									<Heading
										level={2}
										className="text-button text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[38px]"
									>
										{title}
									</Heading>
								)}
							</div>

							{quote && (
								<Wysiwyg
									html={quote["#text"] || quote}
									className="text-[17px] leading-relaxed text-gray-700"
								/>
							)}
						</div>
					</div>
				</div>
			</Container>
		</div>
	)
}

export default PresidentWordWidget
