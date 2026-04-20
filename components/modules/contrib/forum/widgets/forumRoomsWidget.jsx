import React from "react"
import { deserialise } from "kitsu-core"
import { normalizeNodes } from "./../normalizer"
import { Container, LoadingOverlay, EmptyBlock, Button } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import get from "lodash.get"
import { ForumPost } from "./../components/forumPost"

export const config = {
	id: "vactory_forums:rooms",
}

const ForumRoomsWidget = ({ data }) => {
	const { t } = useI18n()
	let items = []
	data?.components.map((item) => {
		const response = deserialise(get(item, "collection.data", {}))
		if (response?.data?.length > 0) {
			const posts = normalizeNodes(response.data)
			items = [
				...items,
				{
					room: get(posts, "0.room", ""),
					items: posts,
					ctaUrl: get(item, "forum_cta.url", null),
					ctaTitle: get(item, "forum_cta.title", null),
				},
			]
		}
	})

	return (
		<LoadingOverlay active={false} spinner={true}>
			<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
				<h1>Forums</h1>
				<Container>
					{items.length > 0 ? (
						<div>
							{items.map((post) => (
								<React.Fragment key={post.id}>
									<p className="text-2xl">{post.room}</p>
									{post.items.length > 0 ? (
										<div className="relative overflow-x-auto">
											<table className="w-full text-left text-sm text-gray-500">
												<thead className="bg-gray-50 text-xs uppercase text-gray-700">
													<tr>
														<th scope="col" className="px-6 py-3">
															Sujet
															{t("Nx:Sujet")}
														</th>
														<th scope="col" className="px-6 py-3">
															{t("Nx:Statut")}
														</th>
														<th scope="col" className="px-6 py-3">
															{t("Nx:Vues")}
														</th>
														<th scope="col" className="px-6 py-3">
															{t("Nx:Editeur")}
														</th>
														<th scope="col" className="px-6 py-3">
															{t("Nx:Date prévue")}
														</th>
													</tr>
												</thead>
												<tbody>
													{post.items.map((item) => {
														return <ForumPost key={item.url} {...item} />
													})}
												</tbody>
											</table>
											{post.ctaUrl && post.ctaTitle ? (
												<Button href={post.ctaUrl} className="mt-2 inline-flex gap-2">
													{post.ctaTitle}
												</Button>
											) : null}
										</div>
									) : null}
								</React.Fragment>
							))}
						</div>
					) : (
						<EmptyBlock />
					)}
				</Container>
			</div>
		</LoadingOverlay>
	)
}

export default ForumRoomsWidget
