import get from "lodash.get"

export const normalizeNodes = (nodes) => {
	return (
		nodes?.map((post) => ({
			id: post.drupal_internal__nid,
			title: post.title,
			url: get(post, "path.alias", "#."),
			category: get(post, "field_vactory_news_theme", [])
				.map((t) => t.name)
				.join(", "),
			image: get(post, "field_vactory_media.thumbnail.uri.value", null),
			date: get(post, "field_vactory_date", null),
		})) || []
	)
}
