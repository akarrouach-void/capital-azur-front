import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	countOccurrences,
	removeQueryParamValue,
	useDataHandling,
	generateDefaultValues,
	useListingLayout,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { EventCard } from "./EventCard"
import { normalizeNodes } from "./normalizer"
import {
	Container,
	Pagination,
	LoadingOverlay,
	EmptyBlock,
	Button,
	LayoutSwitcher,
	SelectNative,
	Icon,
	Text,
} from "@/ui"
import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_event:list-favoris",
}

const EventListWidget = ({ data }) => {
	// Switch Layer functionality
	const { listingLayout, switchLayout } = useListingLayout()

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

	// Generate default values for categories and cities
	const allCategories = generateDefaultValues(
		"vactory_event_category",
		t("Nx:tout les thematique"),
		context
	)
	const allCities = generateDefaultValues(
		"vactory_event_citys",
		t("Nx:tout les villes"),
		context
	)

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
		const response = await drupal.fetch(`api/flagging/all/vactory_event`, {
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

	// Extract term slug from node alias and convert it to term id.
	const defaultCategory = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_event_category,
		allCategories.id
	)

	const defaultCity = generateIdsFromTermsSlug(
		systemRoute?._query?.city,
		context.terms.vactory_event_citys,
		allCities.id
	)

	const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
	const [selectedCity, setSelectedCity] = useState(defaultCity)

	const firstQuerySeparator = pager === 1 ? "?" : "&"

	const nodeAliasPath = `${current_page_alias}/{theme}/{city}?page={page}${firstQuerySeparator}display={display}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedCategory === allCategories.id ? allCategories.id : selectedCategory,
			city: selectedCity === allCities.id ? allCities.id : selectedCity,
			display: listingLayout === "grid" ? "" : listingLayout,
		},
		[selectedCategory, selectedCity],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			theme: defaultCategory,
			city: defaultCity,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_event",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedTheme = context.terms?.vactory_event_category.find((theme) => {
			return theme.id === data?.theme
		})
		const selectedCity = context.terms?.vactory_event_citys.find((theme) => {
			return theme.id === data?.city
		})
		setSelectedCategory(data?.theme)
		setSelectedCity(data?.city)
		dlPush("filtre_select", {
			Thématique: selectedTheme?.label || "all",
			Ville: selectedCity?.label || "all",
			"Type contenu": "Evenement",
		})
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allCategories.id,
			city: allCities.id,
		})
		setPager(1)
		setSelectedCategory(allCategories.id)
		setSelectedCity(allCities.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath
			.replace(
				"{theme}",
				generateTermsSlugFromIds(
					selectedCategory,
					context.terms.vactory_event_category,
					allCategories.id
				)
			)
			.replace(
				"{city}",
				generateTermsSlugFromIds(
					selectedCity,
					context.terms.vactory_event_citys,
					allCities.id
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

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length ===
			countOccurrences([selectedCategory, selectedCity], "all")
				? newNodeAliasPath.replaceAll("/all", "")
				: newNodeAliasPath

		setShallowUrl(newNodeAliasPath.replace(/[?&]page=1\b/, ""))
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedCategory || selectedCategory === allCategories.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_vactory_taxonomy_1.drupal_internal__tid",
						operator: "=",
						value: selectedCategory,
					},
				}
			}

			if (!selectedCity || selectedCity === allCities.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.city
			} else {
				// Add a theme filter.
				filters.filter.city = {
					condition: {
						path: "field_vactory_taxonomy_2.drupal_internal__tid",
						operator: "=",
						value: selectedCity,
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
	}, [selectedCategory, selectedCity, pager, listingLayout])

	// Updating pretty path at first load
	useEffect(() => updatePrettyPath(), [loaded])

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
				<div className="flex flex-col items-end gap-5 rounded-xl bg-white p-6 shadow-lg">
					<div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
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
							className="hidden md:flex"
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
					<div className="flex w-full flex-col items-center gap-4 md:flex-row">
						<div className="w-full flex-1">
							<Controller
								name="theme"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={context.terms?.vactory_event_category || []}
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
						</div>
						<div className="flex-1">
							<Controller
								name="city"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={context.terms?.vactory_event_citys || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="city"
										defaultValue={field.value}
										label={t("Nx:Cities")}
										variant="filter"
										name="city"
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex w-full flex-row items-center justify-center gap-4 md:justify-end">
						<Button id="news-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="news-reset"
							type="button"
							onClick={resetFilterForm}
							variant="filter"
							icon={<Icon id="x" className="h-3 w-3" />}
							className="md:hidden"
						>
							{t("Nx:Renitialiser")}
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
							<div
								className={vclsx(
									"mx-auto gap-5",
									listingLayout === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3"
										: "flex flex-col"
								)}
							>
								{posts.map((post) => (
									<React.Fragment key={post.id}>
										<EventCard
											{...post}
											reloadPage={reloadPage}
											listingLayout={listingLayout}
										/>
									</React.Fragment>
								))}
							</div>
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
							pageSize={filters?.page?.limit || defaultPageLimit}
							contentRef={scrollRefPagination}
							current={pager}
							total={collection.count}
							onChange={(page) => setPager(page)}
							id="event-fav-pagination"
						/>
					</Container>
				)}
			</div>
		</div>
	)
}

export default EventListWidget
