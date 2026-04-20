import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"

import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	useDataHandling,
	generateDefaultValues,
	dlPush,
	getDefaultUrl,
	countOccurrences,
} from "@vactorynext/core/lib"

import {
	Text,
	Button,
	SelectNative,
	LoadingOverlay,
	Pagination,
	Icon,
	EmptyBlock,
	FilterWrapper,
} from "@/ui"
import LocatorCard from "./LocatorCard"

export const config = {
	id: "vactory_locator:locator-list",
}

const StoreLocatoreWidget = ({ data }) => {
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
	const allCities = generateDefaultValues(
		"locator_city",
		t("Nx:Toutes les Ville"),
		context
	)

	//if(true) return <div>test</div>

	// Extract term slug from node alias and convert it to term id.
	const defaultCity = generateIdsFromTermsSlug(
		systemRoute?._query?.city,
		context.terms.locator_city,
		allCities.id
	)

	const [selectedCity, setSelectedCity] = useState(defaultCity)
	const nodeAliasPath = `${current_page_alias}/{city}?page={page}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			city: selectedCity === allCities.id ? allCities.id : selectedCity,
		},
		[selectedCity],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)

	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			city: defaultCity,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "locator_entity",
		bundle: "vactory_locator",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	const posts = collection.posts || []

	// Submit filter form.
	const submitFilterForm = (data) => {
		// get the value of the selected filter
		const selectedCity = context.terms?.locator_city.find((city) => {
			return city.id === data?.city
		})

		// trigger data layer event when changing the theme filter
		dlPush("filter_select", {
			city: selectedCity.label,
			"Type contenu": "Locator",
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setSelectedCity(data?.city)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			city: allCities.id,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedCity(allCities.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath.replace(
			"{city}",
			generateTermsSlugFromIds(selectedCity, context.terms.locator_city, allCities.id)
		)

		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length === countOccurrences([selectedCity], ["all", ""])
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

			if (!selectedCity || selectedCity === allCities.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.city
			} else {
				// Add a theme filter.

				filters.filter = {
					city: {
						condition: {
							path: "field_locator_city.tid",
							operator: "IN",
							value: selectedCity,
						},
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
	}, [selectedCity, pager])

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
				<FilterWrapper showFilters={showFilters} setshowFilters={setshowFilters}>
					<div className="mb-6 flex flex-col gap-5">
						<Controller
							name="city"
							control={control}
							render={({ field }) => (
								<SelectNative
									list={context.terms?.locator_city || []}
									onChange={field.onChange}
									onBlur={field.onBlur}
									id="city"
									defaultValue={field.value}
									label={t("Nx:Ville")}
									variant="filter"
									name="city"
								/>
							)}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="locator-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="locator-reset"
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
							id="locator-reset"
							type="button"
							onClick={resetFilterForm}
							variant="filter"
							icon={<Icon id="x" className="h-3 w-3" />}
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
					<div className="flex w-full items-center gap-4">
						<div className="flex-1">
							<Controller
								name="city"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={context.terms?.locator_city || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="city"
										defaultValue={field.value}
										label={t("Nx:Ville")}
										variant="filter"
										name="city"
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="locator-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
					</div>
				</div>
			</form>
			<LoadingOverlay active={collection.isLoading} spinner={true}>
				<div className="relative pb-4 pt-4 lg:pb-8 lg:pt-8">
					<Text variant="medium" className="mb-5">{`${collection?.count || 0} ${t(
						"Nx:articles found"
					)}`}</Text>
					{posts.length > 0 ? (
						<div className="space-y-4 overflow-y-scroll">
							{posts.map((post) => (
								<LocatorCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<EmptyBlock />
					)}
				</div>
			</LoadingOverlay>
			{parseInt(collection.count) >
				parseInt(filters?.page?.limit || defaultPageLimit) && (
				<div className="px-4 py-6 pb-4 sm:px-6 lg:px-8 lg:pb-8">
					<Pagination
						baseUrl={`${paginationShallowUrl.replace(/page=\d+/, "page={page}")}`}
						contentRef={scrollRefPagination}
						pageSize={filters?.page?.limit || defaultPageLimit}
						current={pager}
						total={collection.count}
						isLoading={!collection.isLoading}
						onChange={(page) => setPager(page)}
						id="locator-pagination"
					/>
				</div>
			)}
		</div>
	)
}

export default StoreLocatoreWidget
