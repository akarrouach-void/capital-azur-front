import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const FormStepper = ({ pages, currentStep, goToStep = null }) => {
	const { t } = useTranslation()

	const stepsItems = Object.keys(pages || [])
	const steps = !pages?.webform_preview?.preview?.enable
		? stepsItems.filter((stepsItem) => stepsItem !== "webform_preview")
		: null

	return (
		<nav aria-label="Progress" className="mb-8 px-4">
			{/* Desktop Version */}
			<div className="hidden items-center justify-center sm:flex">
				{steps.map((step, index) => {
					const isCompleted = index < currentStep
					const isActive = index === currentStep
					const isClickable = typeof goToStep === "function" && (isCompleted || isActive)

					return (
						<div key={step} className="flex items-center">
							{/* Step Circle and Label */}
							<div className="flex flex-col items-center">
								<div
									onClick={() => {
										if (isClickable) {
											goToStep(index)
										}
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && isClickable) {
											goToStep(index)
										}
									}}
									role="button"
									tabIndex={isClickable ? 0 : -1}
									className={vclsx(
										" flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
										isCompleted || isActive
											? " bg-gradient-to-r from-blue-600 to-purple-600 text-white"
											: "border-2 border-gray-200 bg-white text-gray-400",
										isClickable && "cursor-pointer hover:scale-105"
									)}
								>
									{pages[step].icon && pages[step].icon !== "" ? (
										<Icon id={pages[step].icon} className="h-5 w-5" />
									) : (
										<span>{index + 1}</span>
									)}
								</div>
								<span
									className={vclsx(
										" mt-2 text-sm font-medium",
										isCompleted || isActive ? "text-gray-900" : "text-gray-400"
									)}
								>
									{pages[step]["title"]
										? pages[step]["title"]
										: pages[step]?.preview?.label}
								</span>
							</div>

							{/* Connecting Line */}
							{index < steps.length - 1 && (
								<div
									className={vclsx(
										" mx-4 h-0.5 w-12 lg:w-16",
										index < currentStep
											? "bg-gradient-to-r from-blue-600 to-purple-600"
											: "border-t-2 border-dashed border-gray-300 bg-transparent"
									)}
								/>
							)}
						</div>
					)
				})}
			</div>

			{/* Mobile Version */}
			<div className="sm:hidden">
				{/* Progress Bar */}
				<div className="mb-4">
					<div className="mb-2 flex items-center justify-between text-xs text-gray-500">
						<span>
							Step {currentStep + 1} of {steps.length}
						</span>
						<span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
					</div>
					<div className="h-2 w-full rounded-full bg-gray-200">
						<div
							className=" h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
							style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Current Step Info */}
				<div className="flex items-center justify-center">
					<div className="flex items-center space-x-3">
						<div
							className={vclsx(
								"flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold",
								"bg-gradient-to-r from-blue-600 to-purple-600 text-white"
							)}
						>
							{pages[steps[currentStep]].icon && pages[steps[currentStep]].icon !== "" ? (
								<Icon id={pages[steps[currentStep]].icon} className="h-6 w-6" />
							) : (
								<span>{currentStep + 1}</span>
							)}
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">
								{pages[steps[currentStep]]["title"]
									? t(`Nx:${pages[steps[currentStep]]["title"]}`)
									: t(`Nx:${pages[steps[currentStep]]?.preview?.label}`)}
							</h3>
							<p className="text-sm text-gray-500">
								Step {currentStep + 1} of {steps.length}
							</p>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
