import { useState, useEffect, useCallback } from "react"
import { Image, Heading } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:services-slider",
}

const VISIBLE = 4 // cards visible at once on desktop

const ServicesSliderWidget = ({ data }) => {
	const extraFields = data?.extra_field || {}
	const items = data?.components || []

	const sectionTitle = extraFields?.title || ""
	const sectionDescription = extraFields?.description || ""

	const [offset, setOffset] = useState(0)
	const maxOffset = Math.max(0, items.length - VISIBLE)

	const next = useCallback(
		() => setOffset((o) => Math.min(o + 1, maxOffset)),
		[maxOffset]
	)
	const prev = () => setOffset((o) => Math.max(o - 1, 0))

	// Auto-play
	useEffect(() => {
		if (items.length <= VISIBLE) return
		const id = setInterval(() => {
			setOffset((o) => (o >= maxOffset ? 0 : o + 1))
		}, 4000)
		return () => clearInterval(id)
	}, [items.length, maxOffset])

	return (
		<div className="px-6 py-40" style={{ backgroundColor: "#f0f4f8" }}>
			<div style={{ maxWidth: 1200, margin: "0 auto" }}>
				{sectionTitle && (
					<div className="mb-4 flex items-start gap-4">
						<span className="mt-2 block h-[3px] w-8 shrink-0 bg-blue-600" />
						<Heading
							level={2}
							className="text-3xl font-extrabold uppercase leading-tight tracking-wide text-gray-900"
						>
							{sectionTitle}
						</Heading>
					</div>
				)}

				{sectionDescription && (
					<p className="mb-12 ml-12 text-base leading-relaxed text-gray-600">
						{sectionDescription}
					</p>
				)}

				<div className="relative mt-8">
					<div className="mx-6 overflow-hidden lg:mx-12">
						<div
							className="flex gap-4 transition-transform duration-500 ease-in-out md:gap-5"
							style={{ transform: `translateX(calc(-${offset} * (25% + 1.25rem)))` }}
						>
							{items.map((item, index) => {
								const imageSrc = item?.image?.[0]?._default || null
								const imageWidth = item?.image?.[0]?.meta?.width || null
								const imageHeight = item?.image?.[0]?.meta?.height || null
								const title = item?.title || ""

								return (
									<div
										key={index}
										className="flex min-h-[260px] w-full shrink-0 flex-col items-center justify-center rounded-3xl bg-white px-4 py-6 shadow-sm md:w-[calc(50%-10px)] md:px-6 md:py-8 lg:w-[calc(25%-15px)]"
									>
										{imageSrc && (
											<Image
												src={imageSrc}
												width={imageWidth}
												height={imageHeight}
												alt={title}
												className="mb-4 h-20 w-20 object-contain md:mb-6 md:h-24 md:w-24"
											/>
										)}
										{title && (
											<p className="text-center text-base font-bold text-gray-800">
												{title}
											</p>
										)}
									</div>
								)
							})}
						</div>
					</div>

					{items.length > VISIBLE && (
						<>
							<button
								onClick={prev}
								disabled={offset === 0}
								className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 select-none text-4xl font-thin leading-none text-blue-600 transition hover:text-blue-800 disabled:opacity-30 md:-left-6 md:text-6xl"
								aria-label="Previous"
							>
								&#8249;
							</button>
							<button
								onClick={next}
								disabled={offset === maxOffset}
								className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 select-none text-4xl font-thin leading-none text-blue-600 transition hover:text-blue-800 disabled:opacity-30 md:-right-6 md:text-6xl"
								aria-label="Next"
							>
								&#8250;
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ServicesSliderWidget
