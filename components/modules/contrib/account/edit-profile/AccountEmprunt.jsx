import React, { useState, useEffect } from "react"
import { useAccount, useI18n } from "@vactorynext/core/hooks"
import { Heading, Toggle, Text } from "@/ui"
import { drupal } from "@vactorynext/core/drupal"
//import AccountEditPasswordPage from "./AccountEditPassword"
import { client } from "@passwordless-id/webauthn"
//import { isSafari } from "react-device-detect"
import { toast } from "react-toastify"

const storeToLocalStorate = async (credential) => {
	localStorage.setItem("webauthnCredential", JSON.stringify(credential))
}
const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e"

export const AccountEmprunt = () => {
	const { t } = useI18n()
	const [isFaceidExist, setIsFaceIdExist] = useState(false)
	//	const [isFaceidSupport, setIsFaceIdSupport] = useState(false)
	const currentUser = useAccount()

	useEffect(() => {
		const face_id = localStorage.getItem("webauthnCredential")
		const credentials = JSON.parse(face_id)
		if (credentials?.id && credentials?.uid) {
			setIsFaceIdExist(true)
		}
		/*
		if (window) {
			setIsFaceIdSupport(client.isAvailable())
		}
    */
	}, [])

	// poste to api
	const updateUserFaceId = async (uuid, face_id = "test") => {
		const toastId = toast.loading("Loading...")
		try {
			const response = await drupal.fetch(`api/user/user/${uuid}`, {
				withAuth: true,
				method: "PATCH",
				body: JSON.stringify({
					data: {
						type: "user--user",
						id: uuid,
						attributes: {
							face_id: face_id,
						},
					},
				}),
			})
			if (response.ok) {
				toast.dismiss(toastId)
				toast.success(t("Nx:Congrats! now you can authenticate using Face ID option!"))
			}
			if (!response.ok) {
				toast.dismiss(toastId)
				toast.error(
					t(
						"Nx:An error has been occurred while updating your profile, please try later!"
					)
				)
			}
		} catch {
			toast.dismiss(toastId)
			toast.error(
				t("Nx:An error has been occurred while updating your profile, please try later!")
			)
		}
	}

	// emprunt logic
	const faceIdUpdateHandler = async () => {
		const uuid = currentUser.profile.user.uuid
		//console.log("isFaceIdEnabled",isFaceIdEnabled,isSafari,isFaceidSupport,isFaceidExist)
		try {
			const registration = await client.register(uuid, challenge, {
				authenticatorType: "auto",
				userVerification: "required",
				timeout: 60000,
				attestation: false,
				//userHandle: "recommended to set it to a random 64 bytes value",
				debug: false,
			})
			storeToLocalStorate({
				id: registration.credential.id,
				uid: uuid,
			})
			updateUserFaceId(uuid, registration.credential.id)
			//setIsFaceIdExist(true)
			return true
		} catch (err) {
			console.error("faceid", err)
			return false
		}
	}

	const handleDisableEmprunt = async () => {
		if (isFaceidExist) {
			localStorage.removeItem("webauthnCredential")
			setIsFaceIdExist(false)
		} else {
			const enabled = await faceIdUpdateHandler()
			setIsFaceIdExist(enabled)
		}
	}

	return (
		<div className="p-4 md:p-0">
			<div className="flex items-start justify-between gap-4">
				<Heading level={3} variant={5} className="mb-2">
					{t("Nx:Parametrer biométrie")}
				</Heading>
				<Toggle value={isFaceidExist} setValue={handleDisableEmprunt} />
			</div>
			<Text>{t("Nx:Connectez-vous a votre espace par votre biométrie")}</Text>
		</div>
	)
}
