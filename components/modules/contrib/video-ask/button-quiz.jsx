import { Button } from "@/ui"

export const ButtonQuiz = ({ response, setScreen, id }) => {
	if (response?.label && response?.goto) {
		return (
			<div className="py-4 text-center">
				<Button onClick={() => setScreen(response.goto, { [id]: [response?.label] })}>
					{response.label}
				</Button>
			</div>
		)
	}
	return null
}
