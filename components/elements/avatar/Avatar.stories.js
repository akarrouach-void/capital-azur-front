/* eslint-disable import/no-anonymous-default-export */
import React from "react"
import { Avatar } from "./Avatar"
import AvatarCode from "!!raw-loader!./Avatar"

const DEFAULT_AVATAR_IMAGE =
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

const DefaultTemplate = (args) => {
	return (
		<div className="flex items-center justify-center bg-white p-8">
			<div className="mx-auto flex w-full max-w-lg items-end justify-around">
				<Avatar size="small" {...args} />
				<Avatar
					{...args}
					size="normal"
					src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				/>
				<Avatar
					{...args}
					src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
					size="large"
				/>
				<Avatar
					{...args}
					size="xlarge"
					src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				/>
				<Avatar
					{...args}
					size="xxlarge"
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				/>
			</div>
		</div>
	)
}

export const Default = DefaultTemplate.bind({})

export const Placeholder = () => {
	return (
		<div className="flex items-center justify-center bg-white p-8">
			<div className="mx-auto flex w-full max-w-lg items-end justify-around">
				<Avatar variant="placeholder" size="small" />
				<Avatar variant="placeholder" size="normal" />
				<Avatar variant="placeholder" size="large" />
				<Avatar variant="placeholder" size="xlarge" />
				<Avatar variant="placeholder" size="xxlarge" />
			</div>
		</div>
	)
}

export const Initials = () => {
	return (
		<div className="flex items-center justify-center bg-white p-8">
			<div className="mx-auto flex w-full max-w-lg items-end justify-around">
				<Avatar variant="initials" size="small">
					TW
				</Avatar>
				<Avatar variant="initials" size="normal">
					TW
				</Avatar>
				<Avatar variant="initials" size="large">
					TW
				</Avatar>
				<Avatar variant="initials" size="xlarge">
					TW
				</Avatar>
				<Avatar variant="initials" size="xxlarge">
					TW
				</Avatar>
			</div>
		</div>
	)
}

export default {
	title: "Components/Avatar",
	component: Avatar,
	parameters: {
		componentSource: {
			code: AvatarCode,
			language: "javascript",
		},
		docs: {
			description: {
				component: "Avatar component for displaying user profile images or placeholders.",
			},
		},
	},
	args: {
		variant: "image",
		size: "normal",
		alt: "User profile picture",
		src: DEFAULT_AVATAR_IMAGE,
		className: "",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "placeholder", "initials"],
			description: "Type of avatar",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		size: {
			control: "select",
			options: ["small", "normal", "large", "xlarge", "xxlarge"],
			description: "Size of avatar",
			table: {
				defaultValue: { summary: "normal" },
			},
		},
		alt: {
			control: "text",
			description: "Alt text for the avatar image",
			table: {
				defaultValue: { summary: "" },
			},
		},
		src: {
			control: "text",
			description: "Source URL for the avatar image",
			table: {
				defaultValue: { summary: "" },
			},
		},
		className: {
			control: "text",
			description: "Class name of avatar",
			table: {
				defaultValue: { summary: "" },
			},
		},
	},
}
