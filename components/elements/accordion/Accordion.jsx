import React, { useState } from "react"
import {
	vclsx,
	accordionSwitcher,
	accordionCalculatedStyle,
	accordionSwitchIcon,
} from "@vactorynext/core/utils"
import { Icon } from "../icon/Icon"
import { ChildTransition, ParentTransition } from "../animation/Animate"
import { motion } from "framer-motion"
import { accordion } from "./theme"

export const Accordion = ({
	variant = "default",
	openedNodeHandler,
	nodes = [],
	onlyOneOpen = false,
}) => {
	// State & Functionality for the selected accordion if onlyOneOpen == TRUE
	const [selected, setSelected] = useState(null)
	// State for the selected accordion if onlyOneOpen is FALSE ( Contains an Array of the opened accordions IDs )
	const [openedAccordions, setOpenedAccordions] = useState([])

	return (
		<article className={accordion[variant].wrapper}>
			<motion.div
				variants={ParentTransition}
				initial={"initial"}
				key={nodes.reduce((prev, curr) => prev + curr.id, "")}
			>
				{nodes.map((item, i) => {
					return (
						<motion.div
							key={item?.id || i}
							variants={ChildTransition(i)}
							initial="initial" // Set initial state for each child
							whileInView="animate" // Animate this child when it comes into view
							viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view, only once
						>
							<div className={accordion[variant].element}>
								<button
									className={vclsx(
										accordion[variant].button.base,
										accordionCalculatedStyle(
											accordion[variant].button,
											i,
											onlyOneOpen,
											selected,
											openedAccordions
										)
									)}
									onClick={(e) => {
										accordionSwitcher(
											e,
											item,
											i,
											selected,
											setSelected,
											openedNodeHandler,
											onlyOneOpen,
											openedAccordions,
											setOpenedAccordions
										)
									}}
								>
									<div className="w-full text-left">{item.button}</div>
									{accordion[variant].button.icon && (
										<Icon
											id={accordionSwitchIcon(
												accordion[variant].button.icon,
												onlyOneOpen,
												selected,
												i,
												openedAccordions
											)}
											className={vclsx(
												accordion[variant].button.icon.base,
												accordionCalculatedStyle(
													accordion[variant].button.icon,
													i,
													onlyOneOpen,
													selected,
													openedAccordions
												)
											)}
											width={accordion[variant].button.icon.width}
											height={accordion[variant].button.icon.height}
										/>
									)}
								</button>
								<div
									className={vclsx(
										accordion[variant].panel.wrapper,
										accordionCalculatedStyle(
											accordion[variant].panel,
											i,
											onlyOneOpen,
											selected,
											openedAccordions
										)
									)}
								>
									<div className={vclsx(accordion[variant].panel.base)}>{item.panel}</div>
								</div>
							</div>
						</motion.div>
					)
				})}
			</motion.div>
		</article>
	)
}
