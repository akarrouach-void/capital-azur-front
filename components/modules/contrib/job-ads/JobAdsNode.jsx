import { useEffect } from "react"
import { Wysiwyg, Button, Container, Text, Heading } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"

const JobAdsNode = ({ node }) => {
	const { t } = useI18n()
	const encodedTitle = Buffer.from(node.title, "utf8").toString("base64")

	// trigger data layer event when visiting a job ad
	useEffect(() => {
		dlPush("consultation offre emploi", {
			"Type contrat": node?.field_vactory_contract?.name,
			Fonction: node?.title,
			Ville: node?.field_vactory_city?.name,
		})
	}, [])

	return (
		<div className="min-h-screen">
			<Container className="py-8 lg:py-16">
				<article className="mx-auto max-w-4xl">
					{/* Header Section */}
					<div className="mb-6 lg:mb-12">
						<Heading level={2} variant={3} className="mb-8 text-center text-gray-900">
							{node?.title}
						</Heading>
					</div>

					{/* Job Details Section */}
					<div className="mb-8 rounded-2xl bg-white p-6 shadow-xl lg:p-8">
						<div className="mb-6">
							<Heading level={3} variant={6} className="mb-4 text-gray-900">
								{t("Nx:Détails du poste")}
							</Heading>
							<div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
						</div>

						<div className="mb-10 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
							<table className="w-full border-collapse bg-white text-sm">
								<thead className="bg-gradient-to-r from-gray-50 to-gray-100">
									<tr>
										<th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-gray-900">
											{t("Nx:Type Contrat")}
										</th>
										<th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-gray-900">
											{t("Nx:Profession")}
										</th>
										<th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-gray-900">
											{t("Nx:City")}
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="border-b border-gray-100 px-6 py-4 text-gray-700">
											{node?.field_vactory_contract &&
												node?.field_vactory_contract.map((el, i) => (
													<Text as="span" key={i} className="font-medium">
														{el.name}
													</Text>
												))}
										</td>
										<td className="border-b border-gray-100 px-6 py-4 font-medium text-gray-700">
											{node?.field_vactory_profession?.name}
										</td>
										<td className="border-b border-gray-100 px-6 py-4 font-medium text-gray-700">
											{node?.field_vactory_city?.name}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Job Description Section */}
						<div className="mb-6">
							<Heading level={3} variant={6} className="text-gray-900">
								{t("Nx:Description du poste")}
							</Heading>
							<div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
						</div>

						{node?.field_vactory_description?.processed && (
							<Wysiwyg
								className="prose text-sm"
								html={node?.field_vactory_description?.processed}
							/>
						)}
					</div>

					{/* Apply Button Section */}
					{node?.candidature_spontanee_url !== null && (
						<div className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 text-center shadow lg:p-8">
							<div className="mb-6">
								<Heading level={3} variant={6} className="mb-2 text-gray-900">
									{t("Nx:Postuler maintenant")}
								</Heading>
								<Text className="text-gray-600">
									{t("Nx:Intéressé par ce poste ? Postulez dès maintenant !")}
								</Text>
							</div>

							<Button
								href={`${node?.candidature_spontanee_url}&title=${encodedTitle}`}
								variant="gradient"
							>
								{t("Nx:Postuler")}
							</Button>
						</div>
					)}
				</article>
			</Container>
		</div>
	)
}

export const config = {
	id: "node--vactory_job_ads",
	params: {
		fields: {
			"node--vactory_job_ads":
				"drupal_internal__nid,path,title,field_vactory_description,field_vactory_address,field_vactory_email,field_vactory_telephone,field_vactory_contract,field_vactory_profession,field_vactory_city,candidature_spontanee_url,node_banner_image,node_banner_mobile_image,node_banner_title,node_banner_description,node_banner_showbreadcrumb,node_summary",
			"taxonomy_term--vactory_job_ads_city": "tid,name",
			"taxonomy_term--vactory_job_ads_contract": "tid,name",
			"taxonomy_term--vactory_job_ads_profession": "tid,name",
		},
		include:
			"field_vactory_contract,field_vactory_profession,field_vactory_city,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default JobAdsNode
