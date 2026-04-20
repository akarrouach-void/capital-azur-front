import React, { useState, useRef } from "react"
import { normalizeNodes } from "./normalizer"
import { drupal } from "@vactorynext/core/drupal"
import { Pagination, Container, LoadingOverlay, EmptyBlock } from "@/ui"
import {
	useUpdateEffect,
	useCollectionContext,
	useCollectionFetcher,
} from "@vactorynext/core/hooks"
import { AcademyCard } from "./AcademyCard"

export const config = {
	id: "vactory_academy:favorite_listing",
}

const FavoriteAcademy = ({ data }) => {
	const scrollRefPagination = useRef()
	const defaultPageLimit = 9
	const context = useCollectionContext(data)
	const [pager, setPager] = useState(context.pager)
	const [filters, setFilters] = useState(context.filters)

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_academy",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)
	const reloadPage = async () => {
		const nids = await getCurrentUserFalggedArticles()
		setFilters((prev) => {
			let filters = {
				...prev,
			}
			filters.page = {
				...filters.page,
				offset: 0,
			}
			filters.filter.internal_favourite = {
				condition: {
					path: "drupal_internal__nid",
					operator: "IN",
					value: nids?.nids,
				},
			}
			return filters
		})
	}
	const getCurrentUserFalggedArticles = async () => {
		const response = await drupal.fetch(`api/flagging/all/vactory_academy`, {
			withAuth: true,
			method: "GET",
		})
		if (response.ok) {
			return await response.json()
		}
		return []
	}
	useUpdateEffect(async () => {
		const nids = await getCurrentUserFalggedArticles()
		setFilters((prev) => {
			let filters = {
				...prev,
			}
			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}
			filters.filter.internal_favourite = {
				condition: {
					path: "drupal_internal__nid",
					operator: "IN",
					value: nids?.nids,
				},
			}
			return filters
		})
	}, [pager])
	return (
		<div ref={scrollRefPagination}>
			<LoadingOverlay active={collection.isLoading} spinner={true}>
				<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
					<Container>
						{posts.length > 0 ? (
							<div className="mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3">
								{posts.map((post) => (
									<React.Fragment key={post.id}>
										<AcademyCard {...post} reloadPage={reloadPage} />
									</React.Fragment>
								))}
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
						contentRef={scrollRefPagination}
						pageSize={filters?.page?.limit || defaultPageLimit}
						current={pager}
						total={collection.count}
						isLoading={!collection.isLoading}
						onChange={(page) => setPager(page)}
						id="academy-favourite-pagination"
					/>
				</Container>
			)}
		</div>
	)
}
export default FavoriteAcademy
