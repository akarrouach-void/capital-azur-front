import { memo } from "react"
import { drupal } from "@vactorynext/core/drupal"
import {
	getEnabledMenus,
	DEFAULT_JSONAPI_NODE_PARAMS,
	query as queryBuild,
} from "@vactorynext/core/lib"

import {
	getTranslations,
	getMenus,
	redirectsHelper,
	redis,
	checkDrupalHealth,
} from "@vactorynext/core/server"

import { TemplatesMapping } from "@/runtime/nodes-templates"
import { NodeParamsMapping } from "@/runtime/nodes-params"
import { getSession, getCsrfToken } from "next-auth/react"
import { SessionExpiration } from "@/account"
import loadThemeLayout from "@/themes/.runtime"
import { Wysiwyg, Text } from "@/ui"
import { getServerSidePropsFlags } from "@vactory/console/server"
import cookie from "cookie"
import {
	NodeDefault,
	NodePageHtml,
	NodePageComponent,
	getSystemRouteExceptionInfos,
} from "@vactorynext/core/config-client"
import projectConfig from "../project.config"
import { updateFlag } from "@vactory/console/lib/database/flags"

// Helper function to handle Drupal health check and offline flags
const handleHealthCheck = async (clientFlags) => {
	const isHealthy = await checkDrupalHealth()
	const isManualOverride = clientFlags?.system__offlineManualOverride === true

	if (!isHealthy) {
		// Backend is down - force enable offline mode (and clear manual override if it was set)
		updateFlag("system__enableOffline", true)
		updateFlag("system__showOfflineMessage", true)
		if (isManualOverride) {
			updateFlag("system__offlineManualOverride", false)
		}
	} else if (isHealthy && isManualOverride) {
		// Backend is up but offline mode is manually overridden - force enable offline mode
		console.log("✈️  Offline mode is manually enabled, keeping it active")
		updateFlag("system__enableOffline", true)
		updateFlag("system__showOfflineMessage", true)
	} else {
		// Backend is up and no manual override - disable offline mode
		updateFlag("system__enableOffline", false)
		updateFlag("system__showOfflineMessage", false)
	}
}

// Helper function to validate language support
const validateLanguageSupport = (context) => {
	const urlPath = context.req.url
	const pathParts = urlPath.split("/").filter(Boolean)

	return pathParts.find(
		(part) => part.length === 2 && !projectConfig.languages.enabled.includes(part)
	)
}

// Helper function to create standardized error response
const createErrorResponse = (
	context,
	session,
	error,
	statusCode,
	i18n = [],
	menus = [],
	flags = {}
) => {
	const cookies = context.req.headers.cookie
		? cookie.parse(context.req.headers.cookie)
		: {}

	return {
		props: {
			session,
			node: {},
			systemRoute: getSystemRouteExceptionInfos(error, statusCode, session),
			params: null,
			i18n,
			menus,
			locale: context.locale,
			error: { statusCode },
			currentPath: context.req ? context.req.url : null,
			flags,
			projectThemeCookie: cookies?.projectThemeCookie || "light",
			listingType: cookies?.listingType || "",
		},
	}
}

// Helper function to handle maintenance mode
const handleMaintenanceMode = (
	context,
	session,
	serverFlags,
	i18n,
	menus,
	clientFlags
) => {
	if (serverFlags.get("maintenanceMode") !== true) return null

	const cookies = context.req.headers.cookie
		? cookie.parse(context.req.headers.cookie)
		: {}

	return {
		props: {
			session,
			node: {},
			systemRoute: getSystemRouteExceptionInfos("Maintenance", 500, session),
			params: null,
			i18n,
			menus,
			locale: context.locale,
			error: { statusCode: 500 },
			currentPath: context.req ? context.req.url : null,
			flags: clientFlags,
			projectThemeCookie: cookies?.projectThemeCookie || "light",
			listingType: cookies?.listingType || "",
		},
	}
}

// Helper function to fetch translations and menus in parallel
const fetchTranslationsAndMenus = async (locale, session, uid, clientFlags) => {
	const [i18n, menus] = await Promise.all([
		getTranslations(locale, {
			auth: session,
			uid,
			locale,
		}),
		getMenus(
			clientFlags?.system__menus ? clientFlags?.system__menus.split(",") : enabledMenus,
			locale,
			{
				auth: session,
				uid,
				locale,
			}
		),
	])

	return { i18n, menus }
}

