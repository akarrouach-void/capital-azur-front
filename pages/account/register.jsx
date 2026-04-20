import NodePage, { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession } from "next-auth/react"
import loadThemeLayout from "@/themes/.runtime"
import { redirectToAccountProfile } from "@/account"

const RegisterComponent = ({ node = null, systemRoute = {}, ...rest }) => {
	return <NodePage node={node} systemRoute={systemRoute} {...rest} />
}
export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.account_register.path
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

export default RegisterComponent

RegisterComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
