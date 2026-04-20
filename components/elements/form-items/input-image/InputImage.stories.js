import { InputImage } from "./InputImage"
import InputImageCode from "!!raw-loader!./InputImage"

const Template = () => (
	<div className="container">
		<InputImage />
	</div>
)

export const InputImageStories = Template.bind({})

// eslint-disable-next-line
export default {
	title: "Form elements/inputImage",
	parameters: {
		componentSource: {
			code: InputImageCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		  Description:
		  inputImage component is a component that allows you to create a inputImage with a label.
		`,
			},
		},
	},
}
