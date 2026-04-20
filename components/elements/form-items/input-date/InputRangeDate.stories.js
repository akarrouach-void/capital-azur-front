import React, { useState, useEffect, forwardRef } from "react"
import { InputDate } from "./InputDate"
import InputRangeDateCode from "!!raw-loader!./InputRangeDate"
import { Button } from "../../button/Button"
import { format } from "date-fns"

const ButtonInput = forwardRef(({ value, onClick }, ref) => (
	<Button
		variant="inputDate"
		onClick={onClick}
		ref={ref}
		className="inline-flex w-full justify-start rounded bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-0 "
	>
		{value ? format(new Date(value), "dd MMMM yyyy") : format(new Date(), "dd MMMM yyyy")}
	</Button>
))

const Template = (args) => {
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date().setMonth(startDate.getMonth() + 1))

	useEffect(() => {
		if (startDate > endDate) setStartDate(endDate)
	}, [endDate])

	useEffect(() => {
		if (startDate > endDate) setEndDate(startDate)
	}, [startDate])

	return (
		<div className="mx-auto flex max-w-2xl items-center justify-center space-x-4 py-20">
			<span className="font-medium text-gray-500">input range date:</span>
			<div className="relative w-40">
				<InputDate
					{...args}
					selected={startDate}
					setSelected={setStartDate}
					startDate={startDate}
					endDate={endDate}
					dateFormat="dd MMMM yyyy"
					customInput={<ButtonInput />}
				></InputDate>
			</div>
			<span className="font-medium text-gray-500">To</span>
			<div className="relative w-40">
				<InputDate
					{...args}
					selected={endDate}
					setSelected={setEndDate}
					startDate={startDate}
					endDate={endDate}
					dateFormat="dd MMMM yyyy"
					customInput={<ButtonInput />}
				></InputDate>
			</div>
		</div>
	)
}

const ExampleCustomTimeInput = ({ value, onChange }) => (
	<input
		value={value}
		onChange={(e) => onChange(e.target.value)}
		className="1px rounded-lg border border-solid"
	/>
)

export const Default = Template.bind({})
Default.args = {
	leftChevronIcon: "chevron-left",
	rightChevronIcon: "chevron-right",
	closeOnScroll: false,
	monthsShown: 1,
	showTimeSelect: false,
	showTimeInput: false,
	customTimeInput: { ExampleCustomTimeInput },
	withPortal: false,
	disabled: false,
	showWeekNumbers: false,
	shouldCloseOnSelect: false,
	showFullMonthYearPicker: false,
	calendarStartDay: 1,
	yearItemNumber: 6,
}

export const InputDateMultipleMonthsShowed = Template.bind({})
InputDateMultipleMonthsShowed.args = {
	leftChevronIcon: "chevron-left",
	rightChevronIcon: "chevron-right",
	closeOnScroll: false,
	monthsShown: 2,
	showTimeSelect: false,
	showTimeInput: false,
	customTimeInput: { ExampleCustomTimeInput },
	withPortal: false,
	disabled: false,
	showWeekNumbers: false,
	shouldCloseOnSelect: false,
	showFullMonthYearPicker: false,
	calendarStartDay: 1,
	yearItemNumber: 6,
}

export const InputDateWithSelectTime = Template.bind({})
InputDateWithSelectTime.args = {
	leftChevronIcon: "chevron-left",
	rightChevronIcon: "chevron-right",
	closeOnScroll: false,
	monthsShown: 1,
	showTimeSelect: true,
	showTimeInput: false,
	customTimeInput: { ExampleCustomTimeInput },
	withPortal: false,
	disabled: false,
	showWeekNumbers: false,
	shouldCloseOnSelect: false,
	showFullMonthYearPicker: false,
	calendarStartDay: 1,
}

export const InputDateWithInputTime = Template.bind({})
InputDateWithInputTime.args = {
	leftChevronIcon: "chevron-left",
	rightChevronIcon: "chevron-right",
	closeOnScroll: false,
	monthsShown: 1,
	showTimeSelect: false,
	showTimeInput: true,
	customTimeInput: { ExampleCustomTimeInput },
	withPortal: false,
	disabled: false,
	showWeekNumbers: false,
	shouldCloseOnSelect: false,
	showFullMonthYearPicker: false,
	calendarStartDay: 1,
	yearItemNumber: 10,
}

// eslint-disable-next-line
export default {
	title: "Form elements/Input Range Date",
	parameters: {
		componentSource: {
			code: InputRangeDateCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		  Description:
		  Input Date component is a component that allows you to create a date input with a label.
		`,
			},
		},
	},
	argTypes: {
		leftChevronIcon: {
			control: "text",
			description: "Left chevron icon",
			table: {
				defaultValue: { summary: "chevron-left" },
			},
		},
		rightChevronIcon: {
			control: "text",
			description: "Right chevron icon",
			table: {
				defaultValue: { summary: "chevron-right" },
			},
		},
		closeOnScroll: {
			control: "boolean",
			description: "Close on scroll",
			table: {
				defaultValue: { summary: false },
			},
		},
		monthsShown: {
			control: "number",
			description: "Number of months showed",
			table: {
				defaultValue: { summary: 1 },
			},
		},
		showTimeSelect: {
			control: "boolean",
			description: "Show time select",
			table: {
				defaultValue: { summary: false },
			},
		},
		showTimeInput: {
			control: "boolean",
			description: "Show time input",
			table: {
				defaultValue: { summary: false },
			},
		},
		customTimeInput: {
			control: "object",
			description: "Custom time input",
			table: {
				defaultValue: { summary: "" },
			},
		},
		withPortal: {
			control: "boolean",
			description: "With portal",
			table: {
				defaultValue: { summary: false },
			},
		},
		disabled: {
			control: "boolean",
			description: "Disabled",
			table: {
				defaultValue: { summary: false },
			},
		},
		showWeekNumbers: {
			control: "boolean",
			description: "Show week numbers",
			table: {
				defaultValue: { summary: false },
			},
		},
		shouldCloseOnSelect: {
			control: "boolean",
			description: "Should close on select",
			table: {
				defaultValue: { summary: false },
			},
		},
		showFullMonthYearPicker: {
			control: "boolean",
			description: "Show full month year picker",
			table: {
				defaultValue: { summary: false },
			},
		},
		calendarStartDay: {
			control: "number",
			description: "Calendar start day",
			table: {
				defaultValue: { summary: 1 },
			},
		},
		yearItemNumber: {
			control: "number",
			description: "Year item number",
			table: {
				defaultValue: { summary: 6 },
			},
		},
	},
}
