import httpProxyMiddleware from "next-http-proxy-middleware"
import { redisOffline } from "@vactorynext/core/server"
import * as crypto from "crypto"
import { getServerSidePropsFlags } from "@vactory/console/server"

if (process.env.DRUPAL_BASE_URL === undefined) {
	throw Error("DRUPAL BASE URL environment variable not specified!")
}

const handleProxyInit = (proxy) => {
	/**
	 * Check the list of bindable events in the `http-proxy` specification.
	 * @see https://www.npmjs.com/package/http-proxy#listening-for-proxy-events
	 */
	proxy.on("proxyReq", () => {})
	proxy.on("proxyRes", async (proxyRes, req) => {
		if (req.method !== "GET") {
			return
		}

		if (
			proxyRes.headers["content-type"]?.includes("json") &&
			proxyRes.statusCode === 200
		) {
			const uniqueReqId = crypto.createHash("sha512").update(req.url).digest("hex")
			const cacheKey = `apiproxy:${uniqueReqId}`

			let body = []
			proxyRes.on("data", function (chunk) {
				body.push(chunk)
			})

			proxyRes.on("end", async function () {
				body = Buffer.concat(body).toString()
				try {
					// make sure to validate the JSON before setting it in the cache
					JSON.parse(body)
					await redisOffline.set(cacheKey, body)
				} catch (e) {
					console.error(`Cannot parse JSON for ${req.url}`, e)
				}
			})
		}
	})
}

export default async function handler(req, res) {
	try {
		if (
			req.method === "GET" &&
			getServerSidePropsFlags().serverFlags.get("enableOffline")
		) {
			const uniqueReqId = crypto
				.createHash("sha512")
				.update(req.url.replace(/^\/api\/proxy/i, ""))
				.digest("hex")
			const cacheKey = `apiproxy:${uniqueReqId}`

			const cached = await redisOffline.get(cacheKey)

			if (cached) {
				return res.end(cached)
			}
		}

		// API resolved without sending a response for ..., this may result in stalled requests.
		return await httpProxyMiddleware(req, res, {
			onProxyInit: handleProxyInit,
			target: process.env.DRUPAL_BASE_URL,
			secure: false, // Don't verify the SSL Certs
			pathRewrite: [{ patternStr: `^/api/proxy`, replaceStr: "" }],
			followRedirects: true,
			headers: {
				cookie: "", // Must override the browser sent authorization code otherwise ingress gives a 400 status
			},
		})
	} catch (error) {
		console.error(error)
		res.status(500).json(error)
	}
}

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true, // Prevents noise created by proxy
	},
}
