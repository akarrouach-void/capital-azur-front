import React from "react"
import { Table } from "./Table"
import TableCode from "!!raw-loader!./Table"
import { data, column, columnToggle, columnFooter } from "./mock-data"

const Template1 = () => <Table data={data} column={column} variant="default" />
const Template2 = () => <Table data={data} column={column} variant="dark" />
const Template3 = () => (
	<Table data={data} column={columnToggle} columnFooter={columnFooter} variant="even" />
)

export const TableLightStories = Template1.bind({})
export const TableDarkStories = Template2.bind({})
export const TableEveneStories = Template3.bind({})

const TableObj = {
	title: "Components/Table",
	parameters: {
		componentSource: {
			code: TableCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description :
				Table component for creating table with various styles and options.
				`,
			},
		},
	},
}

export default TableObj
