import NodePage, { getServerSideProps as getBaseServerSideProps } from "../index"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { getSession, getProviders } from "next-auth/react"
import loadThemeLayout from "@/themes/.runtime"
import { redirectToAccountProfile } from "@/account"

const LoginComponent = ({ node = null, systemRoute = {}, ...rest }) => {
	return <NodePage node={node} systemRoute={systemRoute} {...rest} />
}

export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.account_login.path
	let status = true
	let props = await getBaseServerSideProps(context)
	if (props?.props?.error) {
		status = false
	}

	if (status) {
		const session = await getSession({ req: context.req })
		if (session) {
			return redirectToAccountProfile(context)
		}
	}

	let providers = await getProviders()
	providers = Object.keys(providers)
		.filter((key) => !key.includes("credentials") && !key.includes("one-time-login"))
		.reduce((cur, key) => {
			return Object.assign(cur, { [key]: providers[key] })
		}, {})

	props.props = {
		...props.props,
		node: {
			...props.props.node,
			providers: providers,
		},
	}
	return props
}

export default LoginComponent

LoginComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
