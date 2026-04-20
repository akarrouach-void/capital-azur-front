import NodePage, { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession } from "next-auth/react"
import loadThemeLayout from "@/themes/.runtime"
import {
	checkOneTimeToken,
	redirectToLostPassword,
	redirectToAccountProfile,
} from "@/account"

const ResetPasswordComponent = ({ node = null, systemRoute = {}, ...rest }) => {
	return <NodePage node={node} systemRoute={systemRoute} {...rest} />
}

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })
	if (session) {
		return redirectToAccountProfile(context)
	}

	context.query.slug = SYSTEM_ROUTES.account_reset_password.path

	if (!context.query?.uid || !context.query?.timestamp || !context.query?.hash) {
		return redirectToLostPassword(context)
	}

	// Check if one time login query params are valid.
	try {
		const tokenCheckResponse = await checkOneTimeToken(context.query?.uid, context)
		if (tokenCheckResponse.status === 401) {
			return redirectToLostPassword(context)
		}
	} catch (error) {
		console.error("[account reset password]", error)
	}

	return await getBaseServerSideProps(context)
}

export default ResetPasswordComponent

ResetPasswordComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
