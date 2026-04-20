import { useEffect, useState } from "react"
import { Link } from "react-scroll"
import { Waypoint } from "react-waypoint"

import { Text, Heading, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:91",
}

const AncreV3 = ({ navigation, title, button }) => {
	const [fixeTop, setfixeTop] = useState(false)
	const [fixeBottom, setfixeBottom] = useState(false)
	useEffect(() => {
		//! check that "vactory-paragrphs-wrapper" class exists first then continue
		const mainElement = document.querySelector(".vactory-paragrphs-wrapper")
		if (mainElement) {
			const mainHeight = mainElement.offsetHeight
			window.addEventListener("scroll", () => {
				if (window.scrollY > 300) {
					if (window.scrollY < mainHeight) {
						setfixeTop(true)
						setfixeBottom(false)
					} else {
						setfixeTop(false)
						setfixeBottom(true)
					}
				} else {
					setfixeTop(false)
				}
			})
		}
	}, [])

	// /* To Fix react-scroll bug, Sometimes it's not reaching the targeted paragraph (1px less) */
	const additionalScroll = () => {
		// We are using setTimeOut to wait for react-scroll's scrolling to end ( Which takes 1000ms ), and then after 50ms we scroll for additional 2px to fix the bug we are facing
		setTimeout(() => {
			window.scrollTo(0, window.scrollY + 2)
		}, 1050)
	}

	// Determening the active id
	const [activeId, setActiveId] = useState("")
	return (
		<div className="relative z-[90] hidden lg:block">
			<Waypoint />
			<div
				className={`${vclsx(
					"animate ml-3 mt-3 flex w-[300px] flex-col gap-4 rounded-xl bg-gradient px-3 py-5 shadow-md",
					fixeTop && "fixed top-0",
					fixeBottom && "absolute bottom-10"
				)}`}
			>
				<Heading level={6} className="border-b border-white pb-3 text-white">
					{title}
				</Heading>
				<div className="border-b border-white pb-3">
					{navigation.map((item) => {
						return (
							<div
								className="group relative mb-6 flex items-center last:mb-0"
								key={item.id}
							>
								<Link
									activeClass="active"
									to={item.id}
									spy
									smooth
									hashSpy={true}
									className={vclsx(
										"group relative h-4 w-4 cursor-pointer rounded-full border border-white before:absolute before:left-1/2 before:top-1/2 before:h-4 before:w-4 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-['']",
										item.id === activeId ? "before:bg-white" : "before:bg-white/20"
									)}
									isDynamic={true}
									duration={1000}
									offset={30}
									onClick={additionalScroll}
									onSetActive={(e) => setActiveId(e)}
									href="#."
								/>
								<Text
									as="span"
									variant="body2"
									className={vclsx(
										"-top-[4px] right-8 px-3 py-[2px] text-[14px] before:absolute before:left-[7px] before:top-5 before:h-9 before:w-[2px] before:bg-white/[.4] before:content-[''] group-last:before:h-0",
										item.id === activeId ? "font-medium text-white" : "text-white/[.8]"
									)}
								>
									{item.name}
								</Text>
							</div>
						)
					})}
				</div>
				<Button {...button} variant="white">
					{button?.title}
				</Button>
			</div>
		</div>
	)
}

const AncreV3Container = ({ data }) => {
	const props = {
		navigation: data?.components?.map((item) => {
			return {
				name: item.title,
				id: item.paragraphId,
			}
		}),
		title: data.extra_field.title,
		button: {
			title: data.extra_field.link?.title,
			url: data.extra_field.link?.url,
			id: data.extra_field.link?.attributes?.id,
			class: data.extra_field.link?.attributes?.class,
			rel: data.extra_field.link?.attributes?.rel,
			target: data.extra_field.link?.attributes?.target,
		},
	}
	return <AncreV3 {...props} />
}

export default AncreV3Container
