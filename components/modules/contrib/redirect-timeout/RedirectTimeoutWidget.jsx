import { RedirectTimeout } from "@/ui"
import get from "lodash.get"
export const config = {
	id: "vactory_timeout:default",
}

const RedirectTimeoutWidget = (data) => {
	let props = {
		redirectUrl: get(data, "data.components.0.redirect_url", ""),
		timeout: get(data, "data.components.0.timeout", 15),
		confirmText: get(data, "data.components.0.confirm_text", ""),
		showConfirm: get(data, "data.components.0.confirm_popup", false),
		cancelText: get(data, "data.components.0.cancel_text", "Cancel"),
	}

	return <RedirectTimeout {...props} />
}

export default RedirectTimeoutWidget
