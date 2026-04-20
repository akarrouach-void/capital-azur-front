import { format } from "date-fns"
import { forwardRef } from "react"
import DatePicker from "react-datepicker"

import { Icon, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { inputRangeDate } from "./theme"

import "react-datepicker/dist/react-datepicker.css"

export const InputRangeDate = ({
	selected,
	setSelected,
	startDate,
	endDate,
	leftChevronIcon,
	rightChevronIcon,
	variant = "default",
}) => {
	return (
		<DatePicker
			selected={selected}
			onChange={(date) => setSelected(date)}
			selectsStart
			startDate={startDate}
			endDate={endDate}
			nextMonthButtonLabel=">"
			previousMonthButtonLabel="<"
			popperClassName="react-datepicker-left"
			customInput={<ButtonInput />}
			renderCustomHeader={({
				date,
				decreaseMonth,
				increaseMonth,
				prevMonthButtonDisabled,
				nextMonthButtonDisabled,
			}) => (
				<div className={vclsx(inputRangeDate[variant].wrapper)}>
					<Button
						variant="chevronIconInputDate"
						onClick={decreaseMonth}
						disabled={prevMonthButtonDisabled}
						type="button"
						className={`
							${prevMonthButtonDisabled && `${inputRangeDate[variant].previousMonthButton.disabled}`}
							${inputRangeDate[variant].previousMonthButton.wrapper}
					`}
					>
						<Icon id={leftChevronIcon} className="block h-4 w-4" aria-hidden="true" />
					</Button>
					<span className={inputRangeDate[variant].titleDate}>
						{format(date, "MMMM yyyy")}
					</span>

					<Button
						variant="chevronIconInputDate"
						onClick={increaseMonth}
						disabled={nextMonthButtonDisabled}
						type="button"
						className={`
                                            ${
																							nextMonthButtonDisabled &&
																							`${inputRangeDate[variant].nextMonthButton.disabled}`
																						}
                        ${inputRangeDate[variant].previousMonthButton.wrapper}
                                        `}
					>
						<Icon id={rightChevronIcon} className="block h-4 w-4" aria-hidden="true" />
					</Button>
				</div>
			)}
		/>
	)
}

const ButtonInput = forwardRef(({ value, onClick }, ref) => (
	<Button
		variant="inputDate"
		onClick={onClick}
		ref={ref}
		className="inline-flex w-full justify-start rounded bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 "
	>
		{format(new Date(value), "dd MMMM yyyy")}
	</Button>
))
