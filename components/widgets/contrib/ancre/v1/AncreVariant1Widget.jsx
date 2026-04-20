import { useState, useEffect, useRef, useCallback } from "react"
import { Waypoint } from "react-waypoint"
import { vclsx } from "@vactorynext/core/utils"
import { useNode } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { Text } from "@/ui"

export const config = {
	id: "vactory_default:47",
}

const extractAncreBlocks = (node) => {
	const blocks = node.blocs.field_vactory_paragraphs
	const ancreBlocks = blocks?.filter((paragraph) => paragraph.field_vactory_flag_2)

	return ancreBlocks?.map((block) => ({
		title: block.field_titre_ancre || block.field_vactory_title,
		id: block?.paragraph_identifier
			? block.paragraph_identifier
			: `${block.field_vactory_component?.widget_id}-${block.drupal_internal__id}`,
	}))
}

export const AncreV1 = ({ navigation }) => {
	const router = useRouter()
	const [shouldStick, setShouldStick] = useState(false)
	const [activeId, setActiveId] = useState(navigation[0]?.target || "")
	const lastScrollY = useRef(0)
	const navRef = useRef(null)
	const anchorRefs = useRef({})

	// Track active section based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY

			lastScrollY.current = currentScrollY

			// Find active section
			const offset = 250 // Account for sticky header
			for (let i = navigation.length - 1; i >= 0; i--) {
				const element = document.getElementById(navigation[i].target)
				if (element) {
					const rect = element.getBoundingClientRect()
					if (rect.top <= offset) {
						setActiveId(navigation[i].target)
						break
					}
				}
			}
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [shouldStick, navigation])

	const handleAncreEnter = () => {
		setShouldStick(false)
	}

	const handleAncreLeave = () => {
		setShouldStick(true)
	}

	// Center active anchor on mobile
	useEffect(() => {
		const isMobile = globalThis.innerWidth < 768
		if (isMobile && navRef.current && anchorRefs.current[activeId]) {
			const nav = navRef.current
			const anchor = anchorRefs.current[activeId]
			if (anchor) {
				const navRect = nav.getBoundingClientRect()
				const anchorRect = anchor.getBoundingClientRect()
				// Calculate scroll position to center the active anchor (offset left by 40px)
				const scrollLeft =
					anchor.offsetLeft - navRect.width / 2 + anchorRect.width / 2 - 40
				nav.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" })
			}
		}
	}, [activeId, shouldStick])

	const scrollToSection = useCallback(
		(e, targetId) => {
			e.preventDefault()
			const element = document.getElementById(targetId)
			if (element) {
				const offset = 120 // Account for sticky header height
				const elementPosition = element.getBoundingClientRect().top + globalThis.scrollY
				const offsetPosition = elementPosition - offset

				globalThis.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				})

				// Update URL hash without triggering scroll
				const basePath = router.asPath.split("#")[0]
				globalThis.history.pushState(null, "", `/${router.locale}${basePath}#${targetId}`)
				setActiveId(targetId)
			}
		},
		[router]
	)

	return (
		<div className="relative hidden py-12 lg:block">
			<Waypoint onEnter={handleAncreEnter} onLeave={handleAncreLeave} />
			<div
				className={`${vclsx(
					"mx-auto flex min-h-[45px] w-full flex-row items-stretch justify-center gap-1 rounded-full border border-primary-100 bg-white p-1 lg:max-w-5xl xl:max-w-[1216px]",
					shouldStick
						? "fixed left-0 right-0 top-2 z-30 mx-auto w-full"
						: "absolute left-0 right-0 top-1/2 mx-auto w-full -translate-y-1/2"
				)}`}
			>
				{navigation.map((item) => {
					const isActive = activeId === item.target
					return (
						<a
							key={item.id}
							ref={(el) => (anchorRefs.current[item.target] = el)}
							href={`#${item.target}`}
							onClick={(e) => scrollToSection(e, item.target)}
							className={vclsx(
								"flex flex-1 cursor-pointer items-center justify-center rounded-full bg-primary-50 p-1 text-center text-sm font-medium text-primary-500",
								isActive && "bg-primary-500 !text-white"
							)}
						>
							<Text as="span" variant="body2">
								{item.name}
							</Text>
						</a>
					)
				})}
			</div>
		</div>
	)
}

const AncreV1Container = () => {
	const node = useNode()
	const ancres = extractAncreBlocks(node)

	// If no anchors found, return null
	if (!ancres || ancres?.length === 0) return null

	const props = {
		navigation: ancres.map((item) => {
			return {
				id: item.id,
				name: item.title,
				target: item.id,
			}
		}),
	}

	return <AncreV1 {...props} />
}

export default AncreV1Container
