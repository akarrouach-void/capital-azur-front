export const normalizeNode = (node) => {
	return {
		title: node?.title,
		image: {
			src: node?.field_vactory_media?.thumbnail?.uri?.value?._default,
			width: node?.field_vactory_media?.thumbnail?.meta?.width || 0,
			height: node?.field_vactory_media?.thumbnail?.meta?.height || 0,
		},
		image_alt: node?.field_vactory_media?.thumbnail?.meta?.alt || "",
		tag: node?.field_vactory_news_theme?.[0]?.name,
		link: node?.path?.alias,
	}
}
