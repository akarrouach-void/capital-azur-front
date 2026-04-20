import React, { Fragment, useState, useDeferredValue } from "react"
import PropTypes from "prop-types"
import { useController } from "react-hook-form"

import {
	Transition,
	Combobox,
	ComboboxInput,
	ComboboxButton,
	ComboboxOptions,
	ComboboxOption,
} from "@headlessui/react"
import { useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import { fetchAutocomplete, vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { autocomplete } from "./theme"

export const AutocompleteApi = ({
	name = "autocomplete name",
	label,
	placeholder = "",
	control,
	hasError = false,
	errorMessage = "",
	endpoint,
	queryName,
	keyValue = "content", // The key to retreive the value.
	variant = "default",
	iconCheked,
	defaultValue,
	minLength = 1, // Minimum length of keywords for autocompletion.
	onChange, // Add onChange callback
	onKeyDown, // Add onKeyDown callback for form submission
	...props
}) => {
	const { field } = useController({
		name,
		defaultValue: defaultValue,
		control,
	})
	const fallbackFromQuery = { content: defaultValue, value: defaultValue }
	const [selected, setSelected] = useState(defaultValue || "")
	const [query, setQuery] = useState(defaultValue || "")
	const deferredQuery = useDeferredValue(query)
	const [list, setList] = useState([])
	const { t } = useI18n()
	const [localySelectedOption, setLocalySelectedOption] = useState(() => {
		if (selected !== undefined && list) {
			const selectedItem = list.find((item) => {
				return item.value == selected
			})
			const indexOfSelectedItem = list.indexOf(selectedItem)
			return indexOfSelectedItem >= 0 ? list[indexOfSelectedItem] : fallbackFromQuery
		} else {
			return undefined
		}
	})

	const handleChange = (option) => {
		setSelected(option[keyValue])
		setLocalySelectedOption(option)
		field.onChange(option[keyValue] ?? null)
		// Call external onChange if provided
		if (onChange) {
			onChange(option[keyValue] ?? null)
		}
	}

	useUpdateEffect(() => {
		fetchAutocomplete(deferredQuery, minLength, setList, endpoint, queryName)
	}, [deferredQuery])
	return (
		<div className={vclsx(autocomplete[variant].wrapper)}>
			{label && (
				<label htmlFor={name} className={autocomplete[variant].label}>
					{label}
				</label>
			)}
			<Combobox as="div" value={localySelectedOption} onChange={handleChange} name={name}>
				<div
					className={vclsx(
						autocomplete[variant].comboboxTrigger.container,
						hasError && autocomplete[variant].comboboxTrigger.containerError
					)}
				>
					<ComboboxInput
						className={autocomplete[variant].comboboxTrigger.input}
						displayValue={(person) => (person === undefined ? "" : person[keyValue])}
						placeholder={placeholder ?? label}
						onChange={(event) => {
							setQuery(event.target.value)
							// Call external onChange if provided
							if (onChange) {
								onChange(event.target.value)
							}
						}}
						onKeyDown={(event) => {
							// Allow Enter key to bubble up to form for submission
							if (event.key === "Enter" && onKeyDown) {
								onKeyDown(event)
							}
						}}
						{...props}
					/>
					<ComboboxButton className={autocomplete[variant].comboboxTrigger.button}>
						{iconCheked || (
							<Icon id="chevron-down" className="h-[10px] w-[10px] text-gray-500" />
						)}
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
						{list.length === 0 && query.length > minLength ? (
							<div
								className={vclsx(autocomplete[variant].comboboxOptions.option.default)}
							>
								<span>{t("Nx:Nothing found.")}</span>
							</div>
						) : (
							list.map((item) => (
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
											<span>{item[keyValue]}</span>
											{selected ? (
												<span
													className={
														autocomplete[variant].comboboxOptions.option.optionCheck
													}
												>
													<Icon id="check" width="15" height="15" />
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

AutocompleteApi.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	control: PropTypes.object,
	hasError: PropTypes.bool,
	errorMessage: PropTypes.string,
	endpoint: PropTypes.string.isRequired,
	queryName: PropTypes.string.isRequired,
	keyValue: PropTypes.string,
	variant: PropTypes.string,
	iconCheked: PropTypes.node,
	defaultValue: PropTypes.any,
	minLength: PropTypes.number,
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,
}
