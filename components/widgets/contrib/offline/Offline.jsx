import React, { useEffect } from "react"
import { Detector } from "react-detect-offline"
import { toast } from "react-toastify"

let toastId = null

const Offline = ({ text }) => {
	useEffect(() => {
		toastId = toast.warning(text, {
			position: "bottom-center",
			autoClose: false,
		})
	}, [])

	return null
}

const Online = ({ text }) => {
	useEffect(() => {
		if (toastId) {
			toast.dismiss(toastId)
			toast.success(text, {
				position: "bottom-center",
			})
		}
	}, [])
	return null
}

export const OfflineDetector = ({
	textOn = "De nouveau connecté à Internet !",
	textOff = "Aucune connexion Internet !",
}) => {
	return (
		<Detector
			render={({ online }) =>
				!online ? <Offline text={textOff} /> : <Online text={textOn} />
			}
		/>
	)
}
