import { useState, useEffect } from "react"
import { Wysiwyg, Text, Layer } from "@/ui"
import { useAccount } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_welcome:welcome",
}
const WelcomeWidget = ({ data }) => {
	const props = {
		description: data?.components?.[0]?.description?.value?.["#text"] || "",

		message: data?.components?.[0]?.message || "",
	}
	return <Welcome {...props} />
}

function Welcome({ message, description }) {
	const [isShow, setIsShow] = useState(false)
	const { isAuthenticated } = useAccount()

	useEffect(() => {
		if (sessionStorage.getItem("welcome") === null) {
			sessionStorage.setItem("welcome", "1")
		} else {
			setIsShow(true)
		}
	}, [])

	if (!isShow && isAuthenticated) {
		return (
			<Layer isShow={!isShow} modal={true} onClose={() => setIsShow(true)}>
				<div className="w-[600px] bg-white p-10">
					<Text>{message}</Text>
					<Wysiwyg html={description} />
				</div>
			</Layer>
		)
	}
	return null
}

export default WelcomeWidget
