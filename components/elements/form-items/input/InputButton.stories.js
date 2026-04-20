import InputButton from "./InputButton"
import InputButtonCode from "!!raw-loader!./InputButton"
import { InputText } from "./Input.stories"
import { Icon } from "../../icon/Icon"

const Template = (args) => {
	const prefix = args.prefix === null ? null : <Icon id="user" className="h-5 w-5" />
	const sufix =
		args.sufix === null ? null : <Icon id="question-mark-circle" className="h-5 w-5" />
	return (
		<div className="mx-auto flex max-w-lg items-center justify-center">
			<InputButton
				buttonClasses={"truncate h-full"}
				{...args}
				prefix={prefix}
				sufix={sufix}
			></InputButton>
		</div>
	)
}

export const InputButtonStories = Template.bind({})

InputButtonStories.argTypes = {
	...InputText.argTypes,
	buttonContent: {
		defaultValue: "Search",
		control: { type: "text" },
	},
}

// eslint-disable-next-line
export default {
	title: "Form elements/Input Button",
	parameters: {
		componentSource: {
			code: InputButtonCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description:
				Input button component for search.
				`,
			},
		},
	},
}
