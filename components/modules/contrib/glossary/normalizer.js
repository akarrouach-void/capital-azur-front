import get from "lodash.get"

export const normalizeNodes = (nodes) => {
	return (
		nodes?.map((post) => ({
			id: post.drupal_internal__nid,
			title: post.title,
			body: get(post, "body.processed", ""),
			url: get(post, "path.alias", "#."),
			tag: get(post, "field_vactory_tags.0.name", null),
			sector: get(post, "field_vactory_taxonomy_1.0.name", null),
			section: `${post.title.replace(/\s+/g, "")}-${String(
				post.drupal_internal__nid
			).slice(0, 3)}`,
		})) || []
	)
}
