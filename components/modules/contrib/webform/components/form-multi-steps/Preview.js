import { useEffect, useState } from "react"
import { Text, Wysiwyg } from "@/ui"
import { Details } from "./../containers/Details"
import { drupal } from "@vactorynext/core/drupal"
import { useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"

const LAYOUTS = [
	"webform_flexbox",
	"container",
	"fieldset",
	"details",
	"webform_wizard_page",
]

export const FormPreview = ({ schema }) => {
	const { t } = useTranslation()
	const keys = Object.keys(schema?.pages || [])
	keys.splice(keys.indexOf("webform_preview"), 1)
	return (
		<>
			{schema?.pages?.webform_preview?.preview?.title && (
				<Text>
					<span className="block text-center text-lg font-semibold text-primary-600">
						{`Nx:${schema?.pages?.webform_preview?.preview?.title}`}
					</span>
				</Text>
			)}
			{schema?.pages?.webform_preview?.preview?.message && (
				<Wysiwyg
					html={schema?.pages?.webform_preview?.preview?.message}
					className="prose mb-5 max-w-none"
				/>
			)}

			{keys.map((page, index) => {
				return (
					<Details
						open="true"
						key={index}
						title={t(`Nx:${schema?.pages[page]["title"]}`)}
					>
						<FormPreviewItem
							data={schema?.pages[page]}
							excludedElements={
								schema?.pages?.webform_preview?.preview?.excluded_elements
							}
							excludeEmpty={
								schema?.pages?.webform_preview?.preview?.preview_exclude_empty
							}
						/>
					</Details>
				)
			})}
		</>
	)
}

export const FormPreviewItem = ({ data, excludedElements, excludeEmpty }) => {
	const keys = Object.keys(data?.childs || [])
	const { getValues } = useFormContext()
	return (
		<>
			{keys.map((field, index) => {
				const value = getValues(field)
				if (excludedElements[field] !== undefined || field == "flexTotal") return null
				if (LAYOUTS.includes(data?.childs[field]["type"]))
					return (
						<FormPreviewItem
							key={index}
							data={data?.childs[field]}
							excludedElements={excludedElements}
							excludeEmpty={excludeEmpty}
						/>
					)

				if (excludeEmpty && value == undefined) return null
				return (
					<FormPreviewItemValue key={index} field={data?.childs[field]} value={value} />
				)
			})}
		</>
	)
}

export const FormPreviewItemValue = ({ field, value }) => {
	const [files, setFiles] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { t } = useTranslation()
	const fetchFiles = async () => {
		if (value.constructor === Array) {
			value = value.join(",")
		}
		setIsLoading(true)
		const response = await drupal.fetch(`api/webform/private-files?files=${value}`, {
			withAuth: true,
			method: "GET",
		})
		const data = await response.json()
		setFiles(data?.files)
		setIsLoading(false)
	}

	useEffect(() => {
		if (field["type"] == "upload" && value !== undefined && value !== null) {
			fetchFiles()
		}
	}, [])

	const renderSwitch = (type) => {
		switch (type) {
			case "radios":
			case "select":
				return value !== undefined && value !== null && value !== ""
					? field["options"]?.find((option) => {
							return option?.value == value
						})["label"]
					: t("Nx:Empty")
			case "checkbox":
				return value ? t("Nx:Yes") : t("Nx:No")
			case "upload":
				return value == undefined
					? t("Nx:Empty")
					: isLoading
						? t("Nx:Preparing files ...")
						: files.length > 0 &&
							files.map((file) => {
								return file?._default ? (
									<p>
										<a href={`/api/proxy/${file?._default}`} download>
											{file.file_name}
										</a>
									</p>
								) : (
									<Text>{file.file_name}</Text>
								)
							})
			default:
				return value !== "" && value !== undefined ? value : t("Nx:Empty")
		}
	}
	return (
		<>
			<div className="flex flex-wrap items-center not-last-child:mb-4">
				<p className="mb-2 max-w-full flex-shrink-0 flex-grow basis-full font-semibold md:mb-0 md:max-w-2/5 md:basis-2/5 md:pl-5 xl:max-w-1/4 xl:basis-1/4">
					{t(`Nx:${field["label"]}`)}
				</p>
				<span className="flex-shrink-0 flex-grow">{renderSwitch(field["type"])}</span>
			</div>
		</>
	)
}
