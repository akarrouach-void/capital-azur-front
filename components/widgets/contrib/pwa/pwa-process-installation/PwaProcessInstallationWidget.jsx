import { Wysiwyg } from "@/ui"
import { ProcessInstallation } from "./ProcessInstallation"

export const config = {
	id: "vactory_pwa:process-installation",
}

const PwaProcessInstallationWidget = ({ data }) => {
	const Df = data?.components?.[0]
	const props = {
		banner: {
			logo: {
				src: Df?.group_banner?.image?.[0]?._default,
				width: Df?.group_banner?.image?.[0]?.meta?.width,
				height: Df?.group_banner?.image?.[0]?.meta?.height,
				alt: Df?.group_banner?.image?.[0]?.meta?.alt,
				title: Df?.group_banner?.image?.[0]?.meta?.title,
			},
			btn_title: Df?.group_banner?.btn,
		},
		safari: {
			title: Df?.group_safari?.title,
			description: Df?.group_safari?.description?.value?.["#text"] ? (
				<Wysiwyg html={Df?.group_safari?.description?.value?.["#text"]} />
			) : null,
		},
		android: {
			title: Df?.group_android?.title,
			description: Df?.group_android?.description?.value?.["#text"] ? (
				<Wysiwyg html={Df?.group_android?.description?.value?.["#text"]} />
			) : null,
		},
		android_firefox: {
			title: Df?.group_android_firefox?.title,
			description: Df?.group_android_firefox?.description?.value?.["#text"] ? (
				<Wysiwyg html={Df?.group_android_firefox?.description?.value?.["#text"]} />
			) : null,
		},
		huawei_firefox: {
			title: Df?.group_huawei_firefox?.title,
			description: Df?.group_huawei_firefox?.description?.value?.["#text"] ? (
				<Wysiwyg html={Df?.group_huawei_firefox?.description?.value?.["#text"]} />
			) : null,
		},
	}

	return <ProcessInstallation {...props} />
}

export default PwaProcessInstallationWidget
