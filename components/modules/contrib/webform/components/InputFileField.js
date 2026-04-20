import React from "react"
import { InputFileSimple, InputFileMultiple } from "@/ui"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { useCheckConditions } from "@vactorynext/core/webform"
import { useFormContext } from "react-hook-form"

export const InputFileField = ({ webformId, name, field }) => {
	const { t } = useTranslation()
	const {
		validation,
		states,
		label,
		title_display,
		helperText,
		filePreview,
		attributes,
	} = field

	const { watch } = useFormContext()
	const local_state = useCheckConditions(states, watch)

	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null

	var local_validation

	if (local_state["required"] !== undefined) {
		local_validation = { ...validation, required: local_state.required }
	} else {
		local_validation = { ...validation }
	}

	const urlUploadDocuments = `webform_rest/${webformId}/upload/${name}`
	if (field?.validation?.maxFiles) {
		return (
			<InputFileMultiple
				label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
				url={urlUploadDocuments}
				name={name}
				accept={field?.extensionsClean ? (field?.extensionsClean).split(" ") : []}
				validations={
					local_validation?.required ? { required: t("Nx:This field is requiered") } : {}
				}
				fileSizeLimit={field?.maxSizeMb || 2}
				limitFiles={field?.validation?.maxFiles}
				labelDisplay={title_display}
				description={helperText}
				filePreview={filePreview}
				aria-label={t(`Nx:${label}`)}
				{...attributes}
			/>
		)
	}
	return (
		<InputFileSimple
			url={urlUploadDocuments}
			name={name}
			accept={field?.extensionsClean ? (field?.extensionsClean).split(" ") : []}
			validations={
				local_validation?.required ? { required: t("Nx:This field is requiered") } : {}
			}
			fileSizeLimit={field?.maxSizeMb || 2}
			label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
			labelDisplay={title_display}
			description={helperText}
			aria-label={label}
			filePreview={filePreview}
			defaultValue={field?.default_value}
			{...attributes}
		/>
	)
}
