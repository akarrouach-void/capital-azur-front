import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { tabs } from "./theme"

export const Tabs = ({ nodes = [], variant = "default", onClick }) => {
	return (
		<div className={tabs[variant].wrapper}>
			<TabGroup>
				<TabList className={tabs[variant].listwrapper}>
					{nodes.map((node) => (
						<Tab
							onClick={() => {
								typeof onClick === "function" && onClick(node.id)
							}}
							key={node.id}
							className={({ selected }) =>
								vclsx(
									tabs[variant].title.base,
									selected ? tabs[variant].title.active : tabs[variant].title.inactive
								)
							}
						>
							{node.title}
						</Tab>
					))}
				</TabList>
				<TabPanels>
					{nodes.map((node) => (
						<TabPanel key={node.id} className={tabs[variant].panel}>
							{node.content}
						</TabPanel>
					))}
				</TabPanels>
			</TabGroup>
		</div>
	)
}
