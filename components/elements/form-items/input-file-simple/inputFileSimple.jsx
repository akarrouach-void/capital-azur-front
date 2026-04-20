import React, { useState, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { useUpdateEffect, useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Icon, Wysiwyg, Image, Tooltip } from "@/ui"
import {
	vclsx,
	getUploadParams,
	getFilesInfo,
	formatBytes,
	toBytes,
	convertAcceptedExtention,
	isInputEmpty,
} from "@vactorynext/core/utils"

const SelectedFile = ({ file, deleteFile, filePreview }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center justify-between space-x-2">
			{filePreview && file.type.includes("image/") && file?.previewUrl && (
				<Image
					src={`/api/proxy${file?.previewUrl}`}
					alt={file?.name || "Image alt"}
					width={100}
					height={100}
					className="h-5 w-fit"
				/>
			)}
			<p className="flex flex-1 items-center justify-between">
				<span className="text-sm">{file.name}</span>
				<span className="text-xs text-gray-600">{formatBytes(file.size)}</span>
			</p>
			<button type="button" onClick={deleteFile}>
				<Icon id="trash" className="h-5 w-5 text-error-500" />
			</button>
			{filePreview && file.type.includes("application/") && file?.previewUrl && (
				<a
					href={`/api/proxy${file?.previewUrl}`}
					download
					rel="noreferrer"
					target="_blank"
				>
					<Tooltip text={t("Nx:preview")} position="topRight">
						<Icon id="eye" className="h-5 w-5" />
					</Tooltip>
				</a>
			)}
		</div>
	)
}

export const InputFileSimple = ({
	label,
	labelDisplay = "",
	description,
	name,
	url,
	accept,
	fileSizeLimit,
	validations,
	defaultValue = "",
	filePreview,
}) => {
	const { t } = useTranslation()
	const inputFileRef = useRef(null)
	const [isLoading, setIsLoading] = useState(false)
	const {
		register,
		setValue,
		setError,
		getValues,
		clearErrors,
		formState: { errors },
	} = useFormContext()
	const [selectedFile, setSelectedFile] = useState(() => {
		const registeredValue = getValues(name)
		if (
			registeredValue !== undefined &&
			registeredValue !== null &&
			!registeredValue.length
		) {
			return getValues(name)
		} else {
			setValue(name, defaultValue)
			return defaultValue
		}
	})

	useUpdateEffect(() => {
		setValue(name, selectedFile)
	}, [selectedFile])

	const handleChange = async (e) => {
		const file = e.target.files[0]
		if (file.size > toBytes(fileSizeLimit)) {
			setError(name, { message: t("Nx:file must be less than 2 mo") })
		} else {
			setIsLoading(true)
			getUploadParams(file, url)
				.then((s_file) => {
					clearErrors(name)
					const r_file = getFilesInfo(s_file)
					setSelectedFile(r_file)
					setIsLoading(false)
					e.target.value = null
				})
				.catch(() => {
					setError(name, { message: t("Nx:upload failed") })
					setIsLoading(false)
				})
		}
	}

	const openFiles = () => {
		inputFileRef.current?.click()
	}

	const handleDeleteFile = () => {
		setSelectedFile("")
	}

	const fileValue = getValues(name)
	useUpdateEffect(() => {
		if (getValues(name) === "[object Object]" || getValues(name) === "") {
			setSelectedFile("")
		}
	}, [fileValue])

	let fileContent = null
	if (isLoading) {
		fileContent = <p className="text-sm text-gray-600">{t("Nx:uplaoding...")}</p>
	} else if (!isLoading && isInputEmpty(selectedFile)) {
		fileContent = <p className="text-sm text-gray-600">{t("Nx:select file")}</p>
	} else {
		fileContent = (
			<SelectedFile
				filePreview={filePreview}
				file={selectedFile}
				deleteFile={handleDeleteFile}
			/>
		)
	}

	return (
		<div
			className={vclsx(
				"mb-4 w-full",
				["after", "default"].indexOf(labelDisplay) > -1 && "flex flex-wrap",
				labelDisplay == "default" && "md:items-center"
			)}
		>
			{label && labelDisplay !== "none" && (
				<label
					className={vclsx(
						"mb-1 inline-block text-sm font-medium text-gray-700",
						labelDisplay == "invisible" && "sr-only",
						labelDisplay == "default" &&
							"inline-block shrink-0 grow text-sm font-medium text-gray-700 md:max-w-1/5 md:basis-1/5 md:pr-5",
						labelDisplay == "after" && "order-2 mt-4"
					)}
					htmlFor={name}
				>
					{label}
				</label>
			)}
			<div
				className={vclsx(
					"relative flex w-full flex-wrap items-center",
					labelDisplay == "default" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
					labelDisplay == "after" && "order-1"
				)}
			>
				<div className={vclsx("relative flex w-full items-center")}>
					<div
						className={vclsx(
							"flex-1 border-y border-l px-3 py-3",
							errors[name] !== undefined && "border-error-500"
						)}
					>
						{fileContent}
					</div>
					<button
						type="button"
						disabled={isLoading}
						name={name}
						onClick={openFiles}
						className="relative flex items-center justify-center self-stretch border-black bg-black px-3 py-2 text-white"
						aria-label="upload"
					>
						{isLoading ? (
							<div>
								<Icon id="minus-circle" className="h-5 w-5 animate-spin" />
							</div>
						) : (
							<>
								{isInputEmpty(selectedFile) ? (
									<Icon id="download" className="h-5 w-5" />
								) : (
									<Icon id="sync" className="h-5 w-5" />
								)}
							</>
						)}
					</button>
				</div>
				<input
					ref={inputFileRef}
					hidden={true}
					accept={convertAcceptedExtention(accept)}
					type="file"
					className="absolute h-0 w-0"
					onChange={handleChange}
					id={name}
					name={name}
				/>

				<input type="hidden" {...register(name, validations)} />
				{errors[name] && (
					<span className="text-xs text-error-500">{errors[name].message}</span>
				)}

				{description && (
					<Wysiwyg className={"mt-1 text-sm text-gray-400"} html={description} />
				)}
			</div>
		</div>
	)
}
