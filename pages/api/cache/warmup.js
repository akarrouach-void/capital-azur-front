import { redis, isHttpMethod } from "@vactorynext/core/server"

export default async function handler(req, res) {
	const secret = req.headers["x-cache-secret"] || ""
	isHttpMethod(req, res, ["GET"])

	if (process.env.CACHE_SECRET === undefined) {
		res.status(500).json({ status: "CACHE_SECRET environment variable not specified!" })
		return
	}

	if (process.env.CACHE_SECRET !== secret) {
		res.status(500).json({ status: "secret key doesn't match" })
		return
	}

	await redis.flushall()

	res.status(200).json({ status: "Cache warmup done" })
}
