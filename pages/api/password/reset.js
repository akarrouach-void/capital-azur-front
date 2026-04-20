import { drupal } from "@vactorynext/core/drupal"

export default async function handler(req, res) {
	try {
		await drupal.fetch(`${req?.query?.locale}/api/user/password/reset`, {
			method: "POST",
			headers: {
				Accept: "application/vnd.api+json",
				"Content-Type": "application/vnd.api+json",
			},
			body: JSON.stringify(req?.body),
		})
		res.status(200).json({ status: "reset password" })
	} catch (err) {
		console.log(err)
	}
}
