import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	useDataHandling,
	generateDefaultValues,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { normalizeNodes } from "./normalizer"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	SelectNative,
	FilterWrapper,
	Icon,
	Text,
} from "@/ui"
import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import { TestimonialCard } from "./TestimonialCard"

export const config = {
	id: "vactory_testimonials:list",
}

const TestimonialListWidget = ({ data }) => {
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

	// Generate default values for years, types, and themes
	const allProfiles = generateDefaultValues(
		"vactory_testimonials_profils",
		t("Nx:Toutes les profiles"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultProfile = generateIdsFromTermsSlug(
		systemRoute?._query?.profile,
		context.terms.vactory_testimonials_profils,
		allProfiles.id
	)
	const [selectedProfile, setSelectedProfile] = useState(defaultProfile)
	const nodeAliasPath = `${current_page_alias}/{profile}?page={page}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			profile: selectedProfile === allProfiles.id ? allProfiles.id : selectedProfile,
		},
		[selectedProfile],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			profile: defaultProfile,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_testimonials",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedProfile = context.terms?.vactory_testimonials_profils.find((theme) => {
			return theme.id === data?.profile
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setSelectedProfile(data?.profile)
		dlPush("filtre_select", {
			Profile: selectedProfile?.label || "all",
			"Type contenu": "Testimonials",
		})

		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			profile: allProfiles.id,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedProfile(allProfiles.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath =
			selectedProfile === allProfiles.id
				? nodeAliasPath.replace("/{profile}", "")
				: nodeAliasPath.replace(
						"{profile}",
						generateTermsSlugFromIds(
							selectedProfile,
							context.terms.vactory_testimonials_profils,
							allProfiles.id
						)
					)
		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		setShallowUrl(newNodeAliasPath.replace(/[?&]page=1\b/, ""))
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedProfile || selectedProfile === allProfiles.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.profile
			} else {
				// Add a theme filter.
				filters.filter.profile = {
					condition: {
						path: "field_vactory_profils.drupal_internal__tid",
						operator: "=",
						value: selectedProfile,
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
	}, [selectedProfile, pager])

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
							name="profile"
							control={control}
							render={({ field }) => (
								<SelectNative
									list={context.terms?.vactory_testimonials_profils || []}
									onChange={field.onChange}
									onBlur={field.onBlur}
									id="profile"
									defaultValue={field.value}
									label={t("Nx:Profiles")}
									variant="filter"
									name="profile"
								/>
							)}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="testimonials-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="testimonials-reset"
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
							id="testimonials-reset"
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
								name="profile"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={context.terms?.vactory_testimonials_profils || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="profile"
										defaultValue={field.value}
										label={t("Nx:Profiles")}
										variant="filter"
										name="profile"
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col items-center gap-4 md:flex-row">
						<Button id="testimonials-submit" type="submit" variant="primary">
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
						<div className="mx-auto grid gap-6 lg:grid-cols-3">
							{posts.map((post) => (
								<React.Fragment key={post.id}>
									<TestimonialCard {...post} />
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
						contentRef={scrollRefPagination}
						pageSize={filters?.page?.limit || defaultPageLimit}
						current={pager}
						total={collection.count}
						isLoading={!collection.isLoading}
						onChange={(page) => setPager(page)}
						id="testimonial-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default TestimonialListWidget
