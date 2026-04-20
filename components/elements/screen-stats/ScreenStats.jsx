import { Container, Heading, Icon, Text, Tooltip } from "@/ui"
import { useFlag } from "@vactory/console/client"
import { vclsx } from "@vactorynext/core/utils"
import { useBreakPoint } from "@vactorynext/core/hooks"
import { useEffect, useState } from "react"

// Helper function to get grid columns based on device
const getGridColumns = (device) => {
	switch (device) {
		case "desktop":
			return 12
		case "tablet":
			return 4
		default:
			return 2
	}
}

// Helper function to get grid CSS class
const getGridClass = (device) => {
	switch (device) {
		case "desktop":
			return "grid-cols-12"
		case "tablet":
			return "grid-cols-4"
		default:
			return "grid-cols-2"
	}
}

export const ScreenStats = ({ isStyleguide = false }) => {
	const isScreenStatsFlagEnabled = useFlag("screenStats")

	const device = useBreakPoint()
	const gridColumns = getGridColumns(device)
	const divs = Array.from({ length: gridColumns }, (_, index) => index)

	const [openStats, setOpenStats] = useState(false)
	const [gridLayout, setGridLayout] = useState(false)
	const [designMode, setDesignMode] = useState(false)
	const [innerWidth, setInnerWidth] = useState("N/A")
	const [containerMaxWidth, setContainerMaxWidth] = useState("N/A")

	useEffect(() => {
		document.designMode = designMode ? "on" : "off"
	}, [designMode])

	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width to state
			setInnerWidth(window.innerWidth + "px")

			// Get and set container max width
			const rootStyle = getComputedStyle(document.documentElement)
			setContainerMaxWidth(
				device === "desktop"
					? parseFloat(rootStyle.getPropertyValue("--container-max-width").trim()) * 16 +
							"px"
					: rootStyle.getPropertyValue("--container-max-width").trim()
			)
		}

		// Add event listener
		window.addEventListener("resize", handleResize)

		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize)
	}, [device])

	// If Screen Stats is not enabled from the console or isStyleguide === false , don't render the component
	if (!isScreenStatsFlagEnabled) {
		if (!isStyleguide) {
			return <></>
		}
	}

	return (
		<Container>
			<button
				type="button"
				onClick={() => setOpenStats(!openStats)}
				className="animate group fixed bottom-[70px] left-5 z-[100] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black bg-black hover:bg-white hover:shadow-md"
				aria-label="Open Screen Stats"
			>
				<Tooltip text="Open Screen Stats" position="topLeft">
					<Icon
						id="control-panel"
						className="animate h-4 w-4 text-white group-hover:rotate-180 group-hover:text-black"
					/>
				</Tooltip>
			</button>
			{openStats ? (
				<div className="fixed bottom-[90px] left-[70px] z-[101] flex flex-col gap-2">
					<button
						type="button"
						className={vclsx(
							"cursor-pointer rounded-xl px-2 py-[6px] text-center text-sm text-white shadow",
							gridLayout ? "bg-green-500" : "bg-error-500"
						)}
						onClick={() => setGridLayout(!gridLayout)}
					>
						Grid Layout
					</button>
					<button
						type="button"
						className={vclsx(
							"cursor-pointer rounded-xl px-2 py-[6px] text-center text-sm text-white shadow",
							designMode ? "bg-green-500" : "bg-error-500"
						)}
						onClick={() => setDesignMode(!designMode)}
					>
						Design Mode
					</button>
				</div>
			) : null}

			{/* Grid Layout */}
			{gridLayout ? (
				<div className="container fixed left-0 top-0 z-[99] h-screen w-full !px-4 lg:left-1/2 lg:-translate-x-1/2 lg:!px-0">
					<div className={vclsx("grid h-full gap-5", getGridClass(device))}>
						{divs.map((div) => (
							<div
								key={`grid-${div}`}
								className="flex items-center justify-center border border-error-300 bg-error-300 bg-opacity-20"
							>
								<Heading level={2} variant={2} className="text-red-500 text-opacity-40">
									{div + 1}
								</Heading>
							</div>
						))}
					</div>
					<Text className="absolute bottom-0 left-0 flex gap-1 border border-error-300 bg-white p-2 font-bold">
						Viewport:
						<Text as="span" className="font-normal">
							{innerWidth}
						</Text>
						- Container width:
						<Text as="span" className="font-normal">
							{containerMaxWidth}
						</Text>
					</Text>
				</div>
			) : null}
		</Container>
	)
}
