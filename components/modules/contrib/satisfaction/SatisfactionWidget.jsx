import { useState } from "react"
import { Heading, Text, Button, Textarea, LoadingOverlay } from "@/ui"
import SatisfactionCheckbox from "./SatisfactionCheckbox"
import { useNode } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import ConfirmationStep from "./ConfirmationStep"
import Cookies from "js-cookie"

export const config = {
	id: "vactory_satisfaction:default",
}

const SatisfactionWidget = ({ data }) => {
	const { title, description, next_label, previous_label, submission_label } =
		data?.extra_field?.group_global_settings
	const confirmation_data = data?.extra_field?.group_confirmation_page
	const steps = data?.components
	const [currentStep, setCurrentStep] = useState(0)
	const [responses, setResponses] = useState({})
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [loading, setLoading] = useState(false)
	const { nid } = useNode()

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep((prev) => prev + 1)
		}
	}

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1)
		}
	}

	const progressPercentage = ((currentStep + 1) / steps.length) * 100

	const handleSubmit = async () => {
		setLoading(true)
		const response = {}
		Object.entries(responses).forEach(([key, value]) => {
			const newKey = steps[key]?.question
			response[newKey] = value
		})
		const body = {
			nid,
			response,
		}

		try {
			const response = await drupal.fetch(`api/vactory_satisfaction`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(body),
			})
			if (response.ok) {
				setLoading(false)
				setShowConfirmation(true)
				Cookies.set("satisfactionSubmitted", true)
			}
		} catch (err) {
			console.error(err)
		}
	}

	// Update checkbox value for current step
	const handleOptionChange = (stepIndex, value) => {
		setResponses((prevResponses) => ({
			...prevResponses,
			[stepIndex]: {
				...prevResponses[stepIndex],
				main: value, // Store checkbox value
			},
		}))
	}

	// Update textarea value for current step
	const handleTextareaChange = (stepIndex, value) => {
		setResponses((prevResponses) => ({
			...prevResponses,
			[stepIndex]: {
				...prevResponses[stepIndex],
				optional: value, // Store textarea value
			},
		}))
	}

	return (
		<>
			{showConfirmation ? (
				<ConfirmationStep {...confirmation_data} />
			) : (
				<LoadingOverlay active={loading} spinner={true}>
					<Heading level={2} variant={4} className="mb-4 text-center text-gray-700">
						{title}
					</Heading>
					<Text className="mb-4 text-center text-gray-700">{description}</Text>

					{/* Progress Bar */}
					<Text className="mb-4 text-center text-gray-700">
						{currentStep + 1}/{steps.length}
					</Text>
					<div className="mb-4 h-2.5 w-full rounded-full bg-gray-300">
						<div
							className="h-2.5 rounded-full bg-blue-600"
							style={{ width: `${progressPercentage}%` }}
						></div>
					</div>

					{steps?.map(
						(step, index) =>
							index === currentStep && (
								<div key={index}>
									<Text>{step?.question}</Text>
									<SatisfactionCheckbox
										items={step?.items}
										selectedValue={responses[currentStep]?.main}
										onChange={(value) => handleOptionChange(currentStep, value)}
									/>

									{step?.optional_question && (
										<>
											<Text className="mb-2 mt-4">{step?.optional_question}</Text>
											<Textarea
												value={responses[currentStep]?.optional || ""}
												onChange={(e) =>
													handleTextareaChange(currentStep, e.target.value)
												}
											/>
										</>
									)}
								</div>
							)
					)}

					<div className="mt-4 text-right">
						{currentStep > 0 && (
							<Button onClick={handlePrevious} className="mr-2">
								{previous_label || "Previous"}
							</Button>
						)}
						{currentStep < steps.length - 1 ? (
							<Button onClick={handleNext}>{next_label || "Next"}</Button>
						) : (
							<Button onClick={handleSubmit}>{submission_label || "Submit"}</Button>
						)}
					</div>
				</LoadingOverlay>
			)}
		</>
	)
}

export default SatisfactionWidget
