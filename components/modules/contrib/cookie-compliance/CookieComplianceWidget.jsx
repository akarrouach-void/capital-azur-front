import get from "lodash.get"
import { CookieComplianceLayer } from "./cookie-compliance"

export const config = {
	id: "vactory_dynamic_field_decoupled:cookie-compliance",
}

const CookieComplianceWidget = ({ data }) => {
	const actionLabel = get(data, "components.0.action_label", null)
	const declineLabel = get(data, "components.0.decline_label", null)
	const body = get(data, "components.0.body.value.#text", null)
	const cookieLifeTime = get(data, "components.0.group_advanced.cookie_lifetime", 300)
	const privacyPolicy = get(
		data,
		"components.0.group_privacy_policy.privacy_policy_link",
		null
	)
	return (
		<CookieComplianceLayer
			body={body}
			actionLabel={actionLabel}
			declineLabel={declineLabel}
			variant={"default"}
			cookieLifeTime={parseInt(cookieLifeTime)}
			privacyPolicy={privacyPolicy}
		></CookieComplianceLayer>
	)
}

export default CookieComplianceWidget
