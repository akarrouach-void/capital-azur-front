import { BlocksController } from "@vactorynext/core/blocks"
import { NodePageProvider } from "@vactorynext/core/context"
import { GlobalVideoModal, BackToTop, Icon, Container } from "@/ui"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAccount } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"
import { Widgets } from "@/runtime/widgets"

import "./theme.css"

export function Layout({ children, ...props }) {
	const router = useRouter()
	const { isAuthenticated } = useAccount()

	useEffect(() => {
		// Push data layer that shows the infos about the visited page
		const checkPageStatus = (url) => {
			let displayMode = "browser tab"
			if (window.matchMedia("(display-mode: standalone)").matches) {
				displayMode = "standalone"
			}
			dlPush("Statut de connexion", {
				Connecté: isAuthenticated,
				"Visite PWA": displayMode === "standalone",
				url: url,
			})
		}

		checkPageStatus(router.asPath)
	}, [router.asPath, isAuthenticated])

	return (
		// <div className="pt-[88px] max-lg:pb-[56px]">
		<div className="pt-0 max-lg:pb-0">
			{/* <motion.div {...motionVariants}> */}
			<NodePageProvider node={props?.node || {}} systemRoute={props?.systemRoute || {}}>
				<div id="header-region">
					<BlocksController
						region="top"
						runtimeWidgets={Widgets}
						ContainerComponent={Container}
					/>
					<BlocksController
						region="header"
						runtimeWidgets={Widgets}
						ContainerComponent={Container}
					/>
				</div>
				<BlocksController
					region="bridge"
					runtimeWidgets={Widgets}
					ContainerComponent={Container}
				/>
				<main data-node-id={props?.node?.drupal_internal__nid} id="main-content">
					{children}
					<BlocksController
						region="content"
						runtimeWidgets={Widgets}
						ContainerComponent={Container}
					/>
				</main>
				<div id="footer-region">
					<BlocksController
						region="footer"
						runtimeWidgets={Widgets}
						ContainerComponent={Container}
					/>
					<BlocksController
						region="bottom"
						runtimeWidgets={Widgets}
						ContainerComponent={Container}
					/>
				</div>
				<GlobalVideoModal
					closeIcon={<Icon className="h-5 w-5" id="x" />}
					expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
					minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
				/>
				<BackToTop />
				{/* <ThemeChanger /> */}
			</NodePageProvider>
			{/* </motion.div> */}
		</div>
	)
}
