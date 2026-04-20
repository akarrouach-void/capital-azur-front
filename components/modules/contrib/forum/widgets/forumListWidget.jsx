import { useState } from "react"
import { useRouter } from "next/router"
import { normalizeNodes } from "./../normalizer"
import { Container, Pagination, LoadingOverlay, EmptyBlock } from "@/ui"
import {
	useI18n,
	useUpdateEffect,
	useNode,
	useCollectionContext,
	useCollectionFetcher,
} from "@vactorynext/core/hooks"
import { generateTermsSlugFromIds, generateIdsFromTermsSlug } from "@vactorynext/core/lib"
import { ForumPost } from "./../components/forumPost"

export const config = {
	id: "vactory_forums:list",
}

const ForumListWidget = ({ data }) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const { systemRoute, path_18n } = useNode()
	const current_page_alias = path_18n[locale]
	const defaultPageLimit = 9
	const context = useCollectionContext(data)
	const [pager, setPager] = useState(context.pager)
	const [filters, setFilters] = useState(context.filters)

	const defaultRoom = generateIdsFromTermsSlug(
		systemRoute?._query?.room,
		context.terms.vactory_forum_room,
		"all"
	)[0]

	const nodeAliasPath = `${current_page_alias}/{room}?page={page}`

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(
		nodeAliasPath.replace("{room}", defaultRoom).replace("{page}", pager)
	)

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_forum",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	useUpdateEffect(() => {
		// Update pretty path URL.
		setShallowUrl(
			nodeAliasPath
				.replace(
					"{room}",
					generateTermsSlugFromIds(defaultRoom, context.terms.vactory_forum_room, "all")
				)
				.replace("{page}", pager)
		)

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!defaultRoom || defaultRoom === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.room
			} else {
				// Add a theme filter.
				filters.filter.room = {
					condition: {
						path: "field_vactory_forum_room.drupal_internal__tid",
						operator: "=",
						value: defaultRoom,
					},
				}
			}

			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}

			return filters
		})
	}, [pager])

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	return (
		<div>
			<LoadingOverlay active={collection.isLoading} spinner={true}>
				<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
					<Container>
						{posts.length > 0 ? (
							<div className="relative overflow-x-auto rounded border border-gray-200">
								<table className="w-full text-left text-sm text-gray-500">
									<thead className="border border-gray-200 bg-gray-50 text-sm uppercase text-gray-700">
										<tr>
											<th scope="col" className="whitespace-nowrap px-6 py-4">
												{t("Nx:Sujet")}
											</th>
											<th scope="col" className="whitespace-nowrap px-6 py-4">
												{t("Nx:Statut")}
											</th>
											<th scope="col" className="whitespace-nowrap px-6 py-4">
												{t("Nx:Vues")}
											</th>
											<th scope="col" className="whitespace-nowrap px-6 py-4">
												{t("Nx:Editeur")}
											</th>
											<th scope="col" className="whitespace-nowrap px-6 py-4">
												{t("Nx:Date prévue")}
											</th>
										</tr>
									</thead>
									<tbody>
										{posts.map((post) => (
											<ForumPost key={post.url} {...post} />
										))}
									</tbody>
								</table>
							</div>
						) : (
							<EmptyBlock />
						)}
					</Container>
				</div>
			</LoadingOverlay>
			{parseInt(collection.count) >
				parseInt(filters?.page?.limit || defaultPageLimit) && (
				<Container className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
					<Pagination
						baseUrl={`${shallowUrl.replace(/page=\d/, "page={page}")}`}
						pageSize={filters?.page?.limit || defaultPageLimit}
						current={pager}
						total={collection.count}
						onChange={(page) => setPager(page)}
						id="forum-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default ForumListWidget
