import { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession } from "next-auth/react"
import { drupal } from "@vactorynext/core/drupal"
import { Alert, Container } from "@/ui"
import loadThemeLayout from "@/themes/.runtime"
import { NodePageHtml } from "@vactorynext/core/config-client"

const LoginComponent = ({ node = null, verify }) => {
	return (
		<NodePageHtml node={node}>
			<Container className="py-11">
				<Alert
					shouldClose={false}
					className="w-100 p-5"
					variant={verify?.status === 200 ? "success" : "warning"}
				>
					{verify?.message}
				</Alert>
			</Container>
		</NodePageHtml>
	)
}

export async function getServerSideProps(context) {
	const { locale } = context
	context.query.slug = SYSTEM_ROUTES.account_verify.path
	let status = true
	let props = await getBaseServerSideProps(context)
	if (props?.props?.error) {
		status = false
	}

	const session = await getSession({ req: context.req })

	if (status) {
		const { locale } = context
		if (session) {
			return {
				redirect: {
					destination: `/${locale}${SYSTEM_ROUTES.account.path}`,
					permanent: false,
				},
			}
		}
	}

	const { timestamp, hash, uid } = context.query

	if (timestamp && hash && uid) {
		try {
			const response = await drupal.fetch(
				`${locale}/api/account/verify/${uid}/${timestamp}/${hash}`,
				{
					withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
					headers: {
						"X-Auth-Provider": session?.provider || "",
					},
				}
			)

			const data = await response.json()
			props.props = {
				...props.props,
				verify: {
					message: data?.message,
					status: response?.status,
				},
			}
		} catch (error) {
			console.error("[account verify]", error)
		}
	} else {
		return {
			redirect: {
				destination: `/${locale}${SYSTEM_ROUTES.account_login.path}`,
				permanent: false,
			},
		}
	}

	return props
}

export default LoginComponent

LoginComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
