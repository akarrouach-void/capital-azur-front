import get from "lodash.get"
import { CookieComplianceFloated } from "./cookie-compliance-floated"

export const config = {
	id: "vactory_dynamic_field_decoupled:cookie-compliance-floated",
}

const CookieComplianceFloatedWidget = ({ data }) => {
	const actionLabel = get(data, "components.0.action_label", null)
	const declineLabel = get(data, "components.0.decline_label", null)
	const body = get(data, "components.0.body.value.#text", null)
	const cookieLifeTime = get(data, "components.0.group_advanced.cookie_lifetime", 300)
	const privacyLink = {
		href: get(data, "components.0.group_privacy_policy.privacy_policy_link.url", null),
		title: get(data, "components.0.group_privacy_policy.privacy_policy_link.title", null),
		className: get(
			data,
			"components.0.group_privacy_policy.privacy_policy_link.attributes.class",
			null
		),
		id: get(
			data,
			"components.0.group_privacy_policy.privacy_policy_link.attributes.id",
			null
		),
		rel: get(
			data,
			"components.0.group_privacy_policy.privacy_policy_link.attributes.rel",
			null
		),
		target: get(
			data,
			"components.0.group_privacy_policy.privacy_policy_link.attributes.target",
			null
		),
	}
	return (
		<CookieComplianceFloated
			body={body}
			actionLabel={actionLabel}
			declineLabel={declineLabel}
			cookieLifeTime={parseInt(cookieLifeTime)}
			privacyPolicy={privacyLink}
		></CookieComplianceFloated>
	)
}

export default CookieComplianceFloatedWidget
