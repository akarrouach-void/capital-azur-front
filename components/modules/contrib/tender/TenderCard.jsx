import { Button, Icon, Heading, Text, Badge } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const TenderCard = ({
	title,
	reference,
	excerpt,
	date,
	document_1,
	document_2,
	tags,
}) => {
	const { t } = useI18n()
	return (
		<div className="flex h-full flex-col items-start overflow-hidden rounded-lg border border-gray-100 bg-white p-6">
			<Badge text={reference} className="mb-1" size="xsmall" />
			<Heading level="3" variant="cardTitle" className="mb-5">
				{title}
			</Heading>
			<div className="flex items-center gap-2">
				{tags.map((tag, index) => (
					<Badge key={index} text={tag} size="xsmall" className="mb-2" />
				))}
			</div>
			<Text className="mb-8" variant="cardExcerpt">
				{excerpt}
			</Text>
			<div className="mb-5 mt-auto flex flex-wrap items-center gap-3">
				{document_1 && (
					<Button
						href={document_1}
						variant="primary"
						target="_blank"
						className="inline-flex gap-2"
						download
					>
						{t("Nx:Voir les résultats")}
						<Icon id="cloud-download" width={24} height={24} />
					</Button>
				)}
				{document_2 && (
					<Button
						href={document_2}
						variant="secondary"
						className="inline-flex gap-2"
						download
					>
						{t("Nx:Télécharger le dossier")}
						<Icon id="cloud-download" width={24} height={24} />
					</Button>
				)}
			</div>
			<Text>
				{t("Nx:Date de publication :")} <b>{date}</b>
			</Text>
		</div>
	)
}
