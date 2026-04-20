import { Button, Wysiwyg } from "@/ui"
import React, { useState } from "react"
import { useRouter } from "next/router"

export const ConfirmationMessage = ({ message, btnLabel = "", destination = "" }) => {
	const [isVisible, setIsVisible] = useState(true)
	const router = useRouter()
	const closeConfirmationMessage = () => {
		setIsVisible(false)
		const { pathname, query } = router
		const params = new URLSearchParams(query)
		params.delete("message")
		params.delete("isSubmitted")
		router.replace({ pathname, query: params.toString() }, undefined, {
			shallow: true,
		})
	}
	if (!isVisible) return null
	return (
		<>
			<div className="py-[30px]">
				<div className="relative rounded bg-success-100 py-6 pl-5 pr-8">
					<span className="text-sm">
						<Wysiwyg html={message} />
					</span>
					<button className="absolute right-3 top-3" onClick={closeConfirmationMessage}>
						<svg className="h-5 w-5">
							<use href="/icons.svg#x"></use>
						</svg>
					</button>
				</div>
			</div>

			{btnLabel !== "" && destination !== "" && (
				<Button href={destination || "#."}>{btnLabel}</Button>
			)}
		</>
	)
}
