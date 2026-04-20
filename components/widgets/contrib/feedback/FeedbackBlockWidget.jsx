import React from "react"
import { FeedbackBlock } from "./FeedbackBlock"
import { useI18n, useNode } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_content_feedback_widgets:feedblack-block",
}

const FeedbackBlockContainer = ({ data }) => {
	const pageContext = useNode()
	const nid = pageContext.nid
	const { activeLocale: lang } = useI18n()

	const feedbackConfig = data?.feedback_config

	if (!feedbackConfig) return null

	const initialQuestion = {
		question: feedbackConfig.initial_question,
		options: [
			{
				icon: "emoji-happy",
				text: feedbackConfig.yes_button,
				value: "yes",
				response: feedbackConfig.yes_response,
			},
			{
				icon: "emoji-sad",
				text: feedbackConfig.no_button,
				value: "no",
				response: feedbackConfig.no_response,
			},
		],
	}

	let predefinedAnswers = null
	if (feedbackConfig.feedback_enable_predefined_answers)
		predefinedAnswers = feedbackConfig.feedback_predefined_answers

	const promptQuestion = {
		shouldPromptOn: {
			yes: feedbackConfig.feedback_prompt_on_yes,
			no: feedbackConfig.feedback_prompt_on_no,
		},
		question: feedbackConfig.feedback_prompt,
		response: feedbackConfig.final_response,
		submitText: feedbackConfig.submit_text,
		predefinedAnswers,
	}

	return (
		<FeedbackBlock
			initialQuestion={initialQuestion}
			promptQuestion={promptQuestion}
			nodeId={nid}
			lang={lang}
		/>
	)
}

export default FeedbackBlockContainer
