import { SYSTEM_ROUTES, generateTranslationForStaticRoute } from "@vactorynext/core/lib"
import { getServerSideProps as getBaseServerSideProps } from "./index"
import SearchResults, {
	getServerSideProps as getSearchServerSideProps,
} from "../components/modules/contrib/search/SearchResults"
import loadThemeLayout from "@/themes/.runtime"
import { NodePageHtml } from "@vactorynext/core/config-client"

const Search = ({ node, ...rest }) => {
	return (
		<NodePageHtml node={node}>
			<SearchResults node={node} {...rest} />
		</NodePageHtml>
	)
}
export async function getServerSideProps(context) {
	context.query.slug = SYSTEM_ROUTES.search.path
	const data = await getBaseServerSideProps(context)
	const props = await getSearchServerSideProps(data, context)

	data.props.internal_extra = {
		translations: generateTranslationForStaticRoute(SYSTEM_ROUTES.search.path),
	}

	return props
}

export default Search

Search.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
