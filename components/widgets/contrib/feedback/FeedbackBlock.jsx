import React from "react"
import { submitFeedback, submitMessage } from "./utils"
import { FeedbackQuestion } from "./FeedbackQuestion"
import { FeedbackMessage } from "./FeedbackMessage"

export const FeedbackBlock = ({ initialQuestion, promptQuestion, nodeId, lang }) => {
	const [feedbackId, setFeedbackId] = React.useState(null)
	const [response, setResponse] = React.useState(null)

	const handleInitialFeedback = async (value) => {
		setResponse(value)
		const feedbackId = await submitFeedback({ value, nodeId }, lang)
		setFeedbackId(feedbackId)
	}

	const handleMessageSubmit = async (message) => {
		await submitMessage(feedbackId, message, lang)
	}

	const shouldPrompt = promptQuestion.shouldPromptOn[response]

	return (
		<div className="my-6">
			<FeedbackQuestion
				question={initialQuestion.question}
				options={initialQuestion.options}
				onSubmit={handleInitialFeedback}
			/>

			{shouldPrompt && (
				<FeedbackMessage
					question={promptQuestion.question}
					predefinedAnswers={promptQuestion.predefinedAnswers}
					response={promptQuestion.response}
					submitText={promptQuestion.submitText}
					onSubmit={handleMessageSubmit}
				/>
			)}
		</div>
	)
}
