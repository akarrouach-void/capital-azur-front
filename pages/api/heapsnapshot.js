import path from "path"
import os from "os"
import fs from "fs"
import v8 from "v8"

// Usage:
// curl -O -J -H "x-snapshot-api-key: your_api_key" http://your-domain/api/heapsnapshot

function formatDate(date, format) {
	const pad = (value, length) => {
		return value.toString().length < length ? pad("0" + value, length) : value
	}

	const mappings = {
		yyyy: date.getFullYear(),
		MM: pad(date.getMonth() + 1, 2),
		dd: pad(date.getDate(), 2),
		HH: pad(date.getHours(), 2),
		mm: pad(date.getMinutes(), 2),
		ss: pad(date.getSeconds(), 2),
		SSS: pad(date.getMilliseconds(), 3),
	}

	return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (match) => mappings[match])
}

async function canAccessCheck(req) {
	const apiKeyHeader = req.headers["x-snapshot-api-key"]
	if (!apiKeyHeader || apiKeyHeader !== process.env.NODE_HEAP_SNAPSHOT_API_ROUTE_KEY) {
		throw new Error("Invalid API key")
	}

	return Promise.resolve()
}

export default async function handler(req, res) {
	try {
		await canAccessCheck(req)
	} catch {
		res.status(403).json({ error: "Access denied" })
		return
	}

	const host = req.headers["X-Forwarded-Host"] ?? req.headers["host"]

	const tempDir = os.tmpdir()
	const filepath = path.join(
		tempDir,
		`${host}-${formatDate(new Date(), "yyyy-MM-dd_HH-mm-ss-SSS")}.heapsnapshot`
	)

	const snapshotPath = v8.writeHeapSnapshot(filepath)
	if (!snapshotPath) {
		res.status(500).json({ status: "No snapshot saved" })
		return
	}

	res.setHeader("content-type", "application/octet-stream")
	res.setHeader(
		"content-disposition",
		`attachment; filename="${path.basename(snapshotPath)}"`
	)
	res.setHeader("content-length", (await fs.promises.stat(snapshotPath)).size.toString())

	const stream = fs.createReadStream(snapshotPath)
	stream.on("open", () => stream.pipe(res))
	stream.on("error", (err) => res.end(err))
	stream.on("end", () => res.end())
}

export const config = {
	api: {
		bodyParser: false,
		responseLimit: false,
	},
}
