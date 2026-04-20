import { Fragment } from "react"

import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
	Transition,
} from "@headlessui/react"
import { Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { theme } from "./theme"

const RemoveSelectedItems = ({ variant, removeOptions }) => {
	return (
		<button
			className={theme[variant].button.resetSelectButton.wrapper}
			onClick={(e) => {
				e.stopPropagation()
				removeOptions()
			}}
		>
			<Icon id="x" className={theme[variant].button.resetSelectButton.icon} />
		</button>
	)
}

const SelectedItemsCount = ({ variant, selectedOptions }) => {
	return (
		<p className={theme[variant].button.selectedOptionsCount}>
			<span>+</span>
			<span className="font-semibold">{selectedOptions.length}</span>
		</p>
	)
}

const SelectItem = ({ variant, selected, active, option }) => {
	return (
		<div
			className={vclsx(
				theme[variant].options.option.wrapper.default,
				active && theme[variant].options.option.wrapper.active
			)}
		>
			<span
				className={vclsx(
					theme[variant].options.option.checkbox.default,
					selected
						? theme[variant].options.option.checkbox.selected
						: theme[variant].options.option.checkbox.unselected
				)}
			>
				{selected && (
					<Icon id="check" className={theme[variant].options.option.checkbox.icon} />
				)}
			</span>
			<span className={theme[variant].options.option.optionText}>{option?.label}</span>
		</div>
	)
}

const SelectedItem = ({ variant, option, removeOption }) => {
	return (
		<div className={theme[variant].button.selectedOption.wrapper}>
			<span className={theme[variant].button.selectedOption.optionText}>
				{option?.label}
			</span>
			<button
				onClick={(e) => {
					e.stopPropagation()
					removeOption(option.value)
				}}
				className={theme[variant].button.selectedOption.deleteButton.wrapper}
			>
				<Icon id="x" className={theme[variant].button.selectedOption.deleteButton.icon} />
			</button>
		</div>
	)
}

const DefaultValue = ({ variant, defaultValue }) => {
	return (
		<div className={theme[variant].placeholder.wrapper}>
			<span className={theme[variant].placeholder.text}>{defaultValue}</span>
		</div>
	)
}

export const SelectMultiple = ({
	variant = "default",
	options,
	selected = [],
	setSelected,
	name = "",
	label = "",
	labelDisplay = "default",
	errorMessage,
	hasError,
	description,
	className = "",
	disabled,
}) => {
	selected = selected.filter((el) => el !== "" && el !== null)
	selected = selected.map((optionId) => Number.parseInt(optionId))
	const removeOption = (optionId) => {
		const reste = selected.filter((option) => {
			return option != optionId
		})
		setSelected(reste || [])
	}

	const removeOptions = () => {
		setSelected([])
	}

	const getOption = () => {
		const lastSelectedOption = selected[selected.length - 1]
		return options.find((option) => {
			return option.value === lastSelectedOption
		})
	}

	const handleSelectChange = (option) => {
		setSelected(option)
	}
	return (
		<div className={theme[variant].wrapper}>
			{label && labelDisplay !== "none" && (
				<label
					className={vclsx(
						labelDisplay == "invisible" && "sr-only",
						labelDisplay == "inline" && "shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
						labelDisplay == "after" && "order-2 mt-4"
					)}
					htmlFor={name}
				>
					{label}
				</label>
			)}
			<Listbox value={selected} onChange={handleSelectChange} multiple>
				<ListboxButton
					name={name}
					id={name}
					className={vclsx(
						theme[variant].button.wrapper,
						hasError,
						className,
						disabled && "pointer-events-none cursor-not-allowed bg-gray-50"
					)}
				>
					{selected.length > 0 ? (
						<div className="flex flex-grow items-center justify-between">
							<SelectedItem
								variant={variant}
								option={getOption()}
								removeOption={removeOption}
							/>
							<div className="flex items-center">
								<SelectedItemsCount variant={variant} selectedOptions={selected} />
								<RemoveSelectedItems variant={variant} removeOptions={removeOptions} />
							</div>
						</div>
					) : (
						<DefaultValue variant={variant} defaultValue={"Choose an option"} />
					)}
					<span className="pointer-events-none pl-2">
						<Icon id="chevron-down" className="h-5 w-5 text-gray-400" />
					</span>
				</ListboxButton>
				{hasError && (
					<span className="mt-1 inline-block text-xs text-error-500">{errorMessage}</span>
				)}
				{description && <Wysiwyg html={description} />}
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<ListboxOptions className={theme[variant].options.wrapper}>
						{options.map((option) => (
							<ListboxOption key={option.value} value={option.value}>
								{({ selected, focus }) => (
									<SelectItem
										variant={variant}
										selected={selected}
										active={focus}
										option={option}
									/>
								)}
							</ListboxOption>
						))}
					</ListboxOptions>
				</Transition>
			</Listbox>
		</div>
	)
}
