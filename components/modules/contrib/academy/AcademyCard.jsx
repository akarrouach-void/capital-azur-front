import { Heading, Text, Badge, Flag, Link, Image, FiveStar, Icon } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { useState } from "react"
import ImageNotFound from "public/assets/img/image-not-found.png"

const AcademyImage = ({ image, alt = "" }) => {
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			<Image
				src={image?._default || ImageNotFound?.src}
				alt={alt}
				fill
				type="card"
				className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
			/>
		</div>
	)
}

export const AcademyCard = ({
	title,
	duree,
	excerpt,
	image,
	instructor,
	tags,
	url,
	id,
	isFlagged,
	hasFlag,
	vote,
	reloadPage = null,
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")

	return (
		<article className="animate flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
			<div className="relative w-full flex-shrink-0">
				<Link
					href={url}
					aria-label={`${t("Nx:En savoir plus")}: ${title}`}
					className="group"
				>
					<AcademyImage
						image={image?.uri?.value}
						width={image?.meta?.width}
						height={image?.meta?.height}
						alt={title}
					/>
					<Badge text={`${t("Nx:Durée")} ${duree}`} className="absolute left-2 top-2" />
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
					<div className="absolute bottom-2 left-2 rounded-xl bg-white p-2 shadow-lg">
						<FiveStar
							id={id}
							entity="node"
							icon="favorite-star"
							allowvote={false}
							rate={vote}
						/>
					</div>
				</Link>
			</div>

			<Link
				variant="default"
				href={url || "#."}
				className="group flex h-full flex-col p-5"
				aria-label={`${t("Nx:En savoir plus")}: ${title}`}
			>
				<Heading level="3" variant="cardTitle" className="mb-3">
					{title}
				</Heading>

				{tags && (
					<div className="flex flex-wrap items-center gap-2">
						{tags?.map((tag, index) => (
							<Badge key={index} text={tag} className="mb-2" />
						))}
					</div>
				)}
				{instructor && (
					<div className="mb-3 flex items-center gap-2">
						<Icon id="user" className="h-4 w-4" />
						<Text className="text-sm font-medium">
							{t("Nx:Animé par")}: {instructor}
						</Text>
					</div>
				)}
				<Text className="mb-6" variant="cardExcerpt">
					{excerpt}
				</Text>
				{url && (
					<Text variant="permalink" className="mt-auto w-fit">
						{t("Nx:En savoir plus")}
					</Text>
				)}
			</Link>
		</article>
	)
}
