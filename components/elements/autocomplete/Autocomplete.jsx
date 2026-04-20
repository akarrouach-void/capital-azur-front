import { Fragment, useState } from "react"

import {
	Transition,
	Combobox,
	ComboboxInput,
	ComboboxButton,
	ComboboxOptions,
	ComboboxOption,
} from "@headlessui/react"
import { filteredListHelper, vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { autocomplete } from "./theme"

export const Autocomplete = ({
	label,
	hasError = true,
	errorMessage = "dmjdljkd",
	list,
	selected,
	setSelected,
	variant = "default",
	iconCheked,
	name,
}) => {
	const [query, setQuery] = useState("")
	const [localySelectedOption, setLocalySelectedOption] = useState(() => {
		if (selected) {
			const selectedItem = list.find((item) => {
				return item.value == selected
			})
			const indexOfSelectedItem = list.indexOf(selectedItem)
			return list[indexOfSelectedItem]
		} else {
			return undefined
		}
	})

	const filteredList = filteredListHelper(query, list)

	const handleChange = (option) => {
		setLocalySelectedOption(option)
		setSelected(option.value)
	}
	return (
		<div className={vclsx(autocomplete[variant].wrapper)}>
			{label && (
				<label htmlFor={name} className={autocomplete[variant]?.label}>
					{label}
				</label>
			)}
			<Combobox value={localySelectedOption} onChange={handleChange}>
				<div
					className={vclsx(
						autocomplete[variant].comboboxTrigger.container,
						hasError && autocomplete[variant].comboboxTrigger.containerError
					)}
				>
					<ComboboxInput
						className={autocomplete[variant].comboboxTrigger.input}
						id={name}
						name={name}
						displayValue={(person) => person?.content}
						placeholder={localySelectedOption || "Selectionner"}
						onChange={(event) => setQuery(event.target.value)}
					/>
					<ComboboxButton className={autocomplete[variant].comboboxTrigger.button}>
						{iconCheked || <Icon id="chevron-down" width="12" height="12" />}
					</ComboboxButton>
				</div>
				{hasError && (
					<span className="mt-1 inline-block text-xs text-error-500">{errorMessage}</span>
				)}
				<Transition
					as={Fragment}
					leave={autocomplete[variant].comboboxOptions.transition.leave}
					leaveFrom={autocomplete[variant].comboboxOptions.transition.leaveFrom}
					leaveTo={autocomplete[variant].comboboxOptions.transition.leaveTo}
					afterLeave={() => setQuery("")}
				>
					<ComboboxOptions className={autocomplete[variant].comboboxOptions.container}>
						{filteredList.length === 0 && query !== "" ? (
							<div
								className={vclsx(autocomplete[variant].comboboxOptions.option.default)}
							>
								<span>Nothing found.</span>
							</div>
						) : (
							filteredList.map((item) => (
								<ComboboxOption
									key={item.value}
									className={({ focus = true }) => {
										return vclsx(
											autocomplete[variant].comboboxOptions.option.default,
											focus
												? autocomplete[variant].comboboxOptions.option.state.active
												: autocomplete[variant].comboboxOptions.option.state.inactive
										)
									}}
									value={item}
								>
									{({ selected }) => (
										<>
											<span>{item.content}</span>
											{selected ? (
												<span
													className={
														autocomplete[variant].comboboxOptions.option.optionCheck
													}
												>
													<Icon id="check" width="12" height="12" />
												</span>
											) : null}
										</>
									)}
								</ComboboxOption>
							))
						)}
					</ComboboxOptions>
				</Transition>
			</Combobox>
		</div>
	)
}
