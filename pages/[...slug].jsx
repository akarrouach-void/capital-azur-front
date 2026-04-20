import { default as BaseNodePage } from "./index"
export { getServerSideProps } from "./index"
import loadThemeLayout from "@/themes/.runtime"

const SlugFunction = (props) => <BaseNodePage {...props} />

export default SlugFunction

SlugFunction.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
