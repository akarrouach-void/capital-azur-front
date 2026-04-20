import { TemplatesMapping } from "@/runtime/nodes-templates"
import { Layout } from "@/themes/default"
import { SessionExpiration } from "@/account"
import { drupal } from "@vactorynext/core/drupal"

const ErrorPage = ({ err, statusCode, currentPath }) => {
	const systemRoute = getSystemRouteExceptionInfos(statusCode)
	let nodeType = systemRoute._route
	const NodeComponent = TemplatesMapping[nodeType]
	if (nodeType === "session_expiration") {
		return (
			<Layout>
				<SessionExpiration />
			</Layout>
		)
	}
	if (!statusCode) {
		// Client error case get current path from window object.
		if (!currentPath) {
			currentPath = window !== undefined ? window.location.pathname : "Unknown"
		}
	}
	return (
		<Layout>
			<NodeComponent systemRoute={systemRoute} error={err} currentPath={currentPath} />
		</Layout>
	)
}

ErrorPage.getInitialProps = async (context) => {
	let statusCode = null

	if (context.res) {
		statusCode = context.res.statusCode
	} else if (context.err) {
		statusCode = context.err.statusCode
	} else {
		statusCode = 404
	}

	// Server side current path.
	const currentPath = context.req ? context.req.url : null
	return { statusCode, err: context.err, currentPath }
}

export const writeToDrupalLogger = async (errMessage, stack, statusCode, currentPath) => {
	const source = statusCode === undefined ? "Client" : "Server"
	if (stack && stack.length > 0) {
		const data = {
			reason: errMessage,
			stack: stack,
			path: currentPath || "Unknown",
			source: source,
		}
		drupal
			.fetch(`api/capture-log`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			.catch((error) => {
				// Log request errors.
				console.error("Error logger API call:", error)
			})
	}
}

function getSystemRouteExceptionInfos(status, session = null) {
	// Always use maintenance page for all errors, so erros will be logged into Drupal.
	let _route = "maintenance_page"

	if (status == 401) {
		_route = "session_expiration"
	}

	return {
		_route: _route,
		status: status || 500,
		authenticated: !!session,
	}
}

export default ErrorPage
