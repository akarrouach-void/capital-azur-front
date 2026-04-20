import { forwardRef, Fragment } from "react"

import {
	Transition,
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from "@headlessui/react"
import { Icon, Wysiwyg } from "@/ui"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

import { select } from "./theme"

export const Select = forwardRef(
	(
		{
			list,
			selected,
			setSelected,
			variant = "default",
			label,
			labelDisplay = "default",
			className,
			description,
			hasError,
			errorMessage,
			disabled,
			name,
			...rest
		},
		ref
	) => {
		const { t } = useTranslation()
		const selectedContent = (value) => {
			const active = list.find((item) => item.value == value)
			return active?.content || list[0].content
		}

		const handleChange = (value) => {
			setSelected(value)
		}

		return (
			<div
				className={vclsx(
					select[variant]?.groupField,
					["after", "inline"].indexOf(labelDisplay) > -1 && "flex flex-wrap",
					labelDisplay == "inline" && "md:items-center"
				)}
			>
				{label && labelDisplay !== "none" && (
					<label
						className={vclsx(
							select[variant]?.label,
							labelDisplay == "invisible" && "sr-only",
							labelDisplay == "inline" &&
								"shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
							labelDisplay == "after" && "order-2 mt-4"
						)}
						htmlFor={name}
					>
						{label}
					</label>
				)}
				<Listbox ref={ref} value={selected ?? null} onChange={handleChange} {...rest}>
					<div
						className={vclsx(
							select[variant]?.wrapper,
							labelDisplay == "inline" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
							labelDisplay == "after" && "order-1"
						)}
					>
						<ListboxButton
							className={vclsx(
								select[variant]?.button.base,
								hasError,
								className,
								disabled && "pointer-events-none cursor-not-allowed bg-gray-50"
							)}
							name={name}
							id={name}
							data-testid={`select-field-${name}`}
						>
							<div className="overflow-hidden">
								<p className="truncate">
									{selected === undefined || selected === null
										? t("Nx:Choose an option")
										: selectedContent(selected)}
								</p>
							</div>
							<Icon
								id={select[variant]?.button.icon.id}
								className={select[variant]?.button.icon.className}
								width={select[variant]?.button.icon.width}
								height={select[variant]?.button.icon.height}
							/>
						</ListboxButton>
						{hasError && (
							<span className="mt-1 inline-block text-xs text-error-500">
								{errorMessage}
							</span>
						)}
						{description && (
							<Wysiwyg className={select[variant].description} html={description} />
						)}
						<Transition as={Fragment} {...select[variant]?.animation}>
							<ListboxOptions className={select[variant]?.options.wrapper}>
								{list.map((list) => (
									<ListboxOption
										key={list?.value}
										className={({ focus }) =>
											vclsx(
												select[variant]?.options.base,
												focus || selected === list.value
													? select[variant]?.options.active
													: select[variant]?.options.inactive
											)
										}
										value={list?.value}
									>
										{({ selected }) => (
											<>
												{list.content}
												{select[variant]?.options.icon.id && (
													<>
														{selected ? (
															<Icon
																id={select[variant]?.options.icon.id}
																width={select[variant]?.options.icon.width}
																height={select[variant]?.options.icon.height}
																className={select[variant]?.options.icon.className}
															/>
														) : null}
													</>
												)}
											</>
										)}
									</ListboxOption>
								))}
							</ListboxOptions>
						</Transition>
					</div>
				</Listbox>
			</div>
		)
	}
)
