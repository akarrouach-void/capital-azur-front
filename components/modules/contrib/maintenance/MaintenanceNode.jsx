import Head from "next/head"
import { useI18n } from "@vactorynext/core/hooks"
import logo from "/public/logo.png"
import maintenanceImage from "/public/assets/img/under-maintenance-3d.webp"
import { Image } from "@/ui"
import { writeToDrupalLogger } from "../../../../pages/_error"

const MaintenanceNode = ({ systemRoute, error, currentPath }) => {
	const { t } = useI18n()

	// Sent error details to Drupal logger.
	const stack1 = systemRoute?.error?.stack
	const stack2 = error?.stack
	const errMessage1 = systemRoute?.error?.message
	const errMessage2 = error?.message
	const statusCode1 = systemRoute?.error?.statusCode
	const statusCode2 = error?.statusCode
	writeToDrupalLogger(
		errMessage1 ? errMessage1 : errMessage2,
		stack1 ? stack1 : stack2,
		statusCode1 ? statusCode1 : statusCode2,
		currentPath
	)

	return (
		<>
			<Head>
				<title>{t("Nx:Under Maintenance")}</title>
			</Head>
			<div className="relative -mt-[88px] flex min-h-[100vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
				{/* Decorative background pattern */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute left-10 top-10 h-20 w-20 rotate-12 rounded-lg border-4 border-white"></div>
					<div className="absolute right-20 top-20 h-16 w-16 -rotate-12 rounded-full border-4 border-white"></div>
					<div className="absolute bottom-20 left-20 h-24 w-24 rotate-45 rounded-lg border-4 border-white"></div>
					<div className="absolute bottom-10 right-10 h-20 w-20 -rotate-45 rounded-full border-4 border-white"></div>
					<div className="absolute left-1/4 top-1/3 h-12 w-12 rotate-12 rounded-lg border-4 border-white"></div>
					<div className="absolute bottom-1/3 right-1/4 h-14 w-14 -rotate-12 rounded-full border-4 border-white"></div>
				</div>

				<div className="container relative z-10 mx-auto px-4 py-12">
					<div className="grid items-center gap-8 lg:grid-cols-2">
						{/* Left side - Content */}
						<div className="text-center lg:text-left">
							{/* Logo */}
							<div className="relative mx-auto mb-8 aspect-[524/138] max-h-[80px] lg:mx-0">
								<Image
									src={logo?.src}
									width={logo?.width}
									height={logo?.height}
									alt={t("Nx:vactory")}
									className="brightness-0 invert"
								/>
							</div>

							{/* Main heading */}
							<h1 className="mb-4 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
								{t("Nx:Oops!")}
							</h1>
							<h2 className="mb-6 text-3xl font-semibold text-white/90 md:text-4xl">
								{t("Nx:The website is under maintenance")}
							</h2>

							{/* Description */}
							<p className="mx-auto mb-8 max-w-xl text-base text-white/80 md:text-lg lg:mx-0">
								{t(
									"Nx:We are performing scheduled maintenance. We'll be back online shortly. Thank you for your patience."
								)}
							</p>
						</div>

						{/* Right side - Maintenance icon */}
						<div className="relative flex items-center justify-center">
							<div className="relative">
								<Image
									src={maintenanceImage?.src}
									width={maintenanceImage?.width || 500}
									height={maintenanceImage?.height || 500}
									alt={t("Nx:Under Maintenance")}
									title={t("Nx:Under Maintenance")}
									className="drop-shadow-2xl"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export const config = {
	id: "maintenance_page",
	params: {},
}

export default MaintenanceNode
