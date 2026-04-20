import { signIn } from "next-auth/react"
import React, { useEffect } from "react"

export default function Sessionless() {
	const isBrowser = typeof window !== "undefined"
	let callbackUrl = "/"
	if (isBrowser) {
		const urlParams = new URLSearchParams(window.location.search)
		callbackUrl = urlParams.get("callbackUrl")
	}

	useEffect(() => {
		async function login() {
			await signIn("drupal", { callbackUrl })
		}
		login()
	}, [])
	return <div></div>
}
