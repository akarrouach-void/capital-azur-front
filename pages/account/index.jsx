import NodePage, { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession } from "next-auth/react"
import loadThemeLayout from "@/themes/.runtime"
import { redirectToLogin } from "@/account"

const AccountComponent = ({ node = null, systemRoute = {}, ...rest }) => {
	return <NodePage node={node} systemRoute={systemRoute} {...rest} />
}

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })
	if (!session) {
		return redirectToLogin(context)
	}

	context.query.slug = SYSTEM_ROUTES.account.path
	const props = await getBaseServerSideProps(context)

	return props
}

export default AccountComponent

AccountComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
