import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return nodes.map((post) => ({
		id: post.drupal_internal__nid,
		title: post.title,
		url: get(post, "path.alias", "#."),
		description: truncate(
			stripHtml(get(post, "field_vactory_description.processed", "")),
			100
		),
		adresse: truncate(stripHtml(get(post, "field_vactory_address.processed", "")), 100),
		city: get(post, "field_vactory_city.name", null),
		contract: post?.field_vactory_contract.map((el) => el.name),
		profession: get(post, "field_vactory_profession.name", null),
		email: post.field_vactory_email,
		phone: post.field_vactory_telephone,
	}))
}
