import React from "react"
import { Button, Icon } from "@/ui"

export const FeedbackQuestion = ({ question, options = [], onSubmit = () => {} }) => {
	const [response, setResponse] = React.useState(null)

	if (response) return <p>{response}</p>

	return (
		<div className="flex items-center gap-5">
			<p>{question}</p>
			{options.map(({ icon, text, response, value }) => (
				<Button
					outline
					key={value}
					icon={null}
					onClick={() => {
						setResponse(response)
						onSubmit(value)
					}}
				>
					<Icon id={icon} className="h-5 w-5" />
					<span>{text}</span>
				</Button>
			))}
		</div>
	)
}
