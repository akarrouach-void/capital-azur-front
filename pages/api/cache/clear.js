import { redis, redisOffline, isHttpMethod } from "@vactorynext/core/server"

// Helper function to validate environment and secret
const validateAccess = (req) => {
	const secret = req.headers["x-cache-secret"] || ""

	if (process.env.CACHE_SECRET === undefined) {
		return {
			valid: false,
			error: "CACHE_SECRET environment variable not specified!",
			status: 500,
		}
	}

	if (process.env.CACHE_SECRET !== secret) {
		return { valid: false, error: "secret key doesn't match", status: 500 }
	}

	return { valid: true }
}

// Helper function to clear keys using pipeline
const clearRedisKeys = async (keys, pipeline) => {
	if (keys.length === 0) return 0

	keys.forEach((key) => {
		pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
	})
	await pipeline.exec()
	return keys.length
}

// Helper function to handle node cache invalidation
const handleNodeInvalidation = async (req, pipeline) => {
	if (!req?.query?.id) return

	const keys = await redis.keys(`*node:${req.query.id}*`)
	const count = await clearRedisKeys(keys, pipeline)

	if (count > 0) {
		console.log(
			`[Cache]: clearing cache for node ${req.query.id} using redis pattern *node:${req.query.id}*, found ${count} items in cache`
		)
	} else {
		console.log(
			`[Cache]: No cache found for node ${req.query.id} using redis pattern *node:${req.query.id}*`
		)
	}
}

// Helper function to handle menu cache invalidation
const handleMenuInvalidation = async (req, pipeline) => {
	if (!req?.query?.menu) return

	const keys = await redis.keys(`*config:system.menu.${req.query.menu}*`)
	const count = await clearRedisKeys(keys, pipeline)

	if (count > 0) {
		console.log(
			`[Cache]: clearing cache for menu ${req.query.menu} using redis pattern *menus:*:${req.query.menu}, found ${count} items in cache`
		)
	} else {
		console.log(
			`[Cache]: No cache found for menu ${req.query.menu} using redis pattern *menus:*:${req.query.menu}`
		)
	}
}

// Helper function to handle translation cache invalidation
const handleTranslationInvalidation = async (pipeline) => {
	const keys = await redis.keys(`*i18n*`)
	const count = await clearRedisKeys(keys, pipeline)

	if (count > 0) {
		console.log(`[Cache]: clearing cache for translations`)
	} else {
		console.log(`[Cache]: No cache found for translations`)
	}
}

// Helper function to handle slugs cache invalidation
const handleSlugsInvalidation = async (req, pipeline) => {
	for (let key in req.query) {
		if (key.startsWith("slugs")) {
			const keys = await redis.keys(`*slug:${req.query[key]}`)
			const count = await clearRedisKeys(keys, pipeline)

			if (count > 0) {
				console.log(
					`[Cache]: clearing cache for slug ${req.query[key]} using redis pattern *slug:${req.query[key]}, found ${count} items in cache`
				)
			} else {
				console.log(
					`[Cache]: No cache found for slug ${req.query[key]} using redis pattern *slug:${req.query[key]}`
				)
			}
		}
	}
}

// Helper function to handle bundles cache invalidation
const handleBundlesInvalidation = async (req, pipeline) => {
	for (let key in req.query) {
		if (key.startsWith("bundles")) {
			const keys = await redis.keys(`*bundle:${req.query[key]}*`)
			const count = await clearRedisKeys(keys, pipeline)

			if (count > 0) {
				console.log(
					`[Cache]: clearing cache for bundle ${req.query[key]} using redis pattern *bundle:${req.query[key]}*, found ${count} items in cache`
				)
			} else {
				console.log(
					`[Cache]: No cache found for bundle ${req.query[key]} using redis pattern *bundle:${req.query[key]}*`
				)
			}
		}
	}
}

// Helper function to handle router cache invalidation
const handleRouterInvalidation = async (req, pipeline) => {
	if (!req?.query?.slug) return

	const keys = await redis.keys(`*router:${req.query.slug}*`)
	const count = await clearRedisKeys(keys, pipeline)

	if (count > 0) {
		console.log(
			`[Cache]: clearing cache for route ${req.query.slug} using redis pattern *router:${req.query.slug}*, found ${count} items in cache`
		)
	} else {
		console.log(
			`[Cache]: No cache found for route ${req.query.slug} using redis pattern *route:${req.query.slug}*`
		)
	}
}

// Helper function to handle specific cache invalidation types
const handleSpecificInvalidation = async (req) => {
	console.log(
		`[Cache]: received command to clear ${req.query.invalidate} cache`,
		req.query
	)
	const pipeline = redis.pipeline()

	switch (req.query.invalidate) {
		case "node":
			await handleNodeInvalidation(req, pipeline)
			break
		case "menu":
			await handleMenuInvalidation(req, pipeline)
			break
		case "translation":
			await handleTranslationInvalidation(pipeline)
			break
		case "slugs":
			await handleSlugsInvalidation(req, pipeline)
			break
		case "bundles":
			await handleBundlesInvalidation(req, pipeline)
			break
		case "router":
			await handleRouterInvalidation(req, pipeline)
			break
		case "redirections":
			redis.del("__REDIRECTS")
			break
	}
}

export default async function handler(req, res) {
	isHttpMethod(req, res, ["GET"])

	// Validate access
	const validation = validateAccess(req)
	if (!validation.valid) {
		res.status(validation.status).json({ status: validation.error })
		return
	}

	// Handle offline cache invalidation
	if (req?.query?.invalidateOffline) {
		console.log(`[Cache]: received command to clear all offline caches`)
		await redisOffline.flushall()
		res.status(200).json({ status: "Offline Cache cleared" })
		return
	}

	// Handle specific cache invalidation
	if (req?.query?.invalidate) {
		await handleSpecificInvalidation(req)
	} else {
		console.log(`[Cache]: received command to clear all caches`)
		await redis.flushdb()
	}

	res.status(200).json({ status: "Cache cleared" })
}
