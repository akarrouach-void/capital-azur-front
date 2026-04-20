const projectConfig = require("../../project.config")

const Robots = (req, res) => {
	// Get the current host.
	const host = req.headers.host
	const protocol =
		req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http")
	const fullHost = `${protocol}://${host}`

	let robotsTxt = ""

	// Sitemap for each language.
	const enabledLanguages = projectConfig.languages.enabled
	for (const language of enabledLanguages) {
		const sitemapUrl = `${fullHost}/${language}/sitemap.xml\n`
		robotsTxt += `Sitemap: ${sitemapUrl}`
	}

	let rules = [
		{
			"User-agent": "*",
			Allow: ["/"],
			Disallow: ["/account/", "/admin/", "/api/", "/user/"],
		},
	]

	for (const item of rules) {
		for (const key in item) {
			const value = item[key]
			if (key === "User-agent") {
				robotsTxt += `${key}: ${value}\n`
			}
			if (key === "Allow" || key === "Disallow") {
				for (const str of value) {
					robotsTxt += `${key}: ${str}\n`
				}
			}
		}
	}

	res.setHeader("Content-Type", "text/plain")
	res.status(200).send(robotsTxt)
}

export default Robots
