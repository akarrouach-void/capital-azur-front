import { Button, Heading, Icon } from "@/ui"
import { FormLayout } from "./../FormLayout"
import { FormPreview } from "./Preview"
import { FormStepper } from "./Stepper"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"

export const FormMultiStep = ({
	pages,
	currentStep,
	prevFormStep,
	nextFormStep,
	goToStep,
	schema,
	buttonBaseStyles,
	buttontext,
	isLoading,
}) => {
	let steps = Object.keys(pages || [])
	!pages?.webform_preview?.preview?.enable
		? steps.splice(steps.indexOf("webform_preview"), 1)
		: null
	return (
		<>
			<FormStepper pages={pages} currentStep={currentStep} goToStep={goToStep} />
			{steps.map((step, index) => {
				return (
					<FormStep
						key={index}
						nbrPages={steps.length}
						step={pages[step]}
						index={index}
						currentStep={currentStep}
						prevFormStep={prevFormStep}
						nextFormStep={nextFormStep}
						schema={schema}
					>
						<Button
							type="submit"
							{...buttonBaseStyles}
							disabled={!(currentStep === steps.length - 1) || isLoading}
							className="group"
							variant="gradient"
						>
							{isLoading ? (
								<span className="h-5 w-5 animate-spin cursor-wait rounded-full border-b-2 border-l-2 border-white group-hover:border-primary"></span>
							) : (
								buttontext
							)}
						</Button>
					</FormStep>
				)
			})}
		</>
	)
}

export const FormStep = ({
	step,
	index,
	nbrPages,
	currentStep,
	prevFormStep,
	nextFormStep,
	schema,
	showTitle = true,
	confirmFormStep = null,
	showPrevious = true,
	render = null,
	children = null,
}) => {
	const { t } = useTranslation()

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			nextFormStep()
		}
	}

	return (
		currentStep == index && (
			<div className="rounded-md border border-gray-200 bg-white px-5 py-5 shadow-sm lg:p-8">
				{step?.preview?.enable ? (
					<FormPreview schema={schema} />
				) : (
					<>
						{showTitle && step ? <Heading level={3}>{step["title"]}</Heading> : null}

						{render ? render() : <FormLayout data={step} />}
					</>
				)}

				<div className="mt-8 flex flex-wrap gap-4">
					{showPrevious && index > 0 && (
						<Button onClick={prevFormStep} variant={"secondary"}>
							<Icon id="chevron-left" className="h-4 w-4" />
							{step ? step["prev_button_label"] || t("Nx:Previous") : t("Nx:Previous")}
						</Button>
					)}

					{currentStep !== nbrPages - 1 && (
						<Button
							onClick={() => {
								if (typeof nextFormStep === "function") {
									nextFormStep()
								}
								if (typeof confirmFormStep === "function") {
									confirmFormStep(currentStep)
								}
							}}
							variant="gradient"
							type={null}
							onKeyPress={(e) => handleKeyPress(e)}
						>
							{step ? step["next_button_label"] || t("Nx:Next") : t("Nx:Next")}
							<Icon id="chevron-right" className="h-4 w-4" />
						</Button>
					)}

					{currentStep === nbrPages - 1 ? children : null}
				</div>
			</div>
		)
	)
}
