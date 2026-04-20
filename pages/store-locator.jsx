import { SYSTEM_ROUTES, generateTranslationForStaticRoute } from "@vactorynext/core/lib"
import { getServerSideProps as getBaseServerSideProps } from "./index"
import StoreLocator, {
	getServerSideProps as getStoreLocatorServerSideProps,
} from "../components/modules/contrib/locator/annuaire/StoreLocator"
import loadThemeLayout from "@/themes/.runtime"
import { NodePageHtml } from "@vactorynext/core/config-client"

const StoreLocatorPage = ({ node, ...rest }) => {
	return (
		<NodePageHtml node={node}>
			<StoreLocator node={node} {...rest} />
		</NodePageHtml>
	)
}
export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.store_locator.path
	const data = await getBaseServerSideProps(context)
	const props = await getStoreLocatorServerSideProps(data, context)

	data.props.internal_extra = {
		translations: generateTranslationForStaticRoute(SYSTEM_ROUTES.store_locator.path),
	}

	return props
}
export default StoreLocatorPage

StoreLocatorPage.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
