import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const normalizeNodes = (nodes) => {
	return nodes.map((node) => ({
		id: node.drupal_internal__nid,
		title: get(node, "title", null),
		reference: get(node, "field_vactory_reference", null),
		excerpt: truncate(stripHtml(get(node, "field_vactory_excerpt.processed", "")), 100),
		date: get(node, "field_vactory_date", null),
		tender_form_url: get(node, "tender_form_url", null),
		document_1: get(
			node,
			"field_vactory_media_document.field_media_file.uri.value._default",
			null
		),
		document_2: get(
			node,
			"field_vactory_media_file.field_media_file.uri.value._default",
			null
		),
		tags: get(node, "field_vactory_tags", [])
			.map((term) => term.name)
			.filter((t) => typeof t !== "undefined"),
	}))
}
