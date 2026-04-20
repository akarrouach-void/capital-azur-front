import isClient from "is-client"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"

import { Button, Link, Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { cookieCompliance } from "./theme"
import { dlPush } from "@vactorynext/core/lib"

export const CookieComplianceLayer = ({
	body,
	actionLabel,
	declineLabel,
	show = false,
	variant = "default",
	cookieLifeTime = 300,
	privacyPolicy = {},
	...rest
}) => {
	const cookieName = "CookieConsent"
	const [showCookie, setShowCookie] = useState(show)

	const onAccept = () => {
		Cookies.set(
			cookieName,
			JSON.stringify({
				necessary: true,
				analytics: true,
				marketing: true,
				preferences: true,
			}),
			{ expires: cookieLifeTime }
		)
		dlPush("cookie_consent_given", {
			necessary: true,
			analytics: true,
			marketing: true,
			preferences: true,
		})
		setShowCookie(false)
	}

	const onDecline = () => {
		Cookies.set(
			cookieName,
			JSON.stringify({
				necessary: true,
				analytics: false,
				marketing: false,
				preferences: false,
			}),
			{ expires: cookieLifeTime }
		)
		setShowCookie(false)
	}

	// Check cookie on load.
	useEffect(() => {
		if (Cookies.get(cookieName) === undefined) {
			setShowCookie(true)
		}
	}, [])

	// No cookie layer on SSR.
	if (!isClient()) {
		return null
	}

	return (
		<>
			{rest.isV2
				? showCookie && (
						<div
							className={vclsx(
								"animate fixed inset-0 z-[9999999999] flex items-center justify-center bg-black bg-opacity-80",
								showCookie ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
							)}
							aria-modal="true"
							data-testid="cookie-layer"
						>
							<div className="mx-4 w-full rounded-xl bg-primary-400 px-5 py-8 md:max-w-4xl md:px-6 md:py-10">
								<div className="flex flex-col gap-3 lg:flex-row">
									<div className="max-h-[calc(80vh_-_220px)] overflow-y-auto lg:max-w-[70%] lg:pr-5">
										<Wysiwyg
											html={body}
											textVariant="large"
											className="prose w-full pb-10 text-sm text-white prose-a:text-white lg:text-base"
											{...rest}
										/>
									</div>
									<div className="mt-5 flex flex-col items-center justify-center gap-5 lg:mt-0 lg:shrink-0 lg:grow">
										<Button
											variant="white"
											onClick={onAccept}
											className="w-full"
											data-testid="cookie-accept-button"
										>
											{actionLabel}
										</Button>

										{declineLabel && (
											<Button
												variant="danger"
												onClick={onDecline}
												className="w-full"
												aria-label="close-cookie-layer"
												data-testid="cookie-decline-button"
											>
												{declineLabel}
											</Button>
										)}

										{privacyPolicy?.title && (
											<Link
												//onClick={onAccept}
												href={privacyPolicy?.url}
												target={privacyPolicy?.attributes?.target}
												className={vclsx(
													privacyPolicy?.attributes?.class,
													"shrink-0 px-5 py-2 leading-snug tracking-wider text-white underline"
												)}
											>
												{privacyPolicy?.title}
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					)
				: showCookie && (
						<div
							className={vclsx(cookieCompliance[variant].wrapper)}
							data-testid="cookie-layer"
						>
							<div className={cookieCompliance[variant].container}>
								<div
									className={vclsx(
										cookieCompliance[variant].paragraph,
										"lg:flex lg:justify-between lg:gap-3"
									)}
								>
									<Wysiwyg html={body} className="max-w-7xl text-sm" {...rest} />
									<div className="flex content-center items-center">
										<Button
											onClick={onAccept}
											className={cookieCompliance[variant].btnAccept}
											data-testid="cookie-accept-button"
										>
											{actionLabel}
										</Button>
										{declineLabel && (
											<Button
												onClick={onDecline}
												className={cookieCompliance[variant].btnDecline}
												aria-label="close-cookie-layer"
												data-testid="cookie-decline-button"
											>
												{declineLabel}
											</Button>
										)}
										{privacyPolicy && (
											<Link
												href={privacyPolicy?.url}
												target={privacyPolicy?.attributes?.target}
											>
												{privacyPolicy?.title}
											</Link>
										)}
									</div>
								</div>
								<div className={cookieCompliance[variant].buttonContainer}>
									<Button
										onClick={onDecline}
										className={cookieCompliance[variant].buttonPosition}
										icon={<Icon id="x" width="20" height="20" />}
										aria-label="close-cookie-layer"
										id="close-cookie-layer-btn"
									></Button>
								</div>
							</div>
						</div>
					)}
		</>
	)
}
