import { useI18n } from "@vactorynext/core/hooks"
import Head from "next/head"
import { writeToDrupalLogger } from "../../../../pages/_error"
import { Button } from "@/ui"

const ErrorNode = ({ systemRoute, currentPath }) => {
	const { status } = systemRoute
	const { t } = useI18n()

	const errorConfig = {
		404: {
			title: t("Nx:Page Not Found"),
			message: t("Nx:The page you are looking for does not exist"),
			description: t(
				"Nx:Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved or deleted"
			),
		},
		403: {
			title: t("Nx:Access Denied"),
			message: t("Nx:You don't have permission to access this page"),
			description: t(
				"Nx:Sorry, you don't have the necessary permissions to view this page. If you believe this is an error, please contact the administrator"
			),
		},
		401: {
			title: t("Nx:Unauthorized"),
			message: t("Nx:Authentication required"),
			description: t(
				"Nx:You need to be logged in to access this page. Please sign in with your credentials to continue"
			),
		},
		500: {
			title: t("Nx:Server Error"),
			message: t("Nx:Something went wrong on our end"),
			description: t(
				"Nx:We're experiencing technical difficulties on our server. Our team has been notified and is working to fix the issue. Please try again later"
			),
		},
	}

	const defaultError = {
		title: t("Nx:Error"),
		message: t("Nx:An unexpected error occurred"),
		description: t(
			"Nx:We're sorry, but something went wrong. Please try refreshing the page or go back to the homepage"
		),
	}

	const currentError = errorConfig[status] || defaultError

	// Sent error details to Drupal logger.
	const stack = systemRoute?.error?.stack
	const errMessage = systemRoute?.error?.message
	const statusCode = systemRoute?.error?.statusCode
	writeToDrupalLogger(errMessage, stack, statusCode, currentPath)

	return (
		<div>
			<Head>
				<title>{currentError.title}</title>
			</Head>
			<div className="relative flex min-h-dvh flex-col">
				<div className="absolute inset-0 z-[-1] opacity-20">
					<div className="absolute left-10 top-10 h-20 w-20 rotate-12 rounded-lg border-4 border-primary-500"></div>
					<div className="absolute right-20 top-20 h-16 w-16 -rotate-12 rounded-full border-4 border-primary-500"></div>
					<div className="absolute bottom-20 left-20 h-24 w-24 rotate-45 rounded-lg border-4 border-primary-500"></div>
					<div className="absolute bottom-10 right-10 h-20 w-20 -rotate-45 rounded-full border-4 border-primary-500"></div>
					<div className="absolute left-1/4 top-1/3 h-12 w-12 rotate-12 rounded-lg border-4 border-primary-500"></div>
					<div className="absolute bottom-1/3 right-1/4 h-14 w-14 -rotate-12 rounded-full border-4 border-primary-500"></div>
				</div>
				<main className=" mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4">
					{/* Decorative background pattern */}
					<div className="flex flex-col items-center">
						<span className="mb-8 inline-flex items-center rounded-full bg-primary-100 px-6 py-2 text-3xl font-semibold text-primary-800 lg:px-10 lg:py-4 lg:text-4xl">
							{status || "Error"}
						</span>

						{/* Error Title */}
						<h1 className="mb-4 text-center text-4xl font-bold text-gray-900">
							{currentError.title}
						</h1>

						{/* Error Message */}
						<p className="mb-4 text-center text-xl font-medium text-gray-700">
							{currentError.message}
						</p>

						{/* Error Description */}
						<p className="text-md mb-8 max-w-2xl text-center text-gray-600">
							{currentError.description}
						</p>

						{/* Action Buttons */}
						<div className="flex flex-col gap-4 sm:flex-row">
							<Button href="/" variant="gradient">
								{t("Nx:Go to Homepage")}
							</Button>
							<Button onClick={() => window.history.back()} variant="white">
								{t("Nx:Go Back")}
							</Button>
						</div>
					</div>
				</main>
				{/* Footer */}
				<p className="py-6 text-center text-sm text-gray-500">
					{t("Nx:Need help? Contact our support team")}
				</p>
			</div>
		</div>
	)
}

export const config = {
	id: "error_page",
	params: {},
}

export default ErrorNode
