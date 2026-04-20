import React from "react"
import { Accordion } from "./Accordion"
import AccordionCode from "!!raw-loader!./Accordion"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line
export default {
	title: "Components/Accordion",
	component: Accordion,
	parameters: {
		componentSource: {
			code: AccordionCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
	Description :
		Accordion component for creating collapsible sections.`,
			},
		},
	},
}

const accordionContent = [
	{
		id: "1",
		button: <span>Element 1</span>,
		panel: (
			<p>
				Faire preuve de professionnalisme et de respect des collègues et des parties
				prenantes, en agissant en toute conscience, conformément aux
				référentiels/procédures internes et externes et en adoptant des attitudes
				bienveillantes et impartiales.
			</p>
		),
	},
	{
		id: "2",
		button: <span>Element 2</span>,
		panel: (
			<p>
				Faire preuve de professionnalisme et de respect des collègues et des parties
				prenantes, en agissant en toute conscience, conformément aux
				référentiels/procédures internes et externes et en adoptant des attitudes
				bienveillantes et impartiales.
			</p>
		),
	},
	{
		id: "3",
		button: <span>Element 3</span>,
		panel: (
			<p>
				Faire preuve de professionnalisme et de respect des collègues et des parties
				prenantes, en agissant en toute conscience, conformément aux
				référentiels/procédures internes et externes et en adoptant des attitudes
				bienveillantes et impartiales.
			</p>
		),
	},
]

const Template = (args) => <Accordion {...args} />

export const AccordionStories = Template.bind({})

AccordionStories.argTypes = {
	variant: {
		value: "default",
		control: "select",
		options: ["default", "no_icon", "paragraph_accordion"],
		description: "Accordion variant to use",
	},
	onlyOneOpen: {
		value: false,
		control: "boolean",
		description: "Only one accordion can be open at a time",
	},
	nodes: {
		control: "object",
		description: "Accordion nodes to render",
	},
}

AccordionStories.args = {
	variant: "default",
	onlyOneOpen: false,
	nodes: accordionContent,
}
