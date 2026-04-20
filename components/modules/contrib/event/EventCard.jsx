import React from "react"

import { Link, Heading, Badge, Text, Image, Flag, Icon } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import ImageNotFound from "public/assets/img/image-not-found.png"

export const EventCard = ({
	title,
	excerpt,
	image,
	url,
	dateStart,
	dateEnd,
	category,
	city,
	className,
	viewMoreLink,
	listingLayout,
	isFlagged,
	hasFlag,
	reloadPage,
	...props
}) => {
	const { t } = useI18n()
	return (
		<article
			className={vclsx(
				"animate group flex h-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl",
				listingLayout === "grid" ? "flex-col" : "flex-col lg:flex-row",
				className
			)}
			{...props}
		>
			<div
				className={vclsx(
					"relative aspect-[16/9] shrink-0 overflow-hidden",
					listingLayout === "list" && "lg:flex-1"
				)}
			>
				<Link href={url} aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
					<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
					<Image
						src={image?.src || ImageNotFound?.src}
						alt={image?.alt || "Image not found"}
						fill
						type="card"
						className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
					/>
				</Link>

				{category && (
					<div className="absolute left-4 top-4 flex flex-row items-center gap-2">
						{category?.map((term, index) => (
							<Badge
								key={index}
								text={term?.name}
								size="normal"
								href={
									viewMoreLink && term?.slug ? `${viewMoreLink}/${term?.slug}/all` : null
								}
							/>
						))}
					</div>
				)}

				{dateStart && dateEnd && (
					<div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-3 rounded-lg border border-blue-100/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
						<div className="flex items-center gap-2">
							<Icon id="calendar" className="h-4 w-4 text-blue-600" />
							<Text className="text-sm font-medium text-gray-700">
								{t("Nx:Du")}{" "}
								<span className="font-semibold text-gray-900">{dateStart}</span>
							</Text>
						</div>
						<div className="flex items-center gap-2">
							<Icon id="arrow-right" className="h-3 w-3 text-blue-500" />
							<Text className="text-sm font-medium text-gray-700">
								{t("Nx:Au")}{" "}
								<span className="font-semibold text-gray-900">{dateEnd}</span>
							</Text>
						</div>
					</div>
				)}
			</div>
			<Link
				href={url}
				aria-label={`${t("Nx:En savoir plus")}: ${title}`}
				className={vclsx(
					"group relative flex flex-col items-start p-6",
					listingLayout === "list" ? "lg:flex-1" : "h-full"
				)}
			>
				<div className="mb-3 flex items-center gap-2">
					<Icon id="locator" className="h-4 w-4 text-gray-500" />
					{city && (
						<Text className="text-gray-500" variant="medium">
							{city?.name}
						</Text>
					)}
				</div>

				<div className="mb-5">
					{hasFlag && (
						<Flag
							id={props?.id}
							title={title}
							module="default_flag"
							className="absolute right-4 top-4 cursor-pointer"
							isFlagged={isFlagged}
							reloadPage={reloadPage}
						/>
					)}
					{title && (
						<Heading level="3" variant="cardTitle" className="mb-5">
							{title}
						</Heading>
					)}
					{excerpt && <Text variant="cardExcerpt">{excerpt}</Text>}
				</div>

				<div className="mt-auto">
					<Text variant="permalink" aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
						{t("Nx:En savoir plus")}
					</Text>
				</div>
			</Link>
		</article>
	)
}
