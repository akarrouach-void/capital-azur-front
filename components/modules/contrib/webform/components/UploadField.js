import deburr from "lodash.deburr"
import React, { useMemo, useState, useImperativeHandle, forwardRef } from "react"
import Dropzone from "react-dropzone-uploader"
import { useFormContext, useFieldArray } from "react-hook-form"

import { Wysiwyg } from "@/ui"
import { drupal } from "@vactorynext/core/drupal"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useErrorMessage, toRegister, useStyles } from "@vactorynext/core/webform"
import { DropzonePreview } from "./dropzone/dropzone-preview"
import { FormControl, FormLabel, FormHelperText, FormErrorMessage } from "./FormControls"

import "react-dropzone-uploader/dist/styles.css"
// import "./dropzone/dropzone.css"

export const UploadField = forwardRef(({ webformId, name, field }, ref) => {
	const { label, helperText, validation, shouldDisplay, isMultiple, styles = {} } = field
	// We validate against this field.
	const internalName = "__" + name + "_internal"
	// Upload endpoint.
	const urlUploadDocuments = `/api/proxy/webform_rest/${webformId}/upload/${name}`
	// Uploaded files.
	const [uploadedFiles, setUploadedFiles] = useState([])
	// const [isUploading, setIsUploading] = useState(false)
	// const [hasServerError, setHasServerError] = useState(false)
	// Fields Styles.
	const fieldStyles = useStyles("uploadField", styles)
	const formControlLayout = useStyles("formControlLayout", styles)
	//const helperTextSeparatorStyle = useStyles("helperTextSeparator", styles)
	const { t } = useTranslation()
	const { register, watch, setValue, clearErrors, getValues } = useFormContext()
	const errorMessage = useErrorMessage(name, label, useFormContext)
	const values = watch({ nest: true })
	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	const { fields, append, remove } = useFieldArray({
		name: name + "__field",
	})

	useImperativeHandle(ref, () => ({
		reset: () => {
			uploadedFiles.forEach((f) => f.remove())
			setUploadedFiles([])
		},
	}))

	// Read file.
	const readFileAsync = (file) => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader()

			reader.onload = () => {
				resolve(reader.result)
			}

			reader.onerror = reject
			reader.readAsArrayBuffer(file)
		})
	}

	// specify upload params and url for your files
	const getUploadParams = async ({ file, meta }) => {
		let contentBuffer = await readFileAsync(file)
		let headers = {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `file; filename="${deburr(meta.name)}"`,
		}
		const token = await drupal.getAccessToken()
		if (token !== null) {
			headers["Authorization"] = `Bearer ${token}`
		}
		const blob = new Blob([contentBuffer], { type: file.type })
		return {
			url: urlUploadDocuments + "?_format=json",
			body: blob,
			headers: headers,
		}
	}

	// called every time a file's `status` changes
	const handleChangeStatus = ({ meta, file, xhr, ...rest }, status) => {
		const fileRemove = rest.remove
		if (status === "uploading") {
			// setIsUploading(true)
			// setHasServerError(false)
		}

		if (
			status === "error_upload" ||
			status === "removed" ||
			status === "aborted" ||
			status === "exception_upload" ||
			status === "done"
		) {
			// setIsUploading(false)
		}

		if (status === "error_upload") {
			// Can't get an XHR response until
			// https://github.com/fortana-co/react-dropzone-uploader/pull/25/files is resolved.
			// setHasServerError(true)
		}

		if (status === "removed") {
			setUploadedFiles((fids) => fids.filter((item) => item.id_internal !== meta.id))
			if (isMultiple === true) {
				remove(fields?.findIndex((item) => item.id === meta.id))
				if (fields.length <= 1) {
					setValue(internalName, "", true)
				}
			} else {
				setValue(internalName, "", true)
				setValue(name, "", true)
			}
		}

		if (status === "done") {
			const response = JSON.parse(xhr.response)
			if (response["fid"] && response["fid"][0]) {
				const fid = response["fid"][0]["value"]
				setUploadedFiles((fids) => [
					...fids,
					{
						name: file.name,
						id: fid,
						id_internal: meta.id,
						remove: fileRemove,
					},
				])
				if (isMultiple === true) {
					append(fid)
					setValue(name, "OK", true)
					setValue(name, getValues()[name + "__field"], true)
					clearErrors(name)
				} else {
					setValue(name, "OK", true)
					setValue(name, fid, true)
					clearErrors(name)
				}
			}
		}
	}

	return isVisible ? (
		<FormControl
			key={`${name}-control`}
			isRequired={validation?.required}
			isInvalid={errorMessage}
			className={"field--" + name}
		>
			<div
				className={vclsx(
					"ui-form__formControlInner",
					label ? "" : "ui-form__formControlInner_noLabel"
				)}
				style={formControlLayout?.inner}
			>
				{label && (
					<div className="ui-form__formControlLabel" style={formControlLayout?.label}>
						<FormLabel htmlFor={name}>
							<span>{label}</span>
						</FormLabel>
					</div>
				)}

				<div style={formControlLayout?.field}>
					<div className="hidden">
						{isMultiple === true ? (
							<div>
								{fields?.length > 0 &&
									fields.map((field, index) => (
										<input
											key={field.id}
											name={`${name}[${index}]`}
											defaultValue={field.value}
										/>
									))}
							</div>
						) : (
							<div>
								<input type={"hidden"} name={name} {...register} />
							</div>
						)}
					</div>
					<Dropzone
						getUploadParams={getUploadParams}
						onChangeStatus={handleChangeStatus}
						accept={field?.validation?.extensions}
						multiple={isMultiple}
						inputContent={t("Nx:Faites glisser des fichiers ou cliquez pour parcourir")}
						inputWithFilesContent={t("Nx:Ajouter des fichiers")}
						submitButtonContent={t("Nx:Transférer")}
						maxFiles={field?.validation?.maxFiles ? field?.validation?.maxFiles : 1}
						hasError={!!errorMessage}
						errorMessage={errorMessage}
						{...register(name, toRegister(name, validation, {}, t))}
						// Default 2 Mb.
						maxSizeBytes={
							field?.validation?.maxSizeBytes ? field?.validation?.maxSizeBytes : 2097152
						}
						PreviewComponent={(props) => <DropzonePreview {...props} />}
						addClassNames={{
							dropzone: errorMessage ? "dzu-dropzoneInvalid" : "",
						}}
					/>

					<FormHelperText {...fieldStyles?.helperText}>
						{helperText && (
							<div>
								<Wysiwyg html={helperText} />
								{/* <hr {...helperTextSeparatorStyle} /> */}
							</div>
						)}
						{/*
						{field.maxSizeMb && (
							<p>
								{t("Nx:Les fichiers ne doivent pas dépasser")}
								<strong>
									{" "}
									{field?.maxSizeMb} {t("Nx:Mo")}
								</strong>
								.
							</p>
						)}

						{field?.validation?.maxFiles && (
							<p>
								{t("Nx:Limité à ")}
								<strong>
									{" "}
									{field?.validation?.maxFiles} {t("Nx:Fichiers")}
								</strong>
								.
							</p>
						)}

						{field?.extensionsClean && (
							<p>
								{t("Nx:Extensions autorisées :")}{" "}
								<strong> {field?.extensionsClean}</strong>.
							</p>
						)} */}
					</FormHelperText>
					<FormErrorMessage
						{...fieldStyles?.errorMessage}
						className="mt-1 inline-block text-xs text-error-500"
					>
						{" "}
						{errorMessage}
					</FormErrorMessage>
				</div>
			</div>
		</FormControl>
	) : null
})
