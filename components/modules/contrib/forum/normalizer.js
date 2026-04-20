import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"
import { Wysiwyg } from "@/ui"

export const normalizeNodes = (nodes) => {
	return nodes?.map((post) => normalizeNode(post)) || []
}

export const normalizeNode = (node) => {
	return {
		id: node.drupal_internal__nid,
		title: node.title,
		image: {
			src: node?.field_vactory_media?.thumbnail?.uri?.value?._default,
			width: node?.field_vactory_media?.thumbnail?.meta?.width || 0,
			height: node?.field_vactory_media?.thumbnail?.meta?.height || 0,
			alt: node?.field_vactory_media?.thumbnail?.meta?.alt,
		},
		editeur: get(node, "field_forum_editeur.display_name", null),
		expert: getExpertInfos(get(node, "field_forum_expert", null)),
		status: get(node, "field_vactory_forum_status", "0"),
		views: get(node, "field_forum_views_count", "0"),
		thematics: get(node, "field_vactory_forums_thematic", [])
			.map((t) => t.name)
			.join(", "),
		room: get(node, "field_vactory_forum_room.name", ""),
		date: node.field_vactory_date,
		excerpt: truncate(stripHtml(node?.field_vactory_excerpt?.value)),
		body: node?.body?.value ? (
			<Wysiwyg html={node?.body?.processed} className="prose" />
		) : null,
		url: get(node, "path.alias", "#."),
		comments: node.internal_comment.contributions,
	}
}

const getExpertInfos = (expert) => {
	return {
		about: get(expert, "field_about_the_author", null),
		firstName: get(expert, "field_first_name", null),
		lastName: get(expert, "field_last_name", null),
		profession: get(expert, "field_user_profession", null),
		picture: {
			uri: get(expert, "user_picture.uri.value._default", null),
			width: get(expert, "user_picture.meta.width", null),
			height: get(expert, "user_picture.meta.height", null),
			alt: get(expert, "user_picture.meta.title", null),
		},
	}
}
