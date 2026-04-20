import React from "react"
import { SingleActionModal } from "./SingleAction"
import SingleActionModalCode from "!!raw-loader!./SingleAction"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line
export default {
	title: "Components/Modal",
	component: SingleActionModal,
	args: {
		variant: "default",
		isOpen: true,
		actionLabel: "Accepter",
	},
	parameters: {
		componentSource: {
			code: SingleActionModalCode,
			language: "javascript",
		},
	},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
	return (
		<SingleActionModal
			isOpen={true}
			body={
				<div className="text-center">
					<h4 className="mb-3 text-3xl font-bold">{"Les cookies Google Analytics"}</h4>
					<p>
						{"Nous utilisons des cookies de Google Analytics, ces cookies nous aident à identifier " +
							"le contenu qui vous interesse le plus ainsi qu'à repérer certains dysfonctionnements. " +
							"Vos données de navigations sur ce site sont envoyées à Google Inc"}
					</p>
				</div>
			}
			{...args}
		></SingleActionModal>
	)
}

export const SingleActionModalDefault = Template.bind({})
SingleActionModalDefault.argTypes = {
	variant: {
		control: "select",
		description: "Change the variant of the breadcrumb component",
		options: ["default", ""],
		table: {
			defaultValue: { summary: "default" },
		},
	},
	isOpen: {
		control: "boolean",
		description: "Open the modal or not",
		table: {
			defaultValue: { summary: true },
		},
	},
	actionLabel: {
		control: "text",
		description: "Action label of the modal",
		table: {
			defaultValue: { summary: "Accepter" },
		},
	},
}
