import { useI18n, useAccount } from "@vactorynext/core/hooks"
import { useEffect, useState } from "react"
import { FicheBusinessCard } from "./FicheBusinessCard"
import { normalizeForFicheBusinessCard } from "./normalizer"
import { LoginInvite } from "@/ui"

const FicheBusinessNode = (props) => {
	const { node } = props
	const { activeLocale: locale, t } = useI18n()
	const { profile, isAuthenticated, loginUrl, registerUrl } = useAccount()
	const [showEditButton, setShowEditButton] = useState(false)
	const post = normalizeForFicheBusinessCard(node)
	const formUrl = `/${locale}${post.formPath}`

	useEffect(() => {
		const isMine = post.ficheUsers.includes(parseInt(profile?.user?.id))
		if (isMine) {
			setShowEditButton(true)
		}
	}, [setShowEditButton])

	if (!isAuthenticated)
		return (
			<LoginInvite
				loginUrl={loginUrl}
				registerUrl={registerUrl}
				text={t(
					"Pour créer une fiche business, veuillez vous connecter à votre espace privé."
				)}
				showHelpText={true}
			/>
		)

	return <FicheBusinessCard post={post} formUrl={showEditButton ? formUrl : null} />
}

export const config = {
	id: "node--vactory_business",
	params: {
		fields: {
			"node--vactory_business": [
				"drupal_internal__nid",
				"internal_node_banner",
				"internal_blocks",
				"internal_breadcrumb",
				"changed",
				"langcode",
				"title",
				"path",
				"body",
				"field_business_ville",
				"field_secteur_activite",
				"field_statut_juridique",
				"field_taille_entreprise",
				"field_vactory_date",
				"field_business_users",
				"field_business_pays",
				"field_site_web",
				"field_social_networks",
				"field_vactory_address",
				"field_business_specialisations",
				"field_vactory_telephone",
				"field_vactory_media_image",
				"form_path_alias",
				"node_banner_image",
				"node_banner_mobile_image",
				"node_banner_title",
				"node_banner_description",
				"node_banner_showbreadcrumb",
				"node_summary",
			].join(","),
			"taxonomy_term--business_secteur_activite": "name",
			"taxonomy_term--business_statut_juridique": "name",
			"taxonomy_term--business_taille_entreprise": "name",
			"taxonomy_term--business_specialisations": "name",
			"media--image": "field_media_image",
			"file--image": "uri",
			"user--user": "drupal_internal__uid",
		},
		include:
			"field_secteur_activite,field_statut_juridique,field_taille_entreprise,field_business_specialisations,field_vactory_media_image.field_media_image,field_business_users,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default FicheBusinessNode
