import { Avatar, Button, Icon, Text } from "@/ui"
import React from "react"
import { notification as notificationTheme } from "./theme"
import * as dayjs from "dayjs"

export const Notifications = ({ notifications }) => {
	return (
		<div className={notificationTheme.container}>
			{notifications.map((notification, index) => (
				<div className={notificationTheme.wrapper} key={index}>
					<div className="flex items-center gap-3 rounded-lg p-3">
						<Avatar className="h-10 w-10" src={notification.owner.avatar} />
						<p className="flex-1">
							<Text as="p" className="text-md font-semibold">
								{notification.owner.username}
							</Text>
							<Text as="span" className="text-xs text-gray-300">
								{dayjs(notification.createdAt).format("YYYY-MM-DD [at] HH:mm")}
							</Text>
						</p>
						<Button
							icon={
								<Icon
									className="h-4 w-4 text-primary-600 group-hover:text-gray-25"
									id="arrow-sm-right-solid"
								/>
							}
							href={notification.pageUrl}
							className="group rounded-full"
							outline
						/>
					</div>
					<div className="p-3">
						<Text as="h3" className="font-bold text-gray-700">
							{notification.title}
						</Text>
						<Text className="text-sm text-gray-500">{notification.content}</Text>
					</div>
				</div>
			))}
		</div>
	)
}
