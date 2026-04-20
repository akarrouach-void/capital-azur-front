import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"
import { Wysiwyg } from "@/ui"

export const normalizeNodes = (nodes) => {
	return (
		nodes?.map((post) => ({
			id: post.drupal_internal__nid,
			title: get(post, "title", null),
			url: get(post, "path.alias", "#."),
			excerpt: truncate(stripHtml(get(post, "field_vactory_excerpt.processed", "")), 100),
			category: get(post, "field_vactory_news_theme", [])
				.map((term) => {
					return {
						name: term.name,
						slug: term?.term_2_slug || "",
					}
				})
				.filter((t) => typeof t !== "undefined"),
			image: {
				src: post?.field_vactory_media?.thumbnail?.uri?.value?._default,
				width: post?.field_vactory_media?.thumbnail?.meta?.width,
				height: post?.field_vactory_media?.thumbnail?.meta?.height,
			},
			image_alt: post?.field_vactory_media?.thumbnail?.meta?.alt,
			date: get(post, "field_vactory_date", null),
			hasFlag: post?.has_flag,
			isFlagged: post?.is_flagged,
		})) || []
	)
}

export const normalizeNode = (node) => {
	return {
		title: node?.title,
		id: node?.drupal_internal__nid,
		image: {
			src: node?.field_vactory_media.thumbnail?.uri?.value?._default,
			width: node?.field_vactory_media?.thumbnail?.meta?.width,
			height: node?.field_vactory_media?.thumbnail?.meta?.height,
		},
		image_alt: node?.field_vactory_media?.thumbnail?.meta?.alt,
		category: get(node, "field_vactory_news_theme.[0].name", null),
		date: get(node, "field_vactory_date", null),
		excerpt: get(node, "field_vactory_excerpt.processed", null),
		body: get(node, "body.processed", null),
		vcc: get(node, "vcc_normalized", null),
		isFlagged: node.is_flagged,
		hasFlag: node?.has_flag,
	}
}

export const normalizeTerms = (terms) => {
	return terms.map((term) => ({
		id: term.drupal_internal__tid,
		name: term.name,
	}))
}

export const normalizeVCC = (nodes) => {
	return (
		nodes?.map((post) => ({
			id: post.id,
			image: {
				src: post?.image?._default,
				width: post?.image?.meta?.width,
				height: post?.image?.meta?.height,
			},
			image_alt: post?.image?.meta?.alt,
			category: [post?.tag],
			date: post?.date?.html_date,
			title: post?.title,
			excerpt: <Wysiwyg html={truncate(stripHtml(post?.excerpt?.[0]?.value, 100))} />,
			url: post?.url,
		})) || []
	)
}

export const normalizedMixedNodes = (nodes) => {
	return (
		nodes?.map((post) => {
			if (post?.type == "node--vactory_news")
				return {
					id: post.drupal_internal__nid,
					type: post?.type,
					title: get(post, "title", null),
					url: get(post, "path.alias", "#."),
					excerpt: truncate(
						stripHtml(get(post, "field_vactory_excerpt.processed", "")),
						100
					),
					category: get(post, "field_vactory_news_theme", [])
						.map((term) => {
							return {
								name: term.name,
								slug: term?.term_2_slug || "",
							}
						})
						.filter((t) => typeof t !== "undefined"),
					image: {
						src: post?.field_vactory_media?.thumbnail?.uri?.value?._default,
						width: post?.field_vactory_media?.thumbnail?.meta?.width,
						height: post?.field_vactory_media?.thumbnail?.meta?.height,
					},
					image_alt: post?.field_vactory_media?.thumbnail?.meta?.alt,
					date: get(post, "field_vactory_date", null),
				}
			if (post?.type == "node--vactory_publication")
				return {
					id: post.drupal_internal__nid,
					type: post?.type,
					title: get(post, "title", null),
					image: get(post, "field_vactory_media.thumbnail", null),
					excerpt: truncate(
						stripHtml(get(post, "field_vactory_excerpt.processed", "")),
						100
					),
					date: get(post, "field_vactory_date", null),
					document: get(
						post,
						"field_vactory_media_document.field_media_file.uri.value._default",
						null
					),
					tags: get(post, "field_vactory_tags", [])
						.map((term) => term.name)
						.filter((t) => typeof t !== "undefined"),
				}
		}) || []
	)
}
