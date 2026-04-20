import { useState } from "react"

import { Switch } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { toggle } from "./theme"

export const Toggle = ({ variant = "default", className = "" }) => {
	const [enabled, setEnabled] = useState(false)

	return (
		<div className={(vclsx(toggle[variant].className), className)}>
			<Switch
				checked={enabled}
				onChange={setEnabled}
				className={`${
					enabled ? toggle[variant].switch.enabled : toggle[variant].switch.disabled
				} ${toggle[variant].switch.className}`}
			>
				<span className="sr-only">Enable notifications</span>
				<span
					className={`${
						enabled
							? toggle[variant].switch.span.enabled
							: toggle[variant].switch.span.disabled
					} ${toggle[variant].switch.span.className}`}
				/>
			</Switch>
		</div>
	)
}
