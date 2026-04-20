import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { getSharedConfig } = require("@vactorynext/core/storybook-server")

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = getSharedConfig({
	storiesPath: path.resolve(__dirname, "../components/elements"),
})

export default config
