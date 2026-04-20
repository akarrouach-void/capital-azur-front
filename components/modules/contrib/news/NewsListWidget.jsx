import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	removeQueryParamValue,
	useDataHandling,
	generateDefaultValues,
	useListingLayout,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import { useEffect, useState } from "react"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	LayoutSwitcher,
	SelectNative,
	ParentTransition,
	ChildTransition,
	FilterWrapper,
	Icon,
	Text,
} from "@/ui"
import { Controller, useForm } from "react-hook-form"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_news:list",
}

const NewsListWidget = ({ data }) => {
	// Switch Layer functionality
	const { listingLayout, switchLayout } = useListingLayout()
	const [showFilters, setshowFilters] = useState(false)

	/**
	 * Custom hook for handling various data-related functionalities,
	 * including pagination, filters, translation, and context.
	 **/
	const {
		scrollRefPagination,
		t,
		router,
		systemRoute,
		current_page_alias,
		defaultPageLimit,
		context,
		pager,
		setPager,
		filters,
		setFilters,
		loaded,
	} = useDataHandling(data)

	// Generate default values for theme
	const allThematic = generateDefaultValues(
		"vactory_news_theme",
		t("Toutes les thématiques"),
		context
	)

	const node_has_views_count =
		data?.components?.[0]?.collection?.optional_data?.node_has_views_count

	// Static Sorting list
	let sortingList = [
		{
			id: "desc",
			value: "desc",
			slug: "desc",
			label: t("Nx:Trier du plus récent au plus ancien"),
		},
		{
			id: "asc",
			value: "asc",
			slug: "asc",
			label: t("Nx:Trier du plus ancien au plus récent"),
		},
	]

	if (node_has_views_count) {
		sortingList = [
			...sortingList,
			{
				id: "popularite",
				value: "popularite",
				slug: "popularite",
				label: t("Nx:Trier par les plus populaires"),
			},
		]
	}

	// Extract term slug from node alias and convert it to term id.
	const defaultTheme = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_news_theme,
		allThematic.id
	)
	const defaultSortEver = "desc"
	const defaultSort = router?.query?.sort || defaultSortEver // @todo: query?.sort must be in asc,desc range
	const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
	const [sortedValue, setSortedValue] = useState(defaultSort)

	// Build query string so the first param is always preceded by "?" (avoids /en/news&display=list).
	const hasSort = sortedValue !== defaultSortEver
	const hasPage = pager !== 1
	const queryParts = []
	if (hasSort) queryParts.push("sort={sort}")
	if (hasPage) queryParts.push("page={page}")
	queryParts.push("display={display}")
	const nodeAliasPath = `${current_page_alias}/{theme}?${queryParts.join("&")}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedTheme === allThematic.id ? allThematic.id : selectedTheme,
			sort: sortedValue === defaultSortEver ? "" : sortedValue, // Remove "desc", keep "asc"
			display: listingLayout === "grid" ? "" : listingLayout,
		},
		[selectedTheme],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)

	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			theme: defaultTheme,
			sort: defaultSort,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_news",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		// get the value of the selected filter
		const selectedTheme = context.terms?.vactory_news_theme.find((theme) => {
			return theme.id === data?.theme
		})

		// trigger data layer event when changing the theme filter
		dlPush("filter_select", {
			Thématique: selectedTheme.label,
			"Type contenu": "Actualités",
		})

		if (showFilters) {
			setshowFilters(false)
		}

		setSelectedTheme(data?.theme)
		setSortedValue(data?.sort)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allThematic.id,
			sort: "desc",
		})

		if (showFilters) {
			setshowFilters(false)
		}

		setPager(1)
		setSelectedTheme(allThematic.id)
		setSortedValue("desc")
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath =
			selectedTheme === allThematic.id
				? nodeAliasPath.replace("/{theme}", "")
				: nodeAliasPath.replace(
						"{theme}",
						generateTermsSlugFromIds(
							selectedTheme,
							context.terms.vactory_news_theme,
							allThematic.id
						)
					)
		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		if (listingLayout === "grid") {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "display={display}")
		}
		newNodeAliasPath = newNodeAliasPath.replace("{display}", listingLayout)

		newNodeAliasPath =
			sortedValue === defaultSortEver
				? removeQueryParamValue(newNodeAliasPath, "sort={sort}")
				: newNodeAliasPath.replace("{sort}", sortedValue)

		setShallowUrl(
			pager === 1
				? newNodeAliasPath.replace(/[?&]page=1\b/, "").replace("&sort", "?sort")
				: newNodeAliasPath.replace(/[?&]page=1\b/, "")
		)
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedTheme || selectedTheme === allThematic.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_vactory_news_theme.drupal_internal__tid",
						operator: "=",
						value: selectedTheme,
					},
				}
			}

			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}

			// Update sort.
			if (sortedValue == "popularite") {
				filters.sort = {
					"sort-popularite": {
						direction: "DESC",
						path: "field_node_count_view",
					},
				}
			} else {
				filters.sort = {
					"sort-vactory-date": {
						path: "field_vactory_date",
						direction: sortedValue,
					},
				}
			}

			return filters
		})
	}, [selectedTheme, sortedValue, pager, listingLayout])

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	// Reset filters and pagination when route changes
	useEffect(() => {
		current_page_alias == `/${router.locale + router.asPath}` && resetFilterForm()
	}, [router])

	return (
		<div ref={scrollRefPagination}>
			<form onSubmit={handleSubmit(submitFilterForm)}>
				<FilterWrapper showFilters={showFilters} setshowFilters={setshowFilters}>
					<div className="mb-6 flex flex-col gap-5">
						<Controller
							name="theme"
							control={control}
							render={({ field }) => (
								<SelectNative
									list={context.terms?.vactory_news_theme || []}
									onChange={field.onChange}
									onBlur={field.onBlur}
									id="theme"
									defaultValue={field.value}
									label={t("Nx:Thématique")}
									variant="filter"
									name="theme"
								/>
							)}
						/>

						<Controller
							name="sort"
							control={control}
							render={({ field }) => (
								<SelectNative
									list={sortingList || []}
									onChange={field.onChange}
									onBlur={field.onBlur}
									id="sort"
									defaultValue={field.value}
									label={t("Nx:Filtrer par date")}
									variant="filter"
									name="sort"
								/>
							)}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
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
				</FilterWrapper>
				<div className="hidden flex-col items-end gap-5 rounded-xl bg-white p-6 shadow-lg md:flex">
					<div className="flex w-full items-center justify-between">
						<Text className="flex items-center gap-2 text-lg font-semibold">
							<Icon id="control-panel" className="h-4 w-4" />
							{t("Nx:Filtres et recherche")}
						</Text>
						<Button
							id="news-reset"
							type="button"
							onClick={resetFilterForm}
							variant="filter"
							icon={<Icon id="x" className="h-3 w-3" />}
							data-testid="news-reset-filter"
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
					<div className="flex w-full items-center gap-4">
						<div className="flex-1">
							<Controller
								name="theme"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={context.terms?.vactory_news_theme || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="theme"
										defaultValue={field.value}
										label={t("Nx:Thématique")}
										variant={"filter"}
										name="theme"
										data-testid="news-theme-filter"
									/>
								)}
							/>
						</div>
						<div className="flex-1">
							<Controller
								name="sort"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={sortingList || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="sort"
										defaultValue={field.value}
										label={t("Nx:Filtrer par date")}
										variant={"filter"}
										name="sort"
										data-testid="news-sort-filter"
									/>
								)}
							/>
						</div>
					</div>

					<div className="flex flex-row items-center justify-center gap-4">
						<Button
							id="news-submit"
							type="submit"
							variant="primary"
							data-testid="news-submit-filter"
						>
							{t("Nx:Appliquer")}
						</Button>
					</div>
				</div>
			</form>
			<div
				className={vclsx(
					"animate",
					loaded ? "visible opacity-100" : "invisible opacity-0"
				)}
			>
				{/* Layout Switcher */}
				<LayoutSwitcher listingLayout={listingLayout} switchLayout={switchLayout} />

				<LoadingOverlay active={collection.isLoading} spinner={true}>
					<div className="relative pb-4 pt-4 lg:pb-8 lg:pt-8">
						<Text variant="medium" className="mb-5">{`${collection?.count || 0} ${t(
							"Nx:articles found"
						)}`}</Text>
						{posts.length > 0 ? (
							<motion.div
								variants={ParentTransition}
								initial={"initial"}
								className={vclsx(
									"mx-auto gap-5",
									listingLayout === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3"
										: "flex flex-col"
								)}
								key={posts.reduce((prev, curr) => prev + curr.id, "")}
							>
								{posts.map((post, index) => (
									<motion.div
										key={post.id}
										variants={ChildTransition(index)}
										initial="initial" // Set initial state for each child
										whileInView="animate" // Animate this child when it comes into view
										viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view, only once
									>
										<NewsCard {...post} listingLayout={listingLayout} />
									</motion.div>
								))}
							</motion.div>
						) : (
							<EmptyBlock />
						)}
					</div>
				</LoadingOverlay>
				{parseInt(collection.count) >
					parseInt(filters?.page?.limit || defaultPageLimit) && (
					<Container className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
						<Pagination
							baseUrl={`${paginationShallowUrl.replace(/page=\d+/, "page={page}")}`}
							contentRef={scrollRefPagination}
							pageSize={filters?.page?.limit || defaultPageLimit}
							current={pager}
							total={collection.count}
							isLoading={!collection.isLoading}
							onChange={(page) => setPager(page)}
							id="news-pagination"
						/>
					</Container>
				)}
			</div>
		</div>
	)
}

export default NewsListWidget
