import { Link, Text, Heading, Badge, Image, Flag } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useState } from "react"
import ImageNotFound from "public/assets/img/image-not-found.png"

export const BlogCard = ({
	image,
	category,
	className,
	url,
	title,
	id,
	excerpt,
	isFlagged,
	hasFlag,
	reloadPage = null,
	...rest
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")
	return (
		<article
			className={vclsx(
				"animate flex h-full flex-col rounded-xl bg-white shadow-lg hover:shadow-xl",
				className
			)}
			{...rest}
		>
			<div className="relative aspect-[16/9] shrink-0 overflow-hidden rounded-t-lg">
				<Link href={url} aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
					<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
					<Image
						src={image?.src || ImageNotFound?.src}
						alt={image?.alt}
						fill
						type="card"
						className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
					/>
				</Link>
			</div>

			<Link
				href={url}
				aria-label={`${t("Nx:En savoir plus")}: ${title}`}
				className="group relative flex h-full flex-col items-start p-8 pt-10"
			>
				{category && (
					<Badge
						text={category.name}
						className="mb-[18px]"
						size="normal"
						variant="ribbon"
					/>
				)}
				<>
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
					{title && (
						<Heading level="3" variant="cardTitle" className="mb-[18px]">
							{title}
						</Heading>
					)}
					{excerpt && (
						<Text variant="cardExcerpt" className="mb-[25px]" as="div">
							{excerpt}
						</Text>
					)}
				</>

				<Text variant="permalink" className="mt-auto">
					{t("Nx:En savoir plus")}
				</Text>
			</Link>
		</article>
	)
}
