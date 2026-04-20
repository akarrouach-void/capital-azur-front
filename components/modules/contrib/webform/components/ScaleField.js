import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { useCheckConditions, toRegister } from "@vactorynext/core/webform"

export const ScaleField = ({ name, field }) => {
	const { label, attributes, validation, states } = field
	const { max = 5, min = 1, maxText = "", minText = "" } = attributes
	const { register, watch } = useFormContext()
	const { t } = useTranslation()
	const localState = useCheckConditions(states, watch)
	const values = watch({ nest: true })
	const [value, setValue] = useState(min)

	const handleScaleChange = (e) => {
		setValue(e)
		const syntheticEvent = {
			target: {
				name: name,
				value: e,
			},
		}
		onChange(syntheticEvent)
	}

	const localValidation =
		localState?.required !== undefined
			? { ...validation, required: localState.required }
			: { ...validation }

	const { onChange, ...registerFuncs } = register(
		name,
		toRegister(t("Nx:" + label), localValidation, values, t)
	)

	return (
		<div className="mb-4 flex w-full flex-col">
			<div className="flex w-full flex-col rounded-lg bg-[#fff5db] p-5">
				{label && (
					<label
						className="mb-2 text-[28px] font-semibold leading-[28px] -tracking-[1px] md:text-[32px] md:leading-[48px]"
						htmlFor={name}
					>
						{label}
					</label>
				)}
				<div className="flex w-full justify-between py-4">
					{[...Array(max).keys()].map((num) => {
						const valueScale = min + num
						return (
							<div
								key={num}
								rules={toRegister(t(label), localValidation, values, t)}
								name={name}
								id={name}
								{...registerFuncs}
								onClick={() => handleScaleChange(valueScale)}
								onKeyDown={(e) => e.key === "Enter" && handleScaleChange(valueScale)}
								role="button"
								tabIndex={0}
								className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-300 ${
									value === valueScale ? "bg-[#ff4500] text-white" : "bg-white text-black"
								}`}
							>
								<span>{valueScale}</span>
							</div>
						)
					})}
				</div>
				<div className="mt-4 flex w-full justify-between font-semibold">
					<span>{minText}</span>
					<span>{maxText}</span>
				</div>
			</div>
		</div>
	)
}
