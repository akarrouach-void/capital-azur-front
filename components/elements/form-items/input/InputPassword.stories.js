import { InputPassword } from "./InputPassword"
import InputPasswordCode from "!!raw-loader!./InputPassword"
import { FormProvider, useForm } from "react-hook-form"

const Template = () => {
	const methods = useForm()
	return (
		<div className="mx-auto flex max-w-lg items-center justify-center">
			<FormProvider {...methods}>
				<InputPassword name="password"></InputPassword>
			</FormProvider>
		</div>
	)
}

export const InputPasswordd = Template.bind({})

// eslint-disable-next-line
export default {
	title: "Form elements/Input Password",
	parameters: {
		componentSource: {
			code: InputPasswordCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		Description:
		Input password component.
	  `,
			},
		},
	},
}
