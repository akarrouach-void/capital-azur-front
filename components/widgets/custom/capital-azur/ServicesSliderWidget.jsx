import { useRef, useEffect } from "react"
import { Image, Heading, Icon } from "@/ui"

export const config = {
	id: "capital_azur_decoupled:services-slider",
}

const ServicesSliderWidget = ({ data }) => {
	const extraFields = data?.extra_field || {}
	const items = data?.components || []
	const sectionTitle = extraFields?.title || ""
	const sectionDescription = extraFields?.description || ""

	const trackRef = useRef(null)

	const scroll = (dir) => {
		const el = trackRef.current
		if (!el) return
		const cardWidth = el.firstElementChild?.offsetWidth ?? 0
		el.scrollBy({ left: dir * (cardWidth + 20), behavior: "smooth" })
	}

	useEffect(() => {
		if (items.length <= 1) return
		const id = setInterval(() => {
			const el = trackRef.current
			if (!el) return
			const atEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 4
			atEnd
				? el.scrollTo({ left: 0, behavior: "smooth" })
				: el.scrollBy({
						left: el.firstElementChild?.offsetWidth + 20,
						behavior: "smooth",
					})
		}, 4000)
		return () => clearInterval(id)
	}, [items.length])

	return (
		<div className="px-6 py-16 sm:py-24 lg:py-40" style={{ backgroundColor: "#f0f4f8" }}>
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
					<button
						onClick={() => scroll(-1)}
						className="absolute -left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-blue-600 transition hover:text-blue-800 sm:-left-3"
						aria-label="Previous"
					>
						<Icon id="chevron-left" className="h-5 w-5" />
					</button>

					<div
						ref={trackRef}
						className="mx-10 flex gap-5 overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					>
						{items.map((item, i) => {
							const imageSrc = item?.image?.[0]?._default || null
							const imageWidth = item?.image?.[0]?.meta?.width || null
							const imageHeight = item?.image?.[0]?.meta?.height || null
							const title = item?.title || ""
							return (
								<div
									key={i}
									className="flex min-h-[240px] w-full shrink-0 flex-col items-center justify-center rounded-3xl bg-white px-4 py-6 shadow-sm [scroll-snap-align:start] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
								>
									{imageSrc && (
										<Image
											src={imageSrc}
											width={imageWidth}
											height={imageHeight}
											alt={title}
											className="mb-4 h-20 w-20 object-contain"
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

					<button
						onClick={() => scroll(1)}
						className="absolute -right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-blue-600 transition hover:text-blue-800 sm:-right-3"
						aria-label="Next"
					>
						<Icon id="chevron-right" className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ServicesSliderWidget
