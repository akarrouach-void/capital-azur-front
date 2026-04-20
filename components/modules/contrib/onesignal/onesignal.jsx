import { useEffect } from "react"
import { useAccount } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import OneSignal from "react-onesignal"

export const OneSignalPushNotificationInitializer = () => {
	const { isAuthenticated } = useAccount()
	useEffect(() => {
		if (isAuthenticated) {
			OneSignal.init({
				appId: "c08e4819-dd4d-47d8-b2bb-58d39eddc479", //process.env.ONESIGNAL_APP_ID,
			})
				.then(() => {
					//OneSignal.User.addEmail(profile?.user?.email || "")
					console.log(
						"window?.OneSignal?.User?.PushSubscription?._id",
						window?.OneSignal?.User?.PushSubscription?._id
					)
					if (window && window?.OneSignal?.User?.PushSubscription?._id) {
						drupal
							.fetch(`api/notifications/device_id/add`, {
								withAuth: true,
								method: "POST",
								body: JSON.stringify({
									device_id: window.OneSignal.User.PushSubscription._id,
								}),
							})
							.then((response) => {
								return response.json()
							})
							.then(() => {
								console.log("======success push notification=====")
							})
							.catch(() => {
								console.error("=====catch push notification======")
							})
					}
				})
				.catch((err) => {
					console.error("error onesignal", err)
				})
		}
	}, [])
	return null
}
