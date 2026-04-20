import { Link, Icon, Heading, Text, Badge, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"
import ImageNotFound from "public/assets/img/image-not-found.png"

const PublicationImage = ({ image, title = "", tags = [] }) => {
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			<Image
				src={image?.uri?.value?._default || ImageNotFound?.src}
				alt={image?.meta?.alt || "Image not found"}
				title={title}
				fill
				type="card"
				className="animate object-cover group-hover:scale-110 group-hover:brightness-90"
				imageContainerClassName="h-full w-full"
			/>
			{tags.length > 0 && (
				<div className="absolute left-2 top-2 flex flex-wrap gap-2">
					{tags.map((tag, index) => (
						<Badge key={index} text={tag} />
					))}
				</div>
			)}
		</div>
	)
}

export const PublicationCard = ({ image, title, excerpt, date, document, tags }) => {
	const { t } = useI18n()

	// trigger data layer event when the user tries to download a publication
	const handlePublicationDownload = () => {
		dlPush("Consultation publication", {
			"Titre Publication": title,
			"Catégorie Publication": [...tags],
			"Date Publication": date,
		})
	}
	return (
		<article className="animate group h-full overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
			<Link
				href={document || "#."}
				target="_blank"
				className="group flex h-full  flex-col"
				onClick={handlePublicationDownload}
				download
			>
				<div className="w-full flex-shrink-0">
					<PublicationImage image={image} alt={title} tags={tags} />
				</div>
				<div className="flex h-full flex-col p-5">
					<Heading level="3" variant="cardTitle" className="mb-3">
						{title}
					</Heading>

					<Text variant="small" className="mb-5 text-gray-500">
						{date}
					</Text>

					<Text variant="cardExcerpt" className="mb-5">
						{excerpt}
					</Text>
					<div className="mt-auto">
						<Text variant="permalink" className="inline-flex gap-2">
							{t("Download")}
							<Icon id="cloud-download" width={24} height={24} />
						</Text>
					</div>
				</div>
			</Link>
		</article>
	)
}
