import { Badge } from "./Badge"

const Template = (args) => {
	return (
		<div className="relative px-10 py-5">
			<Badge {...args} />
		</div>
	)
}

export const BadgeStories = Template.bind({})

BadgeStories.argTypes = {
	variant: {
		control: "select",
		options: ["default", "ribbon", "inline"],
		description: "Change the variant of the badge",
		table: {
			defaultValue: { summary: "default" },
		},
	},
	text: {
		control: "text",
		description: "The content of the badge",
		table: {
			defaultValue: { summary: "Badge value" },
		},
	},

	icon: {
		control: "text",
		description: "The icon to display on the badge (should be a valid icon id)",
		table: {
			defaultValue: { summary: "check-circle-solid" },
		},
	},

	size: {
		control: "select",
		options: ["xsmall", "small", "normal"],
		description: "Change the size of the badge",
		table: {
			defaultValue: { summary: "xsmall" },
		},
	},
	href: {
		control: "text",
		description: "The url to link the badge",
		table: {
			defaultValue: { summary: null },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "primitives/Badge",
	args: {
		variant: "default",
		text: "Badge value",
		icon: "check-circle-solid",
		size: "xsmall",
		href: null,
	},
	parameters: {
		docs: {
			description: {
				component: `
				Description :
				Badge component for displaying icons or text with optional links and styling.
				`,
			},
		},
	},
}
