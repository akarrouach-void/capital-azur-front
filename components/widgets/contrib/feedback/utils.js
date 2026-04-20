import axios from "axios"
// todo: replace by drupal.fetch
export async function submitFeedback({ value, nodeId }, lang = "fr") {
	const bodyFormData = new FormData()
	bodyFormData.append("vote", value)
	bodyFormData.append("node_id", nodeId)
	try {
		const res = await axios.post(`/api/proxy/${lang}/feedback_vote`, bodyFormData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		return res.data[0]
	} catch (e) {
		console.error("error in submitFeedback", e)
	}
}

export async function submitMessage(feedbackId, message, lang = "fr") {
	try {
		return await axios.post(
			`/api/proxy/${lang}/_feedback_update`,
			{
				feedback_id: feedbackId,
				feedback_message: message,
			},
			{
				headers: {
					"Content-Type": "application/vnd.api+json",
				},
			}
		)
	} catch (e) {
		console.error("error in submitMessage", e)
	}
}
