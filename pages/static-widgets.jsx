import { useMemo, useCallback } from "react"
import loadThemeLayout from "@/themes/.runtime"
import Head from "next/head"
import { Container, Heading, ScreenStats } from "@/ui"
import { WidgetsStatic } from "@/runtime/widgets-static"
import { ErrorBoundary } from "@vactorynext/core/utils"

const StaticWidgets = () => {
	return (
		<>
			<Head>
				<title>Static Widgets</title>
			</Head>

			<Heading level={1} className="mb-10 bg-primary py-10 text-center text-white">
				Static Widgets
			</Heading>

			{/* Screen Stats */}
			<ScreenStats isStyleguide={true} />

			{/* Widgets Static */}
			<WidgetsStaticComponents />

			{/* Grid System */}
			<Container className="pt-10">
				<Heading variant="title-paragraph">Grid System</Heading>
				<GridSystem />
			</Container>
		</>
	)
}

const WidgetsStaticComponents = () => {
	// Memoize renderWidgetUI to prevent recreation on every render
	const renderWidgetUI = useCallback((item) => {
		// Display nothing if toHide=true in mockdata.js
		// Else Show the DF if it has data specified in it's mockdata.js file and pass it to it
		// Else If there is no mockdata.js file, show an error block
		if (item?.mockdata?.settings?.toHide) {
			return null
		} else if (item?.mockdata?.data) {
			return (
				<>
					<Heading variant="title-paragraph" className="container">
						{item.id}
					</Heading>
					<Container layout={item?.mockdata?.settings?.containerLayout}>
						<item.widget data={item.mockdata.data} />
					</Container>
				</>
			)
		} else {
			return (
				<div className="bg-red-100 p-5 text-center">
					The widget <b>{item.id}</b> does not have a mockdata.js file or the data is
					empty.
				</div>
			)
		}
	}, [])

	return (
		<div className="flex flex-col gap-8">
			{WidgetsStatic.map((item) => {
				return (
					<div key={item.id} data-df={item?.id} data-widget-path={item?.widgetPath}>
						<ErrorBoundary>{renderWidgetUI(item)}</ErrorBoundary>
					</div>
				)
			})}
		</div>
	)
}

const GridSystem = () => {
	// Memoize arrays to prevent recreation on every render
	const grid12 = useMemo(() => [...new Array(12).keys()], [])
	const grid4 = useMemo(() => [...new Array(4).keys()], [])
	const grid3 = useMemo(() => [...new Array(3).keys()], [])
	const grid2 = useMemo(() => [...new Array(2).keys()], [])

	return (
		<>
			<Heading level={6} className="text-center">
				12 Cols
			</Heading>

			<div className="mb-8 grid grid-cols-12 gap-5">
				{grid12.map((item) => {
					return (
						<div key={item} className="col-span-1 bg-primary py-4 text-center text-white">
							1
						</div>
					)
				})}
			</div>

			<Heading level={6} className="text-center">
				4 Cols
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				{grid4.map((item) => {
					return (
						<div key={item} className="col-span-3 bg-primary py-4 text-center text-white">
							3
						</div>
					)
				})}
			</div>

			<Heading level={6} className="text-center">
				3 Cols
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				{grid3.map((item) => {
					return (
						<div key={item} className="col-span-4 bg-primary py-4 text-center text-white">
							4
						</div>
					)
				})}
			</div>

			<Heading level={6} className="text-center">
				2 Cols
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				{grid2.map((item) => {
					return (
						<div key={item} className="col-span-6 bg-primary py-4 text-center text-white">
							6
						</div>
					)
				})}
			</div>

			<Heading level={6} className="text-center">
				1 Col
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				<div className="col-span-12 bg-primary py-4 text-center text-white">Full</div>
			</div>

			<Heading level={6} className="text-center">
				Col 4 - Col 8
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				<div className="col-span-4 bg-primary py-4 text-center text-white">4</div>
				<div className="col-span-8 bg-primary py-4 text-center text-white">8</div>
			</div>

			<Heading level={6} className="text-center">
				Col 3 - Col 5 - Col 4
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				<div className="col-span-3 bg-primary py-4 text-center text-white">3</div>
				<div className="col-span-5 bg-primary py-4 text-center text-white">5</div>
				<div className="col-span-4 bg-primary py-4 text-center text-white">4</div>
			</div>

			<Heading level={6} className="text-center">
				Col 1 - Col 3 - Col 5 - Col 1 - Col 2
			</Heading>
			<div className="mb-8 grid grid-cols-12 gap-5">
				<div className="col-span-1 bg-primary py-4 text-center text-white">1</div>
				<div className="col-span-3 bg-primary py-4 text-center text-white">3</div>
				<div className="col-span-5 bg-primary py-4 text-center text-white">5</div>
				<div className="col-span-1 bg-primary py-4 text-center text-white">1</div>
				<div className="col-span-2 bg-primary py-4 text-center text-white">2</div>
			</div>
		</>
	)
}

export default StaticWidgets

StaticWidgets.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
