import { useEffect, useState } from "react"
import {
	Container,
	Pagination,
	LoadingOverlay,
	Button,
	EmptyBlock,
	SelectNative,
	SelectMultipleV2,
	ParentTransition,
	ChildTransitionFromLeft,
	FilterWrapper,
	Icon,
	Text,
} from "@/ui"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"
import {
	countOccurrences,
	generateIdsFromTermsSlug,
	generateIdsFromTermsSlugMultiple,
	generateTermsObjectsFromIds,
	generateTermsSlugFromIds,
	generateDefaultValues,
	useDataHandling,
	getDefaultUrl,
} from "@vactorynext/core/lib"
import { normalizeNodes } from "./normalizer"
import { JobAdsCard } from "./JobAdsCard"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_job_ads:list",
}

const JobAdsListWidget = ({ data }) => {
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

	// Generate default values for contracts, cities, and professions
	const allContracts = generateDefaultValues(
		"vactory_job_ads_contract",
		t("Nx:Select an option"),
		context,
		true
	)
	const allCities = generateDefaultValues(
		"vactory_job_ads_city",
		t("Nx:tout les villes"),
		context
	)
	const allProfessions = generateDefaultValues(
		"vactory_job_ads_profession",
		t("Nx:tout les professions"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultContract = generateIdsFromTermsSlugMultiple(
		systemRoute?._query?.contract.replaceAll(" ", "+"),
		context.terms.vactory_job_ads_contract
	)
	const defaultCity = generateIdsFromTermsSlug(
		systemRoute?._query?.city,
		context.terms.vactory_job_ads_city,
		allCities.id
	)
	const defaultProfession = generateIdsFromTermsSlug(
		systemRoute?._query?.profession,
		context.terms.vactory_job_ads_profession,
		allProfessions.id
	)

	const [selectedContract, setSelectedContract] = useState(defaultContract)
	const [selectedCity, setSelectedCity] = useState(defaultCity)
	const [selectedProfession, setSelectedProfession] = useState(defaultProfession)

	const nodeAliasPath = `${current_page_alias}/{contract}/{profession}/{city}?page={page}`

	// generating a shallow url based on filters values
	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			contract: selectedContract === "" ? "all" : selectedContract,
			profession:
				selectedProfession === allProfessions.id ? allProfessions.id : selectedProfession,
			city: selectedCity === allCities.id ? allCities.id : selectedCity,
		},
		[selectedContract, selectedProfession, selectedCity],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			contract: generateTermsObjectsFromIds(
				selectedContract,
				context.terms.vactory_job_ads_contract
			),
			city: defaultCity,
			profession: defaultProfession,
		},
	})

	// Fetch data based on params filters
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_job_ads",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		setSelectedContract(
			data?.contract === "all"
				? "all"
				: data?.contract?.map((el) => {
						return el.id
					})
		)
		if (showFilters) {
			setshowFilters(false)
		}
		setSelectedCity(data?.city)
		setSelectedProfession(data?.profession)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			contract: allContracts.id,
			city: allCities.id,
			profession: allProfessions.id,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedContract(allContracts.id)
		setSelectedCity(allCities.id)
		setSelectedProfession(allProfessions.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath
			.replace(
				"{contract}",
				generateTermsSlugFromIds(
					selectedContract,
					context.terms.vactory_job_ads_contract,
					allContracts.id
				)
			)
			.replace(
				"{city}",
				generateTermsSlugFromIds(
					selectedCity,
					context.terms.vactory_job_ads_city,
					allCities.id
				)
			)
			.replace(
				"{profession}",
				generateTermsSlugFromIds(
					selectedProfession,
					context.terms.vactory_job_ads_profession,
					allProfessions.id
				)
			)

		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length ===
			countOccurrences([selectedContract, selectedCity, selectedProfession], ["all", ""])
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

			if (!selectedContract || selectedContract === allContracts.id) {
				// try to delete previously set contract filters
				delete filters?.filter?.contract
			} else {
				// Add a contract filter.
				filters.filter.contract = {
					condition: {
						path: "field_vactory_contract.drupal_internal__tid",
						operator: "IN",
						value: selectedContract,
					},
				}
			}

			if (!selectedCity || selectedCity === allCities.id) {
				// try to delete previously set city filters
				delete filters?.filter?.city
			} else {
				// Add a city filter.
				filters.filter.city = {
					condition: {
						path: "field_vactory_city.drupal_internal__tid",
						operator: "=",
						value: selectedCity,
					},
				}
			}

			if (!selectedProfession || selectedProfession === allProfessions.id) {
				// try to delete previously set profession filters
				delete filters?.filter?.profession
			} else {
				// Add a profession filter.
				filters.filter.profession = {
					condition: {
						path: "field_vactory_profession.drupal_internal__tid",
						operator: "=",
						value: selectedProfession,
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
	}, [selectedContract, selectedCity, selectedProfession, pager])

	// Updating pretty path at first load
	useEffect(() => updatePrettyPath(), [loaded])

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
							name="contract"
							control={control}
							render={({ field }) => (
								<SelectMultipleV2
									onChange={field.onChange}
									onBlur={field.onBlur}
									defaultValue={field.value}
									options={context.terms?.vactory_job_ads_contract || []}
									isMulti={true}
									id="contract"
									placeholder={t("Nx:Contract")}
									label={t("Nx:Contract")}
									field={field}
									name="contract"
								/>
							)}
						/>

						<Controller
							name="profession"
							control={control}
							render={({ field }) => (
								<SelectNative
									list={context.terms?.vactory_job_ads_profession || []}
									onChange={field.onChange}
									onBlur={field.onBlur}
									id="profession"
									defaultValue={field.value}
									label={t("Nx:Profession")}
									name="profession"
									variant="filter"
								/>
							)}
						/>
						<Controller
							name="city"
							control={control}
							render={({ field }) => (
								<SelectNative
									list={context.terms?.vactory_job_ads_city || []}
									onChange={field.onChange}
									onBlur={field.onBlur}
									id="city"
									defaultValue={field.value}
									label={t("Nx:Villes")}
									name="city"
									variant="filter"
								/>
							)}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="job-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="job-reset"
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
							id="job-reset"
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
								name="contract"
								control={control}
								render={({ field }) => (
									<SelectMultipleV2
										onChange={field.onChange}
										onBlur={field.onBlur}
										defaultValue={field.value}
										options={context.terms?.vactory_job_ads_contract || []}
										isMulti={true}
										id="contract"
										placeholder={t("Nx:Contract")}
										label={t("Nx:Contract")}
										field={field}
										name="contract"
									/>
								)}
							/>
						</div>
						<div className="flex-1">
							<Controller
								name="profession"
								control={control}
								render={({ field }) => (
									<SelectNative
										list={context.terms?.vactory_job_ads_profession || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="profession"
										defaultValue={field.value}
										label={t("Nx:Profession")}
										name="profession"
										variant="filter"
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
										list={context.terms?.vactory_job_ads_city || []}
										onChange={field.onChange}
										onBlur={field.onBlur}
										id="city"
										defaultValue={field.value}
										label={t("Nx:Villes")}
										name="city"
										variant="filter"
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="job-submit" type="submit" variant="primary">
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
						<motion.div
							variants={ParentTransition}
							initial={"initial"}
							className="mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3"
							key={posts.reduce((prev, curr) => prev + curr.id, "")}
						>
							{posts.map((post, index) => (
								<motion.div
									key={post.id}
									variants={ChildTransitionFromLeft(index)}
									initial="initial" // Set initial state for each child
									whileInView="animate" // Animate this child when it comes into view
									viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view, only once
								>
									<JobAdsCard {...post} />
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
						pageSize={filters?.page?.limit || defaultPageLimit}
						contentRef={scrollRefPagination}
						current={pager}
						total={collection.count}
						onChange={(page) => setPager(page)}
						id="jobs-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default JobAdsListWidget
