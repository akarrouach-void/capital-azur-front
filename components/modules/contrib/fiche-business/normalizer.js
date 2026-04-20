import get from "lodash/get"
import dayjs from "dayjs"

export const normalizeForFicheBusinessCard = (fiche) => {
	let date = fiche?.field_vactory_date || ""
	date = date && dayjs(date).format("DD/MM/YYYY")

	let specialisations = fiche?.field_business_specialisations || []
	let specialisationsIds = specialisations.map((s) => s.id)
	specialisations = specialisations.map((s) => s.name).join(", ")

	let ficheUsers = fiche?.field_business_users || []
	ficheUsers = ficheUsers.map((user) => user.drupal_internal__uid)

	return {
		uuid: fiche.id,
		id: get(fiche, "drupal_internal__nid", null),
		key: fiche?.id,
		url: fiche?.path?.alias,
		title: fiche?.title,
		description: get(fiche, "body.value", ""),
		adresse: get(fiche, "field_vactory_address.value", ""),
		pays: get(fiche, "field_business_pays.name", ""),
		ville: get(fiche, "field_business_ville", ""),
		secteurActivite: get(fiche, "field_secteur_activite.name", ""),
		secteurActiviteId: get(fiche, "field_secteur_activite.id", ""),
		specialisations: specialisations,
		specialisationsIds: specialisationsIds,
		statutJuridique: get(fiche, "field_statut_juridique.name", ""),
		statutJuridiqueId: get(fiche, "field_statut_juridique.id", ""),
		tailleEntreprise: get(fiche, "field_taille_entreprise.name", ""),
		siteWeb: get(fiche, "field_site_web", ""),
		phone: get(fiche, "field_vactory_telephone", ""),
		socialNetworks: get(fiche, "field_social_networks", ""),
		date: date,
		image: get(
			fiche,
			"field_vactory_media_image.field_media_image.uri.value._default",
			null
		),
		formPath: get(fiche, "form_path_alias", ""),
		ficheUsers: ficheUsers,
	}
}
