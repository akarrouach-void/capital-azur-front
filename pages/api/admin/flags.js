import { createApiRoute } from "@vactory/console/api-route"

export default createApiRoute({
	corsHeaders: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
		"Access-Control-Max-Age": "86400",
		"Access-Control-Expose-Headers": "*",
	},
})
