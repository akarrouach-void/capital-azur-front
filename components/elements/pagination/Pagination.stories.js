import { Pagination } from "./Pagination"
import { PaginationV2 } from "./PaginationV2"
import PaginationCode from "!!raw-loader!./Pagination"

const Template = (args) => {
	return <Pagination {...args}></Pagination>
}

const Template1 = (args) => {
	return <PaginationV2 {...args}></PaginationV2>
}

export const PaginationStories = Template.bind({})
export const PaginationV2Stories = Template1.bind({})

PaginationStories.argTypes = {
	current: {
		control: "number",
		description: "Current page",
		table: {
			defaultValue: { summary: 1 },
		},
	},
	pageSize: {
		control: "number",
		description: "Number of items per page",
		table: {
			defaultValue: { summary: 9 },
		},
	},
	total: {
		control: "number",
		description: "Total number of items",
		table: {
			defaultValue: { summary: 45 },
		},
	},
}

PaginationV2Stories.argTypes = {
	current: {
		control: "number",
		description: "Current page",
		table: {
			defaultValue: { summary: 1 },
		},
	},
	pageSize: {
		control: "number",
		description: "Number of items per page",
		table: {
			defaultValue: { summary: 9 },
		},
	},
	total: {
		control: "number",
		description: "Total number of items",
		table: {
			defaultValue: { summary: 45 },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "components/Paginations",
	args: {
		current: 1,
		pageSize: 9,
		total: 45,
		id: "news-pagination",
	},
	parameters: {
		componentSource: {
			code: PaginationCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description :
				Pagination component for navigating through a list of items.
				`,
			},
		},
	},
}
