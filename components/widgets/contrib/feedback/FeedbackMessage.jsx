import React from "react"

import { useI18n } from "@vactorynext/core/hooks"
import { Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const FeedbackMessage = ({
	question,
	submitText,
	predefinedAnswers,
	response,
	onSubmit = () => {},
}) => {
	const { t } = useI18n()
	const [submitted, setSubmitted] = React.useState(false)
	const ref = React.useRef()

	if (submitted) return <p>{response}</p>

	return (
		<div className="flex flex-col items-start gap-1">
			<p>{question}</p>
			{predefinedAnswers ? (
				<ul className="max-w-xs space-y-5">
					{predefinedAnswers?.map((answer, i) => (
						<li key={i + answer}>
							<AnswerOption
								value={answer}
								text={answer}
								onChange={() => {
									ref.current.value = answer
								}}
							/>
						</li>
					))}
				</ul>
			) : (
				<textarea
					placeholder="Donnez votre avis"
					className="max-w-xs resize-none rounded-xl border-gray-400 text-gray-600 placeholder-gray-400"
					rows="4"
					ref={ref}
				/>
			)}
			<Button
				outline
				icon={null}
				onClick={() => {
					if (!ref.current.value) return
					onSubmit(ref.current.value)
					setSubmitted(true)
				}}
			>
				{t(submitText || "Nx:Envoyer")}
			</Button>
		</div>
	)
}

const AnswerOption = ({ text, value, onChange }) => {
	return (
		<label
			className={vclsx(
				"flex items-center gap-3 px-3 py-2",
				"cursor-pointer rounded-full border",
				"border-true-400 hover:border-primary"
			)}
			htmlFor={value}
		>
			<input
				name={value}
				id={value}
				onChange={onChange}
				value={value}
				type="radio"
				className={vclsx("text-primary ring-0 ring-offset-0")}
			/>
			<span className="text-sm font-bold">{text}</span>
		</label>
	)
}
