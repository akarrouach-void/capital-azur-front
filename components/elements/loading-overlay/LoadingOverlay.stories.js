import React from "react"
import { LoadingOverlay } from "./LoadingOverlay"
import LoadingOverlayCode from "!!raw-loader!./LoadingOverlay"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Components/LoadingOverlay",
	component: LoadingOverlay,
	parameters: {
		componentSource: {
			code: LoadingOverlayCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		  Description:
		  LoadingOverlay component is a component that allows you to create a LoadingOverlay with a label.
		`,
			},
		},
	},
	args: {
		active: true,
		text: "Chargement du contenu ...",
		spinner: true,
		loader: false,
		pulse: false,
	},
	argTypes: {
		active: {
			control: "boolean",
			description: "Active state of the overlay",
			table: {
				defaultValue: { summary: true },
			},
		},
		background: {
			control: "color",
			description: "Background color of the overlay",
			table: {
				defaultValue: { summary: "rgba(255, 255, 255, 0.5)" },
			},
		},
		text: {
			control: "text",
			description: "Text to display",
			table: {
				defaultValue: { summary: "Chargement du contenu ..." },
			},
		},
		spinner: {
			control: "boolean",
			description: "Display spinner or not",
			table: {
				defaultValue: { summary: true },
			},
		},
		loader: {
			control: "boolean",
			description: "Display loader or not",
			table: {
				defaultValue: { summary: false },
			},
		},
		pulse: {
			control: "boolean",
			description: "Display pulse or not",
			table: {
				defaultValue: { summary: false },
			},
		},
	},
}

// Define a single Template for all stories to use, passing along args.
const Template = (args) => <LoadingOverlay {...args} />

export const Default = Template.bind({})

export const DotsLoader = Template.bind({})
DotsLoader.args = {
	...Default.args,
	spinner: false,
	loader: true,
}

export const PulseLoader = Template.bind({})
PulseLoader.args = {
	...Default.args,
	spinner: false,
	pulse: true,
}
