import React from "react"
// import { PlaceholderSections } from "@/storybook"
import { Toggle } from "./Toggle"
import ToggleCode from "!!raw-loader!./Toggle"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export const Default = () => {
	return (
		<div className="relative">
			{/* <PlaceholderSections /> */}
			<Toggle />
		</div>
	)
}

// eslint-disable-next-line
export default {
	title: "Form elements/Toggle",
	parameters: {
		componentSource: {
			code: ToggleCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description :
				Toggle component for quickly scrolling to the top of the page.
				`,
			},
		},
	},
	args: {
		variant: "default",
		className: "",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default"],
			description: "Variant of the toggle",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		className: {
			control: "text",
			description: "Class name of input field",
			table: {
				defaultValue: { summary: "" },
			},
		},
	},
}
