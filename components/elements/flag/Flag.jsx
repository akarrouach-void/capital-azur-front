import { useAccount, useI18n as useTranslation } from "@vactorynext/core/hooks"
import React, { useState } from "react"
import { Icon } from "@/ui"
import { ClicktoUnFlag, ClicktoFlag } from "@vactorynext/core/utils"

export const Flag = ({
	id,
	title,
	module,
	className = "",
	isFlagged,
	reloadPage = null,
	onFlaggedChange = null,
}) => {
	const [isflagged, setIsflagged] = useState(isFlagged)
	const [loading, setLoading] = useState(false)
	const { isAuthenticated, signIn } = useAccount()
	const { t } = useTranslation()

	const flagging = () => {
		if (isAuthenticated) {
			isflagged
				? ClicktoUnFlag(
						module,
						id,
						t,
						title,
						setLoading,
						setIsflagged,
						onFlaggedChange,
						reloadPage
					)
				: ClicktoFlag(module, id, t, title, setLoading, setIsflagged, onFlaggedChange)
		} else {
			signIn()
		}
	}

	return (
		<div className={className}>
			{loading ? (
				<div className="h-6 w-6 animate-spin cursor-wait rounded-full border-b-2 border-l-2 border-primary"></div>
			) : (
				<button onClick={() => flagging()}>
					<Icon
						id="like"
						className={`h-6 w-6 ${isflagged ? "text-error-500" : "text-gray"}`}
					/>
				</button>
			)}
		</div>
	)
}
