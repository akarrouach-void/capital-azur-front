import NodePage, { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession } from "next-auth/react"
import loadThemeLayout from "@/themes/.runtime"
import { redirectToLogin, redirectToHomePage, checkOneTimeToken } from "@/account"

const ForgotenPasswordComponent = ({ node = null, systemRoute = {}, ...rest }) => {
	return <NodePage node={node} systemRoute={systemRoute} {...rest} />
}

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })

	if (!session) {
		return redirectToLogin(context)
	}

	if (!context.query?.timestamp || !context.query?.hash) {
		return redirectToHomePage(context)
	}

	try {
		const tokenCheckResponse = await checkOneTimeToken(session?.user?.id, context)

		if (tokenCheckResponse.status === 401) {
			return redirectToHomePage(context)
		}
	} catch (error) {
		console.error("[account reset password]", error)
	}

	context.query.slug = SYSTEM_ROUTES.account_forget_password.path
	return await getBaseServerSideProps(context)
}

export default ForgotenPasswordComponent

ForgotenPasswordComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
