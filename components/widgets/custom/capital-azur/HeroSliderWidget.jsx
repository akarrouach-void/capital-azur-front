import { useState, useEffect, useCallback } from "react"
import { Image, Link } from "@/ui"

export const config = { id: "capital_azur_decoupled:hero_slider" }

const HeroSliderWidget = ({ data }) => {
	const items = data?.components || []
	const [current, setCurrent] = useState(0)
	const count = items.length

	const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count])
	const prev = () => setCurrent((c) => (c - 1 + count) % count)

	useEffect(() => {
		if (count <= 1) return
		const id = setInterval(next, 5000)
		return () => clearInterval(id)
	}, [count, next])

	if (!count) return null

	return (
		<div className="relative w-full overflow-hidden ">
			<div
				className="flex transition-transform duration-700 ease-in-out"
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{items.map((item, index) => {
					const bgColor = item?.background_color || "#c4a882"
					const imageSrc = item?.image?.[0]?._default || null
					const imageWidth = item?.image?.[0]?.meta?.width || null
					const imageHeight = item?.image?.[0]?.meta?.height || null
					const title = item?.title || ""
					const description = item?.description || ""
					const linkUrl = item?.link?.url || null
					const linkTitle = item?.link?.title || null

					return (
						<div
							key={index}
							className="relative flex min-h-[420px] min-w-full items-center md:min-h-[480px] "
							style={{ backgroundColor: bgColor }}
						>
							<div className="mx-auto flex w-full max-w-[1400px] flex-col-reverse items-center justify-between gap-6 px-4 py-10 md:flex-row md:gap-10 md:px-12 md:py-0">
								{/* Left: white content card */}
								<div className="z-10 w-full shrink-0 self-center rounded-[12px] bg-white px-6 py-6 shadow-md md:w-[460px] md:px-8 md:py-8">
									<div className="mb-2 flex items-start gap-4 md:mb-4">
										<span className="mt-2 block h-[2px] w-6 shrink-0 bg-[#2178FF] md:mt-3 md:w-8" />
										<div className="flex-1">
											{title && (
												<h2 className="mb-2 text-2xl font-extrabold leading-tight text-[#1c2e5e] md:text-3xl">
													{title}
												</h2>
											)}
											{description && (
												<p className="mb-4 text-[15px] leading-relaxed text-gray-600 md:text-[17px]">
													{description}
												</p>
											)}
											{linkUrl && linkTitle && (
												<Link
													href={linkUrl}
													className="cursor-pointer text-blue-500 hover:text-blue-700"
												>
													{linkTitle}
												</Link>
											)}
										</div>
									</div>
								</div>

								{/* Right: image */}
								{imageSrc && (
									<div className="flex w-full flex-1 items-center justify-center md:mt-0">
										<Image
											src={imageSrc}
											width={imageWidth}
											height={imageHeight}
											alt={title}
											className="max-h-[220px] w-auto max-w-full object-contain drop-shadow-2xl md:max-h-[460px]"
										/>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
			{count > 1 && (
				<>
					<button
						onClick={prev}
						className="absolute left-2 top-1/2 z-20 flex h-16 w-10 -translate-y-1/2 items-center justify-center text-[#2178FF] transition hover:text-[#1c2e5e] md:left-4"
						aria-label="Précédent"
					>
						<svg
							width="24"
							height="44"
							viewBox="0 0 24 44"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-6"
							style={{ transform: "rotate(180deg)" }}
						>
							<path
								d="M4.72378 4.00012L20 22.4813L4 40.0001"
								stroke="currentColor"
								strokeWidth="8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button
						onClick={next}
						className="absolute right-2 top-1/2 z-20 flex h-16 w-10 -translate-y-1/2 items-center justify-center text-[#2178FF] transition hover:text-[#1c2e5e] md:right-4"
						aria-label="Suivant"
					>
						<svg
							width="24"
							height="44"
							viewBox="0 0 24 44"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-6"
						>
							<path
								d="M4.72378 4.00012L20 22.4813L4 40.0001"
								stroke="currentColor"
								strokeWidth="8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</>
			)}

			{count > 1 && (
				<div className="absolute bottom-3 left-6 flex items-center gap-1.5 md:left-12">
					{items.map((_, i) => (
						<button
							key={i}
							onClick={() => setCurrent(i)}
							aria-label={`Slide ${i + 1}`}
							className={
								i === current
									? "block h-1 w-6 rounded-full bg-primary-600 transition-all"
									: "block h-1 w-2 rounded-full bg-primary-200 transition-all hover:bg-primary-400"
							}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default HeroSliderWidget
