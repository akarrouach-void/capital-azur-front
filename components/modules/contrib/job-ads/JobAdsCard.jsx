import { Link, Badge, Heading, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const JobAdsCard = ({ contract, className, url, title, description }) => {
	const { t } = useI18n()
	return (
		<article
			className={vclsx(
				"animate flex h-full flex-col rounded-xl bg-white shadow-lg hover:shadow-xl",
				className
			)}
		>
			<Link
				href={url}
				className="group relative flex h-full flex-col items-start p-6"
				aria-label={`${t("Nx:En savoir plus")}: ${title}`}
			>
				{contract ? (
					<div className="flex gap-2">
						{[].concat(contract).map((el, index) => (
							<Badge text={el} className="mb-5" key={index} />
						))}
					</div>
				) : null}

				<>
					{title && (
						<Heading level="3" variant="cardTitle" className="mb-[18px]">
							{title}
						</Heading>
					)}
				</>
				{description && (
					<Text variant="cardExcerpt" className="mb-[25px]">
						{description}
					</Text>
				)}
				{url && (
					<div className="mt-auto">
						<Text variant="permalink">{t("Nx:En savoir plus")}</Text>
					</div>
				)}
			</Link>
		</article>
	)
}
