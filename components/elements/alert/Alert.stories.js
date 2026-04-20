import { Alert } from "./Alert"
import AlertCode from "!!raw-loader!./Alert"

const Template = (args) => {
	return (
		<div className="h-24">
			<Alert {...args}></Alert>
		</div>
	)
}

export const AlertStories = Template.bind({})

AlertStories.args = {
	children: <p>This the alert text that could be displayed.</p>,
	icon: "check",
}

AlertStories.argTypes = {
	variant: {
		control: "select",
		options: ["info", "danger", "success", "warning"],
		description: "Change the variant of the alert",
		table: {
			defaultValue: { summary: "info" },
		},
	},
	wrapper: {
		control: "select",
		options: ["full", "contained"],
		description: "Change the variant of the alert",
		table: {
			defaultValue: { summary: "full" },
		},
	},
	shouldClose: {
		control: "boolean",
		description: "Should the alert be closable",
		table: {
			defaultValue: { summary: false },
		},
	},
	className: {
		control: "text",
		description: "Add Taitailwind css classes to apply to the alert wrapper",
		table: {
			defaultValue: { summary: "" },
		},
	},
	icon: {
		control: "text",
		description: "The icon to display on the alert (should be a valid icon id)",
		table: {
			defaultValue: { summary: "check" },
		},
	},
	children: {
		control: "text",
		description: "The content of the alert",
		table: {
			defaultValue: { summary: "This the alert text that could be displayed" },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Primitives/Alert",
	component: Alert,
	args: {
		variant: "info",
		wrapper: "full",
		shouldClose: false,
		icon: "check",
		children: <p>This the alert text that could be displayed.</p>,
		className: "",
	},
	parameters: {
		componentSource: {
			code: AlertCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
	Description :
			Alert component for displaying messages or notifications with optional icons and close functionality.`,
			},
		},
	},
}
