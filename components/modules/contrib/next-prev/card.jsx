import { Link, Icon, Heading, Badge, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const Card = ({ image, image_alt, title, tag, link, direction = "left" }) => {
	const { t } = useI18n()
	return (
		<div
			className={vclsx(
				"fixed top-1/2 z-50 flex h-[160px] w-[420px] -translate-y-1/2 transition-all duration-500 ease-out",
				direction === "left"
					? "left-0 -translate-x-[380px] hover:translate-x-0 rtl:translate-x-[380px] rtl:hover:translate-x-0"
					: "right-0 translate-x-[380px] hover:translate-x-0 rtl:-translate-x-[380px] rtl:hover:translate-x-0"
			)}
		>
			{/* Arrow trigger */}
			<div
				className={vclsx(
					"flex h-full w-10 items-center justify-center bg-gradient-to-b from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700",
					direction === "left" ? "order-2 rounded-r-lg" : "order-1 rounded-l-lg"
				)}
			>
				{direction === "left" ? (
					<Icon id="arrow-left" className="h-5 w-5" />
				) : (
					<Icon id="arrow-right" className="h-5 w-5" />
				)}
			</div>

			{/* Card content */}
			<Link
				href={link}
				className={vclsx(
					"hover:shadow-3xl group flex h-full flex-1 overflow-hidden bg-white shadow-2xl transition-all duration-300",
					direction === "left" ? "order-1 rounded-l-lg" : "order-2 rounded-r-lg"
				)}
				aria-label={title}
			>
				{/* Image section */}
				<div className="relative w-2/5 overflow-hidden">
					{image?.src ? (
						<Image
							{...image}
							alt={image_alt}
							className="animate h-full w-full object-cover group-hover:scale-110"
							imageContainerClassName="h-full w-full"
						/>
					) : (
						<div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
					)}
				</div>

				{/* Content section */}
				<div className="flex w-3/5 flex-col justify-between p-4">
					<div className="space-y-2">
						{tag && (
							<Badge
								text={tag}
								className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
							/>
						)}

						<Heading level="3" variant="6" className="group-hover:text-blue-600">
							{title}
						</Heading>
					</div>

					{/* Navigation hint */}
					<div
						className={vclsx(
							"flex items-center gap-2 text-xs text-gray-500 transition-colors group-hover:text-blue-500",
							direction === "left" ? "justify-start" : "justify-end"
						)}
					>
						{direction === "left" && <Icon id="arrow-left" className="h-3 w-3" />}
						<span className="font-medium">
							{direction === "left" ? t("Nx:Précédent") : t("Nx:Suivant")}
						</span>
						{direction === "right" && <Icon id="arrow-right" className="h-3 w-3" />}
					</div>
				</div>
			</Link>
		</div>
	)
}
