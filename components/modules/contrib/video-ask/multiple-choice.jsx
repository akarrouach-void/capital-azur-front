import { useState } from "react"
import { Button, Checkboxes } from "@/ui"

export const MultipleChoice = ({ response, setScreen, id, extra_button, steps }) => {
	const [answer, setAnswer] = useState(steps?.[id] || [])
	const { answers } = response
	const options = answers?.map((item) => ({
		value: item?.id,
		label: item?.label,
	}))

	const handleCheckboxChange = (e) => {
		const { checked, value } = e.target
		if (checked) {
			setAnswer((old) => [...old, value])
		} else {
			setAnswer((old) => {
				return old.filter((item) => item !== value)
			})
		}
	}

	return (
		<div>
			<Checkboxes
				checkboxesData={options}
				checked={answer}
				setChecked={handleCheckboxChange}
			/>

			{extra_button.goto && extra_button.label && (
				<div className="py-4 text-center">
					<Button onClick={() => setScreen(extra_button.goto, { [id]: [...answer] })}>
						{extra_button.label}
					</Button>
				</div>
			)}
		</div>
	)
}