// Helper function to handle router logic with caching
const handleRouterLogic = async (
	joinedSlug,
	locale,
	session,
	accessToken,
	uid,
	query
) => {
	let routerOptions = {}

	if (accessToken) {
		routerOptions["withAuth"] = () => `Bearer ${accessToken}`
		routerOptions["headers"] = {
			"X-Auth-Provider": session.provider,
		}
	}

	const { revision } = query
	const revisionKey = revision ?? 0

	const cacheKey = `router:${joinedSlug} language:${locale} ${uid} rev:${revisionKey}`
	const cached = await redis.get(cacheKey)

	if (cached) {
		return JSON.parse(cached)
	}
	const routerResponse = await drupal.getRoute(
		joinedSlug,
		locale,
		routerOptions,
		!!revision
	)
	const router = await routerResponse.json()

	await redis.set(cacheKey, JSON.stringify(router), "EX", process.env.REDIS_ROUTER_EXPIRE)

	return router
}

// Helper function to build canonical URL from context
const buildCanonicalUrl = (context, fullHost) => {
	const { serverFlags } = getServerSidePropsFlags()
	const defaultAllowedParams = ["page", "sort"]
	const additionalParams = serverFlags.get("canonicalAllowedParams")
	const configuredParams = additionalParams
		? additionalParams
				.split(",")
				.map((p) => p.trim())
				.filter(Boolean)
		: []
	const allowedParams = new Set([...defaultAllowedParams, ...configuredParams])
	const defaultLanguage = serverFlags.get("language")

	const resolvedUrl = context.resolvedUrl
	const locale = context.locale ? String(context.locale) : ""
	const urlObj = new URL(`${fullHost}${resolvedUrl}`)
	const pathname = urlObj.pathname === "/" ? "" : urlObj.pathname

	const filteredParams = new URLSearchParams()
	for (const [key, value] of urlObj.searchParams.entries()) {
		if (allowedParams.has(key)) {
			filteredParams.append(key, value)
		}
	}
	const filteredQuery = filteredParams.toString()

	let langcode = `/${locale}`
	if (pathname === "" && locale === defaultLanguage) {
		langcode = ""
	}

	const queryString = filteredQuery ? `?${filteredQuery}` : ""
	return `${urlObj.origin}${langcode}${pathname}${queryString}`
}

// Helper function to process a single canonical URL metatag
const processCanonicalTag = (tag, context, fullHost, backendBase) => {
	if (context.resolvedUrl) {
		tag.attributes.href = buildCanonicalUrl(context, fullHost)
		tag.attributes["data-canonical-info"] =
			"Allowed query params are managed via console."
	} else if (tag.attributes?.href?.startsWith(backendBase)) {
		tag.attributes.href = tag.attributes.href.replace(backendBase, fullHost)
	}
}

// Helper function to process metatags
const processMetatags = (node, context) => {
	if (!node?.internal_metatag) return []

	return node.internal_metatag.map((tag) => {
		const host = context?.req.headers.host
		const protocol =
			context.req.headers["x-forwarded-proto"] ||
			(context.req.socket?.encrypted ? "https" : "http")
		const fullHost = `${protocol}://${host}`
		const backendBase = process.env.DRUPAL_BASE_URL
		const frontendBase = process.env.NEXT_BASE_URL

		if (tag?.id === "canonical_url") {
			processCanonicalTag(tag, context, fullHost, backendBase)
		} else if (tag.attributes?.href?.startsWith(backendBase)) {
			tag.attributes.href = tag.attributes.href.replace(backendBase, frontendBase)
		}

		return tag
	})
}

// Helper function to handle redirect logic
const handleRedirectLogic = (context, router, locale) => {
	// Check for router redirects
	if (router?.redirect?.length) {
		const [redirect] = router.redirect
		return {
			redirect: {
				destination: redirect.to,
				permanent: redirect.status === "301",
			},
		}
	}

	// Handle redirects with locale
	const { pathname, search } = new URL(context.req.url, process.env.NEXT_BASE_URL)
	const path = `/${locale}${pathname}`
	const fullPath = search ? `${path}${search}` : path

	if (redirectsHelper.hasRedirect(fullPath)) {
		return {
			redirect: {
				destination: redirectsHelper.getRedirectFor(fullPath),
				permanent: true,
			},
		}
	}

	// Handle redirects without locale
	const path_without_locale = pathname
	const fullPath_without_locale = search
		? `${path_without_locale}${search}`
		: path_without_locale

	if (redirectsHelper.hasRedirect(fullPath_without_locale)) {
		return {
			redirect: {
				destination: redirectsHelper.getRedirectFor(fullPath_without_locale),
				permanent: true,
			},
		}
	}

	return null
}

