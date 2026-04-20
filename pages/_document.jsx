import Document, { Html, Head, Main, NextScript } from "next/document"

export default class AppDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return {
			...initialProps,
			locale: ctx?.locale,
			styles: initialProps.styles,
		}
	}

	render() {
		const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps

		// Remove node, i18n, menus from pageProps
		if (pageProps && typeof pageProps === "object") {
			/* eslint-disable no-unused-vars */
			const { node, i18n, menus, ...safePageProps } = pageProps
			this.props.__NEXT_DATA__.props.pageProps = safePageProps
		}

		return (
			<Html
				className={pageProps?.document?.htmlClass ?? ""}
				dir={this.props.locale === "ar" ? "rtl" : "ltr"}
				lang={this.props.locale}
			>
				<Head>
					<link rel="preconnect" href="https://www.googletagmanager.com" />
				</Head>
				<body className={pageProps?.document?.bodyClass ?? ""}>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
