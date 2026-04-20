import React from "react"
import { InputRadio } from "./InputRadio"
import InputRadioCode from "!!raw-loader!./InputRadio"

const cities = [
	{ label: "Casablanca", id: "casablanca", value: "casablanca" },
	{ label: "Settat", id: "settat", value: "settat" },
	{ label: "Bouznika", id: "bouznika", value: "bouznika" },
]

export const Default = () => {
	const a = React.useRef()
	const [selectedCity, setSelectedCity] = React.useState(cities[0])
	return (
		<div className="container">
			<InputRadio
				name="city"
				ref={a} //this where you could access to the selected value after you finish the form filling
				options={cities}
				selected={selectedCity}
				setSelected={setSelectedCity}
				//onChange={handleRadioInputChanges} => this gives the updated input value
			/>
		</div>
	)
}

// eslint-disable-next-line
export default {
	title: "Form elements/input Radio",
	component: InputRadio,
	parameters: {
		componentSource: {
			code: InputRadioCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		  Description:
		  inputRadio component is a component that allows you to create a inputRadio with a label.
		`,
			},
		},
	},
}
