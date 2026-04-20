import { useState, useEffect } from "react"
import { useI18n } from "@vactorynext/core/hooks"

export const Countdown = ({ seconds, onFinish, content = "seconds", children }) => {
	const { t } = useI18n()
	const [timeLeft, setTimeLeft] = useState(seconds)
	const [isHandlerCalled, setIsHandlerCalled] = useState(false)

	useEffect(() => {
		if (!timeLeft && !isHandlerCalled) {
			onFinish()
			setIsHandlerCalled(true)
		}

		if (timeLeft > 0) {
			const intervalId = setInterval(() => {
				setTimeLeft(timeLeft - 1)
			}, 1000)

			return () => clearInterval(intervalId)
		}
	}, [timeLeft, isHandlerCalled])

	return (
		<div>
			{children}
			{t(` ${timeLeft} ${content}.`)}
		</div>
	)
}
