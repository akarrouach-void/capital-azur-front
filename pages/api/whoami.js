const os = require("os")
import { parse as parseUrl } from "url"

async function canAccessCheck(req) {
	const apiKeyHeader = req.headers["x-whoami-api-key"]
	if (!apiKeyHeader || apiKeyHeader !== process.env.WHO_AM_I_API_ROUTE_KEY) {
		throw new Error("Invalid API key")
	}

	return Promise.resolve()
}

// Helper function to get network interfaces
const getNetworkInterfaces = () => {
	const nets = os.networkInterfaces()
	const results = Object.create(null)

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
			const familyV4Value = typeof net.family === "string" ? "IPv4" : 4
			if (net.family === familyV4Value && !net.internal) {
				if (!results[name]) {
					results[name] = []
				}
				results[name].push(net.address)
			}
		}
	}

	return results
}

// Helper function to get remote address
const getRemoteAddress = (req) => {
	if (req.headers["x-forwarded-for"]) {
		return req.headers["x-forwarded-for"]
	}
	return req.socket.remoteAddress
}

// Helper function to build basic info text
const buildBasicInfo = (req, remoteAddr, _parsedUrl) => {
	let text = ""
	text += "Hostname: " + os.hostname() + "\n"
	text += "RemoteAddr: " + remoteAddr + "\n"
	text += "Protocol (see parseUrl if undefined): " + req.protocol + "\n"
	text += req.method + " " + req.url + " HTTP/" + req.httpVersion + "\n"

	// Add headers
	for (const prop in req.headers) {
		text += prop + ": " + req.headers[prop] + "\n"
	}

	text += "\n" + "======== parseUrl(req.url, true) " + "\n"
	text += JSON.stringify(_parsedUrl, null, 2)

	return text
}

// Helper function to build environment info
const buildEnvironmentInfo = () => {
	let text = "\n" + "======== ENV " + "\n"
	text += "Hostname: " + process.env.HOSTNAME + "\n"
	text += "PORT: " + process.env.PORT + "\n"
	return text
}

// Helper function to build socket and network info
const buildNetworkInfo = (req, results) => {
	let text = "\n" + "======== req.socket " + "\n"
	text += JSON.stringify(req.socket.address(), null, 2) + "\n"
	text += "\n" + "======== networkInterfaces " + "\n"
	text += JSON.stringify(results, null, 2) + "\n"
	return text
}

export default async function handler(req, res) {
	try {
		await canAccessCheck(req)
	} catch {
		res.status(403).json({ error: "Access denied" })
		return
	}

	// Gather information
	const _parsedUrl = parseUrl(req.url, true)
	const results = getNetworkInterfaces()
	const remoteAddr = getRemoteAddress(req)

	// Build response text
	const basicInfo = buildBasicInfo(req, remoteAddr, _parsedUrl)
	const envInfo = buildEnvironmentInfo()
	const networkInfo = buildNetworkInfo(req, results)

	const text = basicInfo + envInfo + networkInfo

	res.setHeader("Content-Type", "text/plain")
	res.status(200).send(text)
}
