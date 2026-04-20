import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { LoadingOverlay } from "@/ui"
import loadThemeLayout from "@/themes/.runtime"
import { useRouter } from "next/router"
import { getServerSideProps as getBaseServerSideProps } from "../index"
import { redirectToHomePage } from "@/account"
import { toast } from "react-toastify"

export default function ApikeySession() {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const isBrowser = typeof window !== "undefined"
	let callbackUrl = "/"
	let apikey = ""
	if (isBrowser) {
		const urlParams = new URLSearchParams(window.location.search)
		apikey = urlParams.get("key")
	}

	useEffect(() => {
		async function login() {
			setLoading(true)
			const res = await signIn("apikey", {
				callbackUrl,
				apikey,
				redirect: false,
			})
			if (res?.error) {
				setLoading(false)
				toast.error(res.error)
			}
			if (res.url) router.push(res.url)
		}
		login()
	}, [])
	return (
		<LoadingOverlay
			active={loading}
			spinner={true}
			text="authentification en cours ..."
		/>
	)
}

ApikeySession.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })

	if (session) {
		return redirectToHomePage(context)
	}
	return await getBaseServerSideProps(context)
}
