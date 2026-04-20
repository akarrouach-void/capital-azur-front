import React, {
	forwardRef,
	useImperativeHandle,
	useState,
	useRef,
	useEffect,
} from "react"
import { useI18n, useUpdateEffect, useInViewport } from "@vactorynext/core/hooks"
import { recaptchaTheme } from "./theme"
import dynamic from "next/dynamic"
import { useFlag } from "@vactory/console/client"

const ReCaptcha = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
})

export const Recaptcha = forwardRef(
	({ errorMessage, description, value, onChange, hasError, ...rest }, ref) => {
		const myRef = useRef()
		const { inViewport } = useInViewport(myRef)
		const { activeLocale: currentLanguage } = useI18n()
		const [recaptchaNeeded, setRecaptchaNeeded] = useState(false)
		const recaptchaRef = React.createRef()
		const [showRecaptcha, setShowRecaptcha] = useState(true)

		useImperativeHandle(ref, () => ({
			reset: () => {
				recaptchaRef?.current?.reset()
				onChange(null)
			},
		}))

		useUpdateEffect(() => {
			if (value === undefined || value === null) {
				//recaptchaRef?.current?.reset()
				/* Temporarily remove the ReCAPTCHA, then add it back to force a re-render, This solution is due to the captcha being resetting but doesn't clear the visual check mark as expected */
				setShowRecaptcha(false)
				setTimeout(() => setShowRecaptcha(true), 50)
			}
		}, [value])

		useEffect(() => {
			if (inViewport && !recaptchaNeeded) {
				setRecaptchaNeeded(true)
			}
		}, [inViewport])

		const isEnabled = useFlag("captcha")
		const recaptchaSiteKey = useFlag("captchaSiteKey")
		if (!isEnabled) {
			return <input name="g-recaptcha-response" {...rest} type="hidden" value="" />
		}

		return (
			<div ref={myRef}>
				<input type="hidden" {...rest} value={value || "Google no captcha"} />
				{recaptchaNeeded && showRecaptcha && (
					<ReCaptcha
						sitekey={recaptchaSiteKey}
						hl={currentLanguage}
						ref={recaptchaRef}
						onChange={(val) => {
							onChange(val)
						}}
						onExpired={() => {
							onChange(null)
						}}
						onErrored={() => {
							onChange(null)
						}}
					/>
				)}
				{hasError && <span className={recaptchaTheme.errorMessage}>{errorMessage}</span>}
				<p className={recaptchaTheme.description}>{description}</p>
			</div>
		)
	}
)
