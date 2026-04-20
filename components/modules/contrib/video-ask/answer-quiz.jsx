import { useState } from "react"
import { Button, Icon } from "@/ui"

export const AnswerQuiz = ({ response, setScreen, id, steps }) => {
	const [answer] = useState(steps?.[id] || null)

	return (
		<div>
			{response?.map((item, index) => {
				return (
					<div key={index} className="text-center">
						<p className="mb-4">{item?.question}</p>
						<div className="grid grid-cols-2 items-center justify-center gap-4">
							{item?.answers?.map((ans) => {
								return (
									<Button
										key={ans?.id}
										onClick={() => setScreen(ans?.goto, { [id]: [ans?.id] })}
										className="justify-between"
										outline={ans?.id.includes(answer)}
										//href={}
									>
										<span>{ans?.label}</span>
										<Icon id="arrow-narrow-right" width="30" height="30" />
									</Button>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}
