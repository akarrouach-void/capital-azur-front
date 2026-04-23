import { useState } from "react"
import { Container, Wysiwyg, Heading, Image } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:faq",
}

const FaqWidget = ({ data }) => {
	const extraFields = data?.extra_field || {}
	const items = data?.components || []

	const sectionTitle = extraFields?.title || ""
	const sectionDescription = extraFields?.description || ""

	const [openIndex, setOpenIndex] = useState(0)

	return (
		<div className="px-6 md:px-12" style={{ backgroundColor: "#f8f9fc" }}>
			<Container className="mx-auto max-w-5xl">
				{sectionTitle && (
					<div className="mb-16 flex flex-col items-center gap-6 text-center">
						<span className="block h-[3px] w-16 shrink-0 bg-mainHover" />
						<Heading
							level={2}
							className="text-3xl font-extrabold uppercase leading-tight tracking-wide md:text-[42px]"
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

				<div className="flex flex-col gap-6">
					{items.map((item, index) => {
						const isOpen = openIndex === index
						const title = item?.title || ""
						const description = item?.description?.value || item?.description || ""

						const linkUrl = item?.link?.url || null
						const linkTitle = item?.link?.title || null
						const imageSrc = item?.image?.[0]?._default || null
						const imageWidth = item?.image?.[0]?.meta?.width || null
						const imageHeight = item?.image?.[0]?.meta?.height || null

						return (
							<div
								key={index}
								className="overflow-hidden rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
							>
								<button
									className="relative flex w-full cursor-pointer items-center justify-between px-10 py-6 text-left focus:outline-none"
									onClick={() => setOpenIndex(isOpen ? -1 : index)}
								>
									<span
										className={`text-[19px] font-bold transition-colors duration-300 ${
											isOpen ? "text-mainHover" : null
										}`}
									>
										{title}
									</span>
									<span
										className={`text-3xl font-light leading-none ${
											isOpen ? "text-mainHover" : "text-gray-400"
										}`}
									>
										{isOpen ? "−" : "+"}
									</span>
									<div
										className={`absolute bottom-0 left-6 right-6 h-[2px] ${
											isOpen ? "bg-gray-100" : "bg-transparent"
										}`}
									/>
								</button>

								{isOpen && (
									<div className="flex flex-col items-start gap-12 px-10 py-12 lg:flex-row">
										{imageSrc && (
											<div className="w-full shrink-0 lg:w-[45%]">
												<Image
													src={imageSrc}
													width={imageWidth}
													height={imageHeight}
													alt={title}
													className="h-auto w-full object-cover"
												/>
											</div>
										)}
										<div className="flex flex-1 flex-col justify-center">
											{description && (
												<Wysiwyg
													html={description["#text"] || description}
													className="mb-10 text-[17px] font-medium leading-relaxed "
												/>
											)}
											{linkUrl && linkTitle && (
												<div className="mt-auto flex items-center gap-3">
													<span className="block h-[2px] w-8 shrink-0 bg-mainHover" />
													<a
														href={linkUrl}
														className="text-sm font-extrabold uppercase tracking-widest text-mainHover transition hover:text-blue-800"
													>
														{linkTitle}
													</a>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</Container>
		</div>
	)
}

export default FaqWidget
