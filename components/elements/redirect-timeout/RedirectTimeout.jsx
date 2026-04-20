import { useUpdateEffect } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button } from "../button/Button"
import { Layer } from "../layer/Layer"

export const RedirectTimeout = ({
	timeout,
	redirectUrl,
	showConfirm,
	confirmText,
	cancelText,
}) => {
	let [counter, setCounter] = useState(timeout)
	let [showLayer, setShowLayer] = useState(true)
	let [cancelRedirect, setCancelRedirect] = useState(false)
	let router = useRouter()

	useEffect(() => {
		// Decrement counter each second.
		let timeout = setTimeout(() => setCounter((time) => (time > 0 ? time - 1 : 0)), 1000)
		return () => clearTimeout(timeout)
	})

	useUpdateEffect(() => {
		counter <= 0 &&
			!cancelRedirect &&
			typeof redirectUrl === "string" &&
			redirectUrl.length > 0 &&
			router.push(redirectUrl)
	}, [counter])

	const keepSurfing = () => {
		setCancelRedirect(true)
		setShowLayer(false)
	}

	if (counter > 15 || !showConfirm) {
		return <></>
	}

	return (
		<Layer
			overlayOpacity="bg-opacity-80"
			modal={true}
			showCloseBtn={false}
			isShow={showLayer}
			onClose={() => {}}
		>
			<div className="min-w-max bg-white p-7 text-center">
				<p className="mb-6 text-xl">{confirmText}</p>
				<div className="m-auto w-1/2 rounded-full border-2 border-dotted bg-error-900 p-4 text-3xl text-white">
					<span>{("0" + counter).slice(-2)} s</span>
				</div>
				<Button className="mt-6" type="button" onClick={keepSurfing}>
					{cancelText}
				</Button>
			</div>
		</Layer>
	)
}
