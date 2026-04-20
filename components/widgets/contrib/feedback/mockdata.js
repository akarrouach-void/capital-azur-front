export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		feedback_config: {
			initial_question: "How satisfied are you with our service?",
			yes_button: "Yes",
			no_button: "No",
			yes_response: "Thank you for your positive feedback!",
			no_response:
				"We apologize for the inconvenience. Please let us know how we can improve.",
			feedback_enable_predefined_answers: true,
			feedback_predefined_answers: [
				"Fast and efficient",
				"Slow and unreliable",
				"Average",
				// Add more predefined answers as needed
			],
			feedback_prompt_on_yes: false,
			feedback_prompt_on_no: true,
			feedback_prompt: "Would you like to provide more details about your experience?",
			final_response: "Thank you for your feedback!",
			submit_text: "Submit",
		},
	},
}
