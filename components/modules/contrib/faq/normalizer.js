import { Wysiwyg } from "@/ui"
import get from "lodash.get"

export const normalizeNodes = (nodes) => {
	return nodes.map((post) => ({
		id: post.drupal_internal__nid,
		title: get(post, "title", null),
		description: get(post, "body.processed", null),
		items: post.field_faq.map((item) => ({
			button: get(item, "question", null),
			panel: <Wysiwyg html={get(item, "answer", null)} />,
		})),
	}))
}

export const normalizeTerms = (terms) => {
	return terms.map((term) => ({
		id: term.drupal_internal__tid,
		name: term.name,
	}))
}
