import { SYSTEM_ROUTES, generateTranslationForStaticRoute } from "@vactorynext/core/lib"
import { getServerSideProps as getBaseServerSideProps } from "./index"
import SearchV2Results, {
	getServerSideProps as getSearchServerSideProps,
} from "../components/modules/contrib/search/SearchV2Results"
import loadThemeLayout from "@/themes/.runtime"
import { NodePageHtml } from "@vactorynext/core/config-client"

const SearchV2 = ({ node, ...rest }) => {
	return (
		<NodePageHtml node={node}>
			<SearchV2Results node={node} {...rest} />
		</NodePageHtml>
	)
}
export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.search_v2.path
	const data = await getBaseServerSideProps(context)
	const props = await getSearchServerSideProps(data, context)

	data.props.internal_extra = {
		translations: generateTranslationForStaticRoute(SYSTEM_ROUTES.search_v2.path),
	}

	return props
}

export default SearchV2

SearchV2.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
