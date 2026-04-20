import { format } from "date-fns"
import { useState } from "react"
import DatePicker from "react-datepicker"

import { Icon, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { inputDate } from "./theme"

import "react-datepicker/dist/react-datepicker.css"

// Custom header component for single month view
const RenderCustomHeaderOneMonth = ({
	date,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
	handleFormatDate,
	dateFormat,
	leftChevronIcon,
	rightChevronIcon,
	variant,
}) => (
	<div className={vclsx(inputDate[variant].wrapper)}>
		<Button
			variant="chevronIconInputDate"
			onClick={decreaseMonth}
			disabled={prevMonthButtonDisabled}
			type="button"
			className={vclsx(
				inputDate[variant].previousMonthButton.wrapper,
				prevMonthButtonDisabled && inputDate[variant].previousMonthButton.disabled
			)}
		>
			<Icon id={leftChevronIcon} className="block h-4 w-4" aria-hidden="true" />
		</Button>

		<Button
			variant="headerDate"
			className={inputDate[variant].titleDate}
			onClick={handleFormatDate}
		>
			{format(date, dateFormat)}
		</Button>

		<Button
			variant="chevronIconInputDate"
			onClick={increaseMonth}
			disabled={nextMonthButtonDisabled}
			className={vclsx(
				inputDate[variant].previousMonthButton.wrapper,
				nextMonthButtonDisabled && inputDate[variant].nextMonthButton.disabled
			)}
		>
			<Icon id={rightChevronIcon} className="block h-4 w-4" aria-hidden="true" />
		</Button>
	</div>
)

// Custom header component for two months view
const RenderCustomHeaderTwoMonths = ({
	monthDate,
	date,
	customHeaderCount,
	decreaseMonth,
	increaseMonth,
	handleFormatDate,
	dateFormat,
	showYearPicker,
	leftChevronIcon,
	rightChevronIcon,
	variant,
}) => (
	<div>
		<Button
			variant="chevronIconInputDate"
			aria-label="Previous Month"
			className={"react-datepicker__navigation react-datepicker__navigation--previous"}
			style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
			onClick={decreaseMonth}
		>
			<Icon id={leftChevronIcon} className="mt-6 block h-3 w-3 " aria-hidden="true" />
		</Button>
		<Button
			variant="headerDate"
			className={inputDate[variant].titleDate}
			onClick={handleFormatDate}
		>
			{showYearPicker ? format(date, dateFormat) : format(monthDate, dateFormat)}
		</Button>
		<Button
			variant="chevronIconInputDate"
			aria-label="Next Month"
			className={"react-datepicker__navigation react-datepicker__navigation--next"}
			style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
			onClick={increaseMonth}
		>
			<Icon id={rightChevronIcon} className="mt-6 block h-3 w-3" aria-hidden="true" />
		</Button>
	</div>
)

export const InputDate = ({
	selected,
	setSelected,
	startDate,
	endDate,
	leftChevronIcon,
	rightChevronIcon,
	variant = "default",
	//Configure & custom input
	closeOnScroll,
	customInput,
	popperClassName,
	popperPlacement,
	calendarClassName,
	showTimeSelect,
	selectsRange,
	isClearable,
	disabled,
	placeholderText,
	monthsShown,
	timeCaption,
	todayButton,
	previousMonthButtonLabel,
	nextMonthButtonLabel,
	showTimeInput,
	selectsStart,
	showWeekNumbers,
	showFullMonthYearPicker,
	shouldCloseOnSelect,
	withPortal,
	inline,
	calendarStartDay,
	yearItemNumber,
}) => {
	const [dateFormat, setDateFormat] = useState("MMMM d, yyyy")
	const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
	const [showYearPicker, setShowYearPicker] = useState(false)
	const handleFormatDate = () => {
		if (!showMonthYearPicker) {
			setShowMonthYearPicker(true)
			setDateFormat("MMMM yyyy")
		} else if (!showYearPicker) {
			setShowYearPicker(true)
			setDateFormat("MMMM yyyy")
		} else if (showMonthYearPicker && showYearPicker) {
			setShowMonthYearPicker(false)
			setShowYearPicker(false)
			setDateFormat("MMMM d, yyyy")
		}
	}

	return (
		<DatePicker
			selected={selected}
			onChange={(date) => setSelected(date)}
			selectsStart={selectsStart}
			selectsRange={selectsRange}
			showTimeInput={showTimeInput}
			startDate={startDate}
			endDate={endDate}
			nextMonthButtonLabel={nextMonthButtonLabel}
			previousMonthButtonLabel={previousMonthButtonLabel}
			popperClassName={popperClassName}
			popperPlacement={popperPlacement}
			closeOnScroll={closeOnScroll}
			calendarClassName={calendarClassName}
			calendarStartDay={calendarStartDay}
			showTimeSelect={showTimeSelect}
			isClearable={isClearable}
			disabled={disabled}
			placeholderText={placeholderText}
			timeCaption={timeCaption}
			dateFormat={dateFormat}
			monthsShown={monthsShown}
			showMonthYearPicker={showMonthYearPicker}
			showYearPicker={showYearPicker}
			showWeekNumbers={showWeekNumbers}
			todayButton={todayButton}
			shouldCloseOnSelect={shouldCloseOnSelect}
			customInput={customInput}
			withPortal={withPortal}
			showFullMonthYearPicker={showFullMonthYearPicker}
			showFourColumnMonthYearPicker={showFullMonthYearPicker}
			inline={inline}
			yearItemNumber={yearItemNumber}
			renderCustomHeader={
				monthsShown === 1
					? (props) => (
							<RenderCustomHeaderOneMonth
								{...props}
								handleFormatDate={handleFormatDate}
								dateFormat={dateFormat}
								leftChevronIcon={leftChevronIcon}
								rightChevronIcon={rightChevronIcon}
								variant={variant}
							/>
						)
					: (props) => (
							<RenderCustomHeaderTwoMonths
								{...props}
								handleFormatDate={handleFormatDate}
								dateFormat={dateFormat}
								showYearPicker={showYearPicker}
								leftChevronIcon={leftChevronIcon}
								rightChevronIcon={rightChevronIcon}
								variant={variant}
							/>
						)
			}
		/>
	)
}
