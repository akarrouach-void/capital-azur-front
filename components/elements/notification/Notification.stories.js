import React, { useState } from "react"
import { Notification } from "./Notification"
import NotificationCode from "!!raw-loader!./Notification"
import { PlaceholderSections } from "@vactorynext/core/storybook-client"
import { Button } from "../button/Button"

const Template = (args) => {
	const [notificationVisible, setNotificationVisible] = useState(false)
	return (
		<div className="relative">
			<Button
				className="fixed bottom-5 left-5 z-[99] w-40"
				variant="secondary"
				onClick={() => setNotificationVisible(!notificationVisible)}
			>
				{notificationVisible ? "Hide notification" : "Show Notification"}
			</Button>
			<PlaceholderSections />
			<Notification {...args} isVisible={notificationVisible} />
		</div>
	)
}

export const NotificationStories = Template.bind({})

NotificationStories.argTypes = {
	shouldDisappear: {
		control: "boolean",
		description: "Should the notification disappear after a certain time",
		table: {
			defaultValue: { summary: true },
		},
	},
	disappearAfter: {
		control: "number",
		description: "Time before the notification disappear",
		table: {
			defaultValue: { summary: 2000 },
		},
	},
}

// eslint-disable-next-line
export default {
	title: "Components/Notifications",
	args: {
		shouldDisappear: true,
		disappearAfter: 2000,
	},
	parameters: {
		componentSource: {
			code: NotificationCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: `
				Description :
				Notification component for displaying a notification.
				`,
			},
		},
	},
}
