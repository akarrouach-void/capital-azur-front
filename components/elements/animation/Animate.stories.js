import { Animate } from "./Animate"
import AnimateCode from "!!raw-loader!./Animate"
import { fakeContent1, fakeContent2 } from "./mockdata"

/* FAKE VARIANTS */
const Fade_Default = (args) => {
	return <Animate {...args}>{fakeContent1}</Animate>
}

const Fade_Up = (args) => {
	return <Animate {...args}>{fakeContent2}</Animate>
}
const Fade_Down = () => {
	return (
		<Animate animationType="fade" direction="down">
			{fakeContent1}
		</Animate>
	)
}
const Fade_Left = () => {
	return (
		<Animate animationType="fade" direction="left">
			{fakeContent1}
		</Animate>
	)
}
const Fade_Right = () => {
	return (
		<Animate animationType="fade" direction="right">
			{fakeContent1}
		</Animate>
	)
}
const Fade_Cascade = () => {
	return (
		<Animate animationType="fade" direction="left" cascade={true} damping={0.2}>
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
		</Animate>
	)
}

/* ZOOM VARIANTS */
const Zoom_Default = () => {
	return <Animate animationType="zoom">{fakeContent1}</Animate>
}
const Zoom_Cascade = () => {
	return (
		<Animate animationType="zoom" cascade={true} damping={0.2}>
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
			{fakeContent2}
		</Animate>
	)
}

export const FadeDefault = Fade_Default.bind({})
export const FadeToUp = Fade_Up.bind({})
export const FadeToDown = Fade_Down.bind({})
export const FadeFromLeft = Fade_Left.bind({})
export const FadeFromRight = Fade_Right.bind({})
export const FadeCascade = Fade_Cascade.bind({})
export const ZoomDefault = Zoom_Default.bind({})
export const ZoomCascade = Zoom_Cascade.bind({})

// eslint-disable-next-line
export default {
	title: "Components/Animate",
	component: Animate,
	args: {
		direction: "up",
		animationType: "fade",
		triggerOnce: false,
		cascade: false,
		duration: 1000,
		delay: 0,
		damping: 0.3,
		className: "",
	},

	parameters: {
		componentSource: {
			code: AnimateCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
	Description :
			Animate component for applying entrance animations to child elements.`,
			},
		},
	},
	argTypes: {
		direction: {
			control: "select",
			options: ["up", "down", "left", "right"],
			description: "Direction of animation",
			table: {
				defaultValue: { summary: "up" },
			},
		},
		animationType: {
			control: "select",
			options: ["fade", "zoom"],
			description: "Type of animation",
			table: {
				defaultValue: { summary: "fade" },
			},
		},
		triggerOnce: {
			control: "boolean",
			description: "Trigger animation only once",
			table: {
				defaultValue: { summary: false },
			},
		},
		cascade: {
			control: "boolean",
			description: "Cascade animation",
			table: {
				defaultValue: { summary: false },
			},
		},
		duration: {
			control: "number",
			min: 0,
			max: 5000,
			step: 100,
			description: "Duration of animation",
			table: {
				defaultValue: { summary: 1000 },
			},
		},
		delay: {
			control: "number",
			min: 0,
			max: 5000,
			step: 100,
			description: "Delay of animation",
			table: {
				defaultValue: { summary: 0 },
			},
		},
		damping: {
			control: "number",
			min: 0,
			max: 1,
			step: 0.1,
			description: "Damping of animation",
			table: {
				defaultValue: { summary: 0.3 },
			},
		},
		className: {
			control: "text",
			description: "Class name of animation container",
			table: {
				defaultValue: { summary: "" },
			},
		},
	},
}
