import React from "react"
import { Layer } from "./Layer"
import LayerCode from "!!raw-loader!./Layer"
import { Button } from "../button/Button"

const Template = (args) => {
	const [showLayer, setShowLayer] = React.useState(false)
	return (
		<div className="relative flex h-screen items-center justify-center">
			<Button
				variant={showLayer ? "primary" : "secondary"}
				onClick={() => setShowLayer(!showLayer)}
			>
				{showLayer ? "Cacher le layer" : "Afficher le layer"}
			</Button>
			<Layer
				isShow={showLayer}
				overlayBackground="bg-black"
				overlayOpacity="bg-opacity-70"
				onEsc={() => setShowLayer(false)}
				onClose={() => setShowLayer(false)}
				onCloseCallback={() => {
					//console.log("this get executed after the unmount of the layer")
				}}
				isShowing={showLayer}
				{...args}
			>
				<div className="z-50 w-96 bg-white px-6 py-12 shadow shadow-black">
					This is the layer injected on App.js
				</div>
			</Layer>
		</div>
	)
}

export const ModalStories = Template.bind({})

ModalStories.argTypes = {
	position: {
		control: "select",
		description: "Position of the layer",
		options: [
			"top-left",
			"bottom-left",
			"top-right",
			"bottom-right",
			"top-center",
			"bottom-center",
		],
		table: {
			defaultValue: { summary: "bottom-left" },
		},
	},
	modal: {
		control: "boolean",
		description: "Modal layer",
		table: {
			defaultValue: { summary: false },
		},
	},
	overlay: {
		control: "boolean",
		description: "Overlay layer",
		table: {
			defaultValue: { summary: true },
		},
	},
}

ModalStories.parameters = {
	layout: "fullscreen",
}

// eslint-disable-next-line
export default {
	title: "Components/Layer",
	args: {
		position: "bottom-left",
		modal: false,
		overlay: true,
	},
	parameters: {
		componentSource: {
			code: LayerCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
		Description :
		Layer component for creating a layer on top of the page.
		`,
			},
		},
	},
}
