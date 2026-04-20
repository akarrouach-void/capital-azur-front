import React, { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/router"
import { normalizeNodes } from "./normalizer"
import {
	Container,
	Pagination,
	LoadingOverlay,
	EmptyBlock,
	SelectNative,
	Button,
} from "@/ui"
import {
	useI18n,
	useUpdateEffect,
	useNode,
	useCollectionContext,
	useCollectionFetcher,
} from "@vactorynext/core/hooks"
import { generateTermsSlugFromIds, generateIdsFromTermsSlug } from "@vactorynext/core/lib"
import { TenderCard } from "./TenderCard"

export const config = {
	id: "vactory_tender:list",
}

const TenderListWidget = ({ data }) => {
	const scrollRefPagination = useRef()
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const { systemRoute, path_18n } = useNode()
	const current_page_alias = path_18n[locale]
	const context = useCollectionContext(data)
	const [pager, setPager] = useState(context.pager)
	const [filters, setFilters] = useState(context.filters)

	const defaultPageLimit = 2

	// Extract term slug from node alias and convert it to term id.
	const defaultTag = generateIdsFromTermsSlug(
		systemRoute?._query?.tag,
		context.terms.tags,
		"all"
	)[0]

	const [selectedTag, setSelectedTag] = useState(defaultTag)
	const nodeAliasPath = `${current_page_alias}/{tag}?page={page}`

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(
		nodeAliasPath.replace("{tag}", selectedTag).replace("{page}", pager)
	)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			tag: selectedTag,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_tender",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		setSelectedTag(data?.tag)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			tag: "all",
		})
		setPager(1)
		setSelectedTag("all")
	}

	useUpdateEffect(() => {
		// Update pretty path URL.
		setShallowUrl(
			nodeAliasPath
				.replace(
					"{tag}",
					generateTermsSlugFromIds(selectedTag, context.terms.tags, "all")
				)
				.replace("{page}", pager)
		)

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedTag || selectedTag === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.tag
			} else {
				// Add a theme filter.
				filters.filter.tag = {
					condition: {
						path: "field_vactory_tags.drupal_internal__tid",
						operator: "=",
						value: selectedTag,
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
	}, [selectedTag, pager])

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	return (
		<div ref={scrollRefPagination}>
			<form onSubmit={handleSubmit(submitFilterForm)}>
				<Container>
					<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
						<div>
							<Controller
								name="tag"
								control={control}
								render={({ field: { onChange, onBlur, value } }) => (
									<SelectNative
										list={[
											{ value: "all", label: t("tout les tags") },
											...(context.terms?.tags || []),
										]}
										onChange={onChange}
										onBlur={onBlur}
										id="tag"
										defaultValue={value}
										label={t("Nx:Tags")}
										variant="filter"
									/>
								)}
							/>
						</div>
						<div className="flex flex-col items-center gap-4 md:flex-row">
							<Button id="news-submit" type="submit" variant="primary">
								{t("Nx:Appliquer")}
							</Button>
							<Button
								id="news-reset"
								type="button"
								onClick={resetFilterForm}
								variant="secondary"
							>
								{t("Nx:Renitialiser")}
							</Button>
						</div>
					</div>
				</Container>
			</form>

			<LoadingOverlay active={collection.isLoading} spinner={true}>
				<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
					<Container>
						{posts.length > 0 ? (
							<div className="mx-auto grid gap-5 lg:grid-cols-2">
								{posts.map((node) => (
									<React.Fragment key={node.id}>
										<TenderCard {...node} />
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
						baseUrl={`${shallowUrl.replace(/page=\d/, "page={page}")}`}
						pageSize={filters?.page?.limit || defaultPageLimit}
						contentRef={scrollRefPagination}
						current={pager}
						total={collection.count}
						onChange={(page) => setPager(page)}
						id="tender-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default TenderListWidget
