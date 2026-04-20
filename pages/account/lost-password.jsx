import NodePage, { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession } from "next-auth/react"
import loadThemeLayout from "@/themes/.runtime"
import { redirectToAccountProfile } from "@/account"

const LostPasswordComponent = ({ node = null, systemRoute = {}, ...rest }) => {
	return <NodePage node={node} systemRoute={systemRoute} {...rest} />
}

export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.account_lost_password.path
	let status = true
	const props = await getBaseServerSideProps(context)
	if (props?.props?.error) {
		status = false
	}

	if (status) {
		const session = await getSession({ req: context.req })
		if (session) {
			return redirectToAccountProfile(context)
		}
	}

	return props
}

export default LostPasswordComponent

LostPasswordComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
