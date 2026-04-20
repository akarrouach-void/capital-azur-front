import { Link, Heading, Text, Badge, Image, Flag, Icon } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useState } from "react"
import ImageNotFound from "public/assets/img/image-not-found.png"

const CardImage = ({ image, title, alt, url, t }) => {
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			<Link href={url} aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
				<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
				<Image
					src={image.src || ImageNotFound?.src}
					alt={alt}
					type="card"
					fill
					className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
				/>
			</Link>
		</div>
	)
}

export const NewsCard = ({
	image,
	image_alt,
	category,
	date,
	className,
	url,
	title,
	id,
	excerpt,
	isFlagged,
	hasFlag,
	viewMoreLink = null,
	listingLayout = "grid",
	reloadPage = null,
	...rest
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")
	return (
		<article
			className={vclsx(
				"animate group flex h-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl",
				listingLayout === "grid" ? "flex-col" : "flex-col lg:flex-row",
				className
			)}
			{...rest}
		>
			<div
				className={vclsx(
					"relative w-full shrink-0 overflow-hidden",
					listingLayout === "list" && "lg:flex-1"
				)}
			>
				{<CardImage image={image} alt={image_alt} url={url} title={title} t={t} />}
				{hasFlag && (
					<Flag
						id={id}
						title={title}
						module="default_flag"
						className="absolute right-4 top-4 cursor-pointer"
						isFlagged={isFlagged}
						reloadPage={reloadPage}
						flageChange={flageChange}
						onFlaggedChange={() => setflageChange(Date.now())}
					/>
				)}
				{category ? (
					<div className="absolute left-4 top-4 mb-[18px] flex flex-row items-center">
						{category?.map((term, index) => (
							<Badge
								text={term?.name}
								size="normal"
								key={index}
								className="mr-2"
								href={viewMoreLink && term?.slug ? `${viewMoreLink}/${term?.slug}` : null}
							/>
						))}
					</div>
				) : null}
			</div>
			<div
				className={vclsx("relative", listingLayout === "list" ? "lg:flex-1" : "h-full")}
			>
				<div className="relative flex h-full flex-col p-[25px]">
					{date && (
						<Text variant="small" className="mb-3 text-gray-500">
							{date}
						</Text>
					)}

					<>
						{title && (
							<Heading level="3" variant="cardTitle" className="mb-[18px]">
								{title}
							</Heading>
						)}
						{excerpt && (
							<Text variant="cardExcerpt" className="mb-[25px]">
								{excerpt}
							</Text>
						)}
					</>
					{url && (
						<div className="mt-auto">
							<Text
								variant="permalink"
								aria-label={`${t("Nx:En savoir plus")}: ${title}`}
							>
								{t("Nx:En savoir plus")}
								<Icon id="arrow-right" className="h-4 w-4" />
							</Text>
						</div>
					)}
				</div>
				<Link
					href={url || "#."}
					className="absolute inset-0"
					aria-label={`${t("Nx:En savoir plus")}: ${title}`}
					title={title}
				>
					<span className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</span>
				</Link>
			</div>
		</article>
	)
}
