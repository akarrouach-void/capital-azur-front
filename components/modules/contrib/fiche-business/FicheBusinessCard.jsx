import { Icon, Image, Link, Wysiwyg } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import * as DOMPurify from "isomorphic-dompurify"

export const infos = [
	{ label: "Nx:Spécialisation", type: "txt", key: "specialisations" },
	{ label: "Nx:Secteur d'activité", type: "txt", key: "secteurActivite" },
	{ label: "Nx:Année de création", type: "txt", key: "date" },
	{ label: "Nx:Statut juridique", type: "txt", key: "statutJuridique" },
	{ label: "Nx:Taille d'entreprise", type: "txt", key: "tailleEntreprise" },
	{ label: "Nx:Pays", type: "txt", key: "pays" },
	{ label: "Nx:Ville", type: "txt", key: "ville" },
	{ label: "Nx:Adresse", type: "wucwug", key: "adresse" },
	{ label: "Nx:phone", type: "tel", key: "phone" },
	{ label: "Nx:Site web", type: "link", key: "siteWeb" },
]

export const FicheBusinessCard = ({ post, formUrl }) => {
	const { t } = useI18n()
	let socialNetworks = post.socialNetworks || {}
	socialNetworks = Object.keys(socialNetworks).map((s) => ({
		name: s,
		url: socialNetworks[s].fullUrl,
		value: socialNetworks[s].value,
	}))
	socialNetworks = socialNetworks.filter((s) => s.value)
	const infoExists = socialNetworks.length || infos.some((i) => post[i.key])

	return (
		<div className="container">
			<div className="shadow-1 my-6 rounded-xl bg-white p-5">
				<div className="flex justify-between gap-4 xs:justify-end">
					{formUrl && (
						<div>
							<Link
								href={formUrl}
								className="text-sm text-primary underline hover:no-underline"
							>
								<Icon id="draw" className="inline-block h-3 w-3 ltr:mr-2 rtl:ml-2" />
								<span>{t("Modifier")}</span>
							</Link>
						</div>
					)}

					{/* <SharePopupButton /> */}
				</div>
				<div className="mb-8 mt-5 text-center">
					<div className="relative isolate mx-auto h-20 w-20 rounded-full lg:h-24 lg:w-24">
						<div
							className={
								"rounded-full border-2 border-black " +
								"absolute inset-px flex items-center justify-center"
							}
						>
							<Icon id="photo-camera" className="h-6 w-6" height="25" />
						</div>
						<Image
							className="relative h-full w-full overflow-hidden rounded-full object-cover"
							src={post?.image || "/images/fichebiz-placeholder.png"}
							alt={post.title}
							fill
						/>
					</div>
					<h3 className="my-5 text-base font-bold">{post.title}</h3>
				</div>
				{post.description && (
					<Wysiwyg
						className="mt-5 border-t border-black/10 pt-5"
						html={post.description}
					/>
				)}
				<dl
					className={
						"mt-5 border-t border-black/10 pt-5 " +
						"md:break-avoid mb-6 space-y-4 md:columns-2"
					}
				>
					{infos.map((entry) => {
						const keyValue = post[entry.key]
						if (!keyValue) return null
						return (
							<div key={entry.label} className="flex">
								<dt className="text-true-400 shrink-0 text-sm ltr:mr-2 rtl:ml-2">
									{t(entry.label)} :
								</dt>
								<dd className="text-sm font-bold">
									{entry.type === "link" && (
										<a href={DOMPurify.sanitize(keyValue)}>{keyValue}</a>
									)}
									{entry.type === "tel" && (
										<a href={DOMPurify.sanitize(`tel:${keyValue}`)}>{keyValue}</a>
									)}
									{entry.type === "wucwug" && <Wysiwyg html={keyValue} />}
									{entry.type === "txt" && keyValue}
								</dd>
							</div>
						)
					})}
					{socialNetworks.length > 0 && (
						<div className="flex">
							<dt className="text-true-400 text-sm ltr:mr-2 rtl:ml-2">
								{t("Réseau sociaux :")}
							</dt>
							<dd className="grow text-sm font-bold">
								<ul className="flex gap-5">
									{socialNetworks.map((plateform) => {
										return (
											<li key={plateform.name} className="flex-none">
												<a
													href={DOMPurify.sanitize(plateform.url)}
													title={plateform.name}
												>
													<Icon id={plateform.name} className="h-5 w-5" />
												</a>
											</li>
										)
									})}
								</ul>
							</dd>
						</div>
					)}
				</dl>
				{!infoExists && <EmptyInfoCard formUrl={formUrl} />}
			</div>
		</div>
	)
}

const EmptyInfoCard = ({ formUrl }) => {
	const { t } = useI18n()
	return (
		<p className="flex flex-col text-center text-sm">
			<span>
				{t("Seems like you have not filled in the information for your business.")}
			</span>
			<Link
				className="font-bold text-primary underline transition hover:decoration-primary"
				href={formUrl}
			>
				{t("Fill your business informations")}
			</Link>
		</p>
	)
}
