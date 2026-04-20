import { Tabs } from "@/ui"

export const config = {
	id: "vactory_default:3",
	lazy: false,
}

export const Tab = ({ tabs }) => {
	return <Tabs variant="default" onlyOneOpen="true" nodes={tabs} />
}

const TabsContainer = ({ data }) => {
	const props = {
		tabs: data.components.map((tab, index) => {
			return {
				id: index,
				title: tab.title,
				content: tab.description,
			}
		}),
	}
	return <Tab {...props} />
}

export default TabsContainer