// Helper function to handle node fetching and processing
const handleNodeFetching = async (params) => {
	let {
		router,
		nodeParams,
		locale,
		joinedSlug,
		session,
		accessToken,
		uid,
		queryParams,
		context,
	} = params

	let nodeOptions = {
		withCache: false,
		cacheKey: `node:${router.entity.id} user:${uid} language:${locale} locale routes route_match http_response`,
	}

	if (accessToken) {
		nodeOptions["withAuth"] = () => `Bearer ${accessToken}`
		nodeOptions["headers"] = {
			"X-Auth-Provider": session.provider,
		}
	}

	let joinedSlugKey = queryParams == "" ? joinedSlug : `${joinedSlug}?${queryParams}`
	joinedSlugKey = `/${joinedSlugKey}`.replace("//", "/")
	const cacheKey = `node:${router.entity.id} bundle:${router.entity.bundle} language:${locale} user:${uid} slug:${joinedSlugKey}`
	const cached = await redis.get(cacheKey)

	let node
	if (cached) {
		node = JSON.parse(cached)
	} else {
		if ("revision" in (nodeParams?.q || [])) {
			nodeParams = { ...nodeParams, resourceVersion: "id:" + nodeParams?.q?.revision }
		}
		node = await drupal.getNode(router, nodeParams, locale, joinedSlug, nodeOptions)
		if (!node.internal_extra.cache_exclude) {
			await redis.set(cacheKey, JSON.stringify(node), "EX", process.env.REDIS_NODE_EXPIRE)
		}
	}

	// Process body and HTML classes
	let body_classes = ["relative"]
	let html_classes = []
	const node_blocks = node.internal_blocks || []

	for (const blk of node_blocks) {
		if (blk?.body_classes) {
			const classes = blk.body_classes.split(" ").filter(Boolean)
			body_classes.push(...classes)
		}
		if (blk?.html_classes) {
			const classes = blk.html_classes.split(" ").filter(Boolean)
			html_classes.push(...classes)
		}
	}

	// Add additional node properties
	node._theme = node?.internal_extra?.theme || "default"
	node.csrfTokenAuth = await getCsrfToken(context)
	node.csrfToken = context.res.getHeader("X-CSRF-Token") || "missing"
	node.internal_metatag = processMetatags(node, context)
	node._NEXT_PUBLIC_ENV = JSON.stringify({
		NEXT_BASE_URL: process.env.NEXT_BASE_URL,
		DRUPAL_BASE_URL: process.env.DRUPAL_BASE_URL,
	})

	return { node, body_classes, html_classes }
}

// Helper function to build filtered query based on allowed params
const buildFilteredQuery = (query, serverFlags) => {
	if (Object.keys(query).length === 0) return { queryParams: "", queryObj: null }

	const allowedQueryParams =
		serverFlags
			?.get("allowedQueryParams")
			?.split(",")
			?.map((p) => p.trim())
			?.filter(Boolean) ?? []

	const filteredQuery =
		allowedQueryParams.length > 0
			? Object.fromEntries(
					allowedQueryParams
						.filter((param) => param in query)
						.map((param) => [param, query[param]])
				)
			: query

	if (Object.keys(filteredQuery).length === 0) return { queryParams: "", queryObj: null }

	return {
		queryParams: queryBuild(filteredQuery),
		queryObj: { ...filteredQuery },
	}
}

// Helper function to prepare node params for API request
const prepareNodeParams = (router, query, serverFlags) => {
	const mappingSource = NodeParamsMapping[router.jsonapi.resourceName]
	const nodeParams = mappingSource ? structuredClone(mappingSource) : {}

	if (nodeParams?.fields?.[router.jsonapi.resourceName]) {
		nodeParams.fields[router.jsonapi.resourceName] =
			DEFAULT_JSONAPI_NODE_PARAMS + "," + nodeParams.fields[router.jsonapi.resourceName]
	}

	const { queryParams, queryObj } = buildFilteredQuery(query, serverFlags)

	if (queryObj) {
		nodeParams["q"] = queryObj
	}

	if (router?.system?._query) {
		nodeParams["q"] = {
			...nodeParams["q"],
			...router.system._query,
		}
	}

	return { nodeParams, queryParams }
}

