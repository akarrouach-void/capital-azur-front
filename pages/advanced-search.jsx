import { SYSTEM_ROUTES, generateTranslationForStaticRoute } from "@vactorynext/core/lib"
import { getServerSideProps as getBaseServerSideProps } from "./index"
import AdvancedSearchResults, {
	getServerSideProps as getSearchServerSideProps,
} from "../components/modules/contrib/search/AdvancedSearchResults"
import loadThemeLayout from "@/themes/.runtime"
import { NodePageHtml } from "@vactorynext/core/config-client"

const AdvancedSearchComponent = ({ node, ...rest }) => {
	return (
		<NodePageHtml node={node}>
			<AdvancedSearchResults node={node} {...rest} />
		</NodePageHtml>
	)
}
export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.advanced_search.path
	const data = await getBaseServerSideProps(context)
	const props = await getSearchServerSideProps(data, context)

	data.props.internal_extra = {
		translations: generateTranslationForStaticRoute(SYSTEM_ROUTES.advanced_search.path),
	}

	return props
}

export default AdvancedSearchComponent

AdvancedSearchComponent.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
