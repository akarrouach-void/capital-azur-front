import { useState } from "react"
import { Link } from "react-scroll"
import { Waypoint } from "react-waypoint"

import { Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:48",
}

export const AncreV2 = ({ navigation }) => {
	const [shouldStick, setShouldStick] = useState(false)

	const handleAncreEnter = () => {
		setShouldStick(false)
	}

	const handleAncreLeave = () => {
		setShouldStick(true)
	}

	/* To Fix react-scroll bug, Sometimes it's not reaching the targeted paragraph (1px less) */
	const additionalScroll = () => {
		// We are using setTimeOut to wait for react-scroll's scrolling to end ( Which takes 1000ms ), and then after 50ms we scroll for additional 2px to fix the bug we are facing
		setTimeout(() => {
			window.scrollTo(0, window.scrollY + 2)
		}, 1050)
	}

	return (
		<div className="hidden lg:block">
			<Waypoint onEnter={handleAncreEnter} onLeave={handleAncreLeave} />
			<div
				className={`${vclsx(
					"animate fixed top-1/2 z-50 flex w-7 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl bg-white py-2 shadow-lg",
					shouldStick ? "right-2" : "-right-10"
				)}`}
			>
				{navigation.map((item) => {
					return (
						<Link
							key={item.id}
							activeClass="!border-primary-500 before:content-[''] before:absolute before:w-[6px] before:h-[6px] before:bg-primary-500 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-y-1/2 before:-translate-x-1/2 ancre-is-active"
							to={item.id}
							spy
							smooth
							hashSpy={true}
							className="animate group relative h-4 w-4 cursor-pointer rounded-full border-2 border-primary-200 hover:border-primary-500"
							isDynamic={true}
							duration={1000}
							onClick={additionalScroll}
							href="#."
						>
							<Text
								as="span"
								variant="body2"
								className={vclsx(
									"animate absolute -top-[4px] right-8 w-max rounded-xl bg-gradient px-3 py-[2px] text-[10px] uppercase text-white shadow-md after:absolute after:-right-[1px] after:top-1/2 after:h-[6px] after:w-[6px] after:-translate-y-1/2 after:rotate-45 after:bg-purple-600 after:content-['']",
									"opacity-20 group-hover:opacity-60 group-[.ancre-is-active]:opacity-100",
									!shouldStick && "invisible opacity-0"
								)}
							>
								{item.name}
							</Text>
						</Link>
					)
				})}
			</div>
		</div>
	)
}

const AncreV2Container = ({ data }) => {
	const props = {
		navigation: data.components.map((item) => {
			return {
				name: item.title,
				id: item.paragraphId,
			}
		}),
	}
	return <AncreV2 {...props} />
}

export default AncreV2Container
