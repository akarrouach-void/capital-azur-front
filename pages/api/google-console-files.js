import fs from "fs"
import path from "path"

const GoogleConsoleFiles = (req, res) => {
	// Only allow GET requests
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	try {
		// Get the public directory path
		const publicDir = path.join(process.cwd(), "public")

		// Check if public directory exists
		if (!fs.existsSync(publicDir)) {
			return res.status(200).json([])
		}

		// Read all files and directories in the public directory
		const entries = fs.readdirSync(publicDir, { withFileTypes: true })

		// Filter files matching the pattern google*.html
		// Pattern: google[id_here].html (e.g., googlecc392f450144b7d1.html)
		const googleConsoleFiles = entries
			.filter((entry) => {
				// Only process files (not directories)
				if (!entry.isFile()) {
					return false
				}
				// Check if file matches the pattern google*.html
				const fileName = entry.name
				return /^google.*\.html$/i.test(fileName)
			})
			.map((entry) => ({
				file: entry.name,
			}))

		// Return the list of found files
		return res.status(200).json(googleConsoleFiles)
	} catch (error) {
		console.error("Error reading Google Console files:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

export default GoogleConsoleFiles