const enabledMenus = getEnabledMenus()

// Memoized NodePage component to prevent unnecessary re-renders
const NodePage = memo(
	function NodePage(props) {
		return (
			<NodePageComponent
				{...props}
				TemplatesMapping={TemplatesMapping}
				NodeDefault={NodeDefault}
				Text={Text}
				Wysiwyg={Wysiwyg}
				NodePageHtml={NodePageHtml}
				SessionExpiration={SessionExpiration}
			/>
		)
	},
	(prevProps, nextProps) => {
		// Only re-render if node id or locale changes
		return (
			prevProps.node?.id === nextProps.node?.id &&
			prevProps.locale === nextProps.locale &&
			prevProps.systemRoute?.status === nextProps.systemRoute?.status
		)
	}
)

NodePage.displayName = "NodePage"

NodePage.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}

export default NodePage

export async function getServerSideProps(context) {
	const { serverFlags, clientFlags } = getServerSidePropsFlags()

	// Parallelize independent initialization operations
	await Promise.all([handleHealthCheck(clientFlags), redirectsHelper.initialize()])

	const { slug, ...query } = context.query
	const { locale } = context
	let joinedSlug = Array.isArray(slug) ? slug.join("/") : slug

	// Parse cookies
	const cookies = context.req.headers.cookie
		? cookie.parse(context.req.headers.cookie)
		: {}

	// Validate language support
	const unsupportedLang = validateLanguageSupport(context)
	if (unsupportedLang) {
		context.res.statusCode = 404
		return createErrorResponse(context, null, "Page not found", 404)
	}

	// Ensure slug is not empty
	if (!joinedSlug) {
		joinedSlug = "/"
	}

	// Handle session
	const session = await getSession({ req: context.req })
	const accessToken = session?.accessToken || null
	const uid = session?.user?.id || 0

	let i18n = [],
		menus = []

	// Check maintenance mode
	const maintenanceResponse = handleMaintenanceMode(
		context,
		session,
		serverFlags,
		i18n,
		menus,
		clientFlags
	)
	if (maintenanceResponse) return maintenanceResponse

	// Parallelize translations/menus and router fetching since they're independent
	let router
	try {
		const [translationsAndMenus, routerData] = await Promise.all([
			fetchTranslationsAndMenus(locale, session, uid, clientFlags),
			handleRouterLogic(joinedSlug, locale, session, accessToken, uid, context.query),
		])

		i18n = translationsAndMenus.i18n
		menus = translationsAndMenus.menus
		router = routerData
	} catch (err) {
		console.error(err)
		const statusCode = err?.statusCode || 500
		context.res.statusCode = statusCode
		return createErrorResponse(
			context,
			session,
			err,
			statusCode,
			i18n,
			menus,
			clientFlags
		)
	}

	// Handle redirects
	const redirectResult = handleRedirectLogic(context, router, locale)
	if (redirectResult) return redirectResult

	// Set HTTP status code
	context.res.statusCode = router.status

	// Prepare node params and query filtering
	const { nodeParams, queryParams } = prepareNodeParams(router, query, serverFlags)

	// Handle node fetching
	try {
		const { node, body_classes, html_classes } = await handleNodeFetching({
			router,
			nodeParams,
			locale,
			joinedSlug,
			session,
			accessToken,
			uid,
			queryParams,
			context,
		})

		return {
			props: {
				session,
				node,
				params: Object.keys(query).length > 0 ? query : null,
				i18n,
				menus,
				locale,
				systemRoute: router?.system
					? { ...router.system, status: router.status }
					: { status: router.status },
				document: {
					htmlClass: html_classes.join(" "),
					bodyClass: body_classes.join(" "),
				},
				flags: clientFlags,
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: cookies?.listingType || "",
			},
		}
	} catch (err) {
		console.error(err)
		const statusCode = err?.statusCode || 500
		context.res.statusCode = statusCode
		return createErrorResponse(
			context,
			session,
			err,
			statusCode,
			i18n,
			menus,
			clientFlags
		)
	}
}
