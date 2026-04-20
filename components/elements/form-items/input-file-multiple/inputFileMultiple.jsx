import { useState, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { useUpdateEffect, useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Icon, Image, Tooltip } from "@/ui"
import {
	vclsx,
	getUploadParams,
	checkFileExistance,
	getFilesInfo,
	formatBytes,
	toBytes,
	convertAcceptedExtention,
} from "@vactorynext/core/utils"

const Extentions = ({ extentions }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center gap-3">
			<span className="text-xs font-medium text-slate-600">{t("Nx:extentions:")}</span>
			<div className="flex items-center gap-1.5">
				{extentions.map((extention) => {
					return (
						<span
							key={`file-extension-${extention}`}
							className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
						>
							{extention}
						</span>
					)
				})}
			</div>
		</div>
	)
}

const FileLimit = ({ remainingFiles }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center gap-3">
			<span className="text-xs font-medium text-slate-600">
				{t("Nx:remaining files:")}
			</span>
			<div className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1">
				<span className="text-xs font-semibold text-emerald-700">{remainingFiles}</span>
				<span className="text-xs text-emerald-600">{t("Nx:files")}</span>
			</div>
		</div>
	)
}

const FileSize = ({ fileSizeLimit }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center gap-3">
			<span className="text-xs font-medium text-slate-600">
				{t("Nx:file size limit:")}
			</span>
			<div className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1">
				<span className="text-xs font-semibold text-amber-700">{fileSizeLimit}</span>
				<span className="text-xs text-amber-600">{t("Nx:mb")}</span>
			</div>
		</div>
	)
}

/**
 * Helper function to get border and background classes based on error state
 * @param {Function} hasError - Function to check if there's an error
 * @returns {string} CSS class string
 */
function getBorderAndBgClasses(hasError) {
	if (hasError()) {
		return "border-red-300 bg-red-50/30"
	}

	return "border-slate-300 bg-slate-50/30"
}

/**
 * Helper function to generate dropzone button CSS classes
 * @param {boolean} isLimitReached - Whether file limit is reached
 * @param {boolean} isLoading - Whether upload is in progress
 * @param {Function} hasError - Function to check if there's an error
 * @returns {string} CSS class string
 */
function getDropzoneClasses(isLimitReached, isLoading, hasError) {
	return vclsx(
		"group relative w-full overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200",
		!isLimitReached &&
			!isLoading &&
			"cursor-pointer hover:border-blue-400 hover:bg-blue-50/30",
		getBorderAndBgClasses(hasError),
		(isLoading || isLimitReached) && "pointer-events-none opacity-60",
		isLimitReached && "border-gray-200 bg-gray-100"
	)
}

/**
 * Helper function to get icon container CSS classes
 * @param {Function} hasError - Function to check if there's an error
 * @param {boolean} isLimitReached - Whether file limit is reached
 * @returns {string} CSS class string
 */
function getIconContainerClasses(hasError, isLimitReached) {
	const baseClasses =
		"inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200"

	if (hasError()) {
		return vclsx(baseClasses, "bg-red-100")
	}

	if (isLimitReached) {
		return vclsx(baseClasses, "bg-gray-100")
	}

	return vclsx(baseClasses, "bg-slate-100 group-hover:bg-blue-100")
}

/**
 * Helper function to get icon CSS classes
 * @param {Function} hasError - Function to check if there's an error
 * @returns {string} CSS class string
 */
function getIconClasses(hasError) {
	const baseClasses = "h-6 w-6 transition-colors duration-200"

	if (hasError()) {
		return vclsx(baseClasses, "text-red-600")
	}

	return vclsx(baseClasses, "text-slate-600 group-hover:text-blue-600")
}

/**
 * Helper function to get the appropriate icon component for the dropzone
 * @param {boolean} isLimitReached - Whether file limit is reached
 * @param {Array} selectedFiles - Currently selected files
 * @param {Function} hasError - Function to check if there's an error
 * @returns {JSX.Element} Icon component
 */
function getDropzoneIconComponent(isLimitReached, selectedFiles, hasError) {
	if (isLimitReached) {
		return <Icon id="x-circle" className="h-6 w-6 text-gray-500" />
	}

	if (selectedFiles.length === 0) {
		return <Icon id="download" className={getIconClasses(hasError)} />
	}

	return <Icon id="plus" className={getIconClasses(hasError)} />
}

/**
 * Helper function to get text color classes
 * @param {Function} hasError - Function to check if there's an error
 * @returns {string} CSS class string
 */
function getTextClasses(hasError) {
	if (hasError()) {
		return "text-red-700"
	}

	return "text-slate-700 group-hover:text-blue-700"
}

/**
 * Helper function to get appropriate button text
 * @param {Array} selectedFiles - Currently selected files
 * @param {Function} t - Translation function
 * @returns {string} Button text
 */
function getDropzoneButtonText(selectedFiles, t) {
	if (selectedFiles.length === 0) {
		return t("Nx:select file")
	}

	return t("Nx:Add more files")
}

/**
 * Component for rendering the dropzone icon
 */
const DropzoneIcon = ({ isLoading, isLimitReached, selectedFiles, hasError }) => {
	if (isLoading) {
		return (
			<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
				<Icon id="minus-circle" className="h-6 w-6 animate-spin text-blue-600" />
			</div>
		)
	}

	return (
		<div className={getIconContainerClasses(hasError, isLimitReached)}>
			{getDropzoneIconComponent(isLimitReached, selectedFiles, hasError)}
		</div>
	)
}

/**
 * Component for rendering the dropzone text content
 */
const DropzoneText = ({ isLoading, isLimitReached, selectedFiles, hasError, t }) => {
	if (isLoading) {
		return <p className="text-sm font-medium text-blue-600">{t("Nx:uploading...")}</p>
	}

	if (isLimitReached) {
		return (
			<>
				<p className="text-sm font-medium text-gray-600">{t("Nx:File limit reached")}</p>
				<p className="text-xs text-gray-500">{t("Nx:Remove files to add more")}</p>
			</>
		)
	}

	return (
		<>
			<p
				className={vclsx(
					"text-sm font-medium transition-colors duration-200",
					getTextClasses(hasError)
				)}
			>
				{getDropzoneButtonText(selectedFiles, t)}
			</p>
			<p className="text-xs text-slate-500">{t("Nx:Click to browse files")}</p>
		</>
	)
}

/**
 * Component for rendering the file upload dropzone
 */
const FileDropzone = ({
	openFiles,
	hasError,
	isLoading,
	selectedFiles,
	limitFiles,
	t,
}) => {
	const isLimitReached = selectedFiles.length >= limitFiles

	return (
		<button
			className={getDropzoneClasses(isLimitReached, isLoading, hasError)}
			onClick={!isLimitReached ? openFiles : undefined}
			type="button"
		>
			<div className="flex items-center justify-center px-6 py-8">
				<div className="text-center">
					<div className="mb-3">
						<DropzoneIcon
							isLoading={isLoading}
							isLimitReached={isLimitReached}
							selectedFiles={selectedFiles}
							hasError={hasError}
						/>
					</div>
					<div className="space-y-1">
						<DropzoneText
							isLoading={isLoading}
							isLimitReached={isLimitReached}
							selectedFiles={selectedFiles}
							hasError={hasError}
							t={t}
						/>
					</div>
				</div>
			</div>
		</button>
	)
}

/**
 * Component for rendering error or file info display
 */
const FileInfoDisplay = ({
	hasError,
	errors,
	name,
	limitFiles,
	selectedFiles,
	accept,
	fileSizeLimit,
}) => {
	if (hasError()) {
		return (
			<div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
				<div className="flex items-center gap-2">
					<Icon
						id="exclamation-triangle"
						className="h-4 w-4 flex-shrink-0 text-red-600"
					/>
					<span className="text-sm font-medium text-red-700">{errors[name].message}</span>
				</div>
			</div>
		)
	}

	return (
		<div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
			<div className="space-y-3">
				<FileLimit remainingFiles={limitFiles - selectedFiles.length} />
				<Extentions extentions={accept} />
				<FileSize fileSizeLimit={fileSizeLimit} />
			</div>
		</div>
	)
}

/**
 * Component for rendering the selected files list
 */
const SelectedFilesList = ({ selectedFiles, filePreview, handleDeleteFile, t }) => {
	if (selectedFiles.length === 0) return null

	return (
		<div className="mt-4">
			<div className="mb-3">
				<h4 className="text-sm font-medium text-slate-900">
					{t("Nx:Selected files")} ({selectedFiles.length})
				</h4>
			</div>
			<div className="space-y-3">
				{selectedFiles.map((file) => (
					<SelectedFile
						key={file?.name}
						file={file}
						filePreview={filePreview}
						deleteFile={handleDeleteFile}
					/>
				))}
			</div>
		</div>
	)
}

const SelectedFile = ({ file, deleteFile, filePreview }) => {
	const { t } = useTranslation()
	return (
		<div className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				{filePreview && file.type.includes("image/") && file?.previewUrl && (
					<div className="flex-shrink-0">
						<Image
							src={`/api/proxy${file?.previewUrl}`}
							alt={file?.name || "Image alt"}
							width={100}
							height={100}
							className="h-10 w-10 rounded-md border border-slate-200 object-cover"
						/>
					</div>
				)}
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
					<p className="mt-1 text-xs text-slate-500">{formatBytes(file.size)}</p>
				</div>
			</div>
			<div className="ml-4 flex items-center gap-2">
				{filePreview && file.type.includes("application/") && file?.previewUrl && (
					<a
						href={`/api/proxy${file?.previewUrl}`}
						download
						rel="noreferrer"
						target="_blank"
						className="rounded-md p-1.5 text-slate-400 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
					>
						<Tooltip text={t("Nx:preview")} position="topRight">
							<Icon id="eye" className="h-4 w-4" />
						</Tooltip>
					</a>
				)}
				<button
					type="button"
					onClick={() => {
						deleteFile(file)
					}}
					aria-label={t("Nx:Remove file")}
					className="rounded-md p-1.5 text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
				>
					<Icon id="trash" className="h-4 w-4" />
				</button>
			</div>
		</div>
	)
}

/**
 * Helper function to initialize selected files from form values
 * @param {Function} getValues - Form getValues function
 * @param {Function} setValue - Form setValue function
 * @param {string} name - Field name
 * @param {Array} defaultValue - Default file array
 * @returns {Array} Initial selected files array
 */
function initializeSelectedFiles(getValues, setValue, name, defaultValue) {
	const registeredValue = getValues(name)
	if (registeredValue !== undefined) {
		return [...getValues(name)]
	}
	setValue(name, defaultValue)
	return [...defaultValue]
}

/**
 * Helper function to validate file before upload
 * @param {File} file - File to validate
 * @param {Array} selectedFiles - Currently selected files
 * @param {number} fileSizeLimit - Size limit in MB
 * @param {Function} t - Translation function
 * @returns {Object} Validation result with isValid and errorMessage
 */
function validateFile(file, selectedFiles, fileSizeLimit, t) {
	if (file.size > toBytes(fileSizeLimit)) {
		return {
			isValid: false,
			errorMessage: t("Nx:file must be less than 2 mo"),
		}
	}

	if (checkFileExistance(selectedFiles, file) !== undefined) {
		return {
			isValid: false,
			errorMessage: t("Nx:file alraedy exits"),
		}
	}

	return { isValid: true, errorMessage: null }
}

/**
 * Helper function to handle file upload process
 * @param {File} file - File to upload
 * @param {string} url - Upload URL
 * @param {Object} stateSetters - State setter functions: {setSelectedFiles, setIsLoading}
 * @param {Object} formActions - Form action functions: {clearErrors, setError}
 * @param {string} name - Field name
 * @param {Function} t - Translation function
 */
async function handleFileUpload(file, url, stateSetters, formActions, name, t) {
	const { setSelectedFiles, setIsLoading } = stateSetters
	const { clearErrors, setError } = formActions

	setIsLoading(true)

	try {
		const s_file = await getUploadParams(file, url)
		const r_file = getFilesInfo(s_file)
		setSelectedFiles((prev) => [r_file, ...prev])
		clearErrors(name)
	} catch {
		setError(name, { message: t("Nx:upload failed") })
	} finally {
		setIsLoading(false)
	}
}

/**
 * Helper function to check if field has validation errors
 * @param {Object} errors - Form errors object
 * @param {string} name - Field name
 * @returns {boolean} Whether field has errors
 */
function hasFieldError(errors, name) {
	return errors[name] !== undefined
}

/**
 * Helper function to handle file input opening with validation
 * @param {number} limitFiles - Maximum allowed files
 * @param {Array} selectedFiles - Currently selected files
 * @param {Object} inputFileRef - Input file reference
 * @param {Function} setError - Form set error function
 * @param {string} name - Field name
 * @param {Function} t - Translation function
 */
function handleOpenFiles(limitFiles, selectedFiles, inputFileRef, setError, name, t) {
	if (selectedFiles.length < limitFiles) {
		inputFileRef.current.click()
	} else {
		setError(name, { message: t("Nx:you've reached the file size limit") })
	}
}

export const InputFileMultiple = ({
	name,
	label,
	labelDisplay = "",
	validations, // react-hook-form validations
	url,
	accept, // accept array of extentions
	limitFiles,
	fileSizeLimit,
	filePreview,
	defaultValue = [], // default value must be an array of files
}) => {
	const { t } = useTranslation()
	const inputFileRef = useRef(null)
	const [isLoading, setIsLoading] = useState(false)
	const {
		register,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useFormContext()

	const [selectedFiles, setSelectedFiles] = useState(() =>
		initializeSelectedFiles(getValues, setValue, name, defaultValue)
	)

	const hasError = () => hasFieldError(errors, name)

	useUpdateEffect(() => {
		if (typeof getValues(name) === "string") {
			setSelectedFiles([])
		}
	}, [getValues(name)])

	useUpdateEffect(() => {
		setValue(name, selectedFiles)
	}, [selectedFiles])

	const handleChange = async (e) => {
		const files = Array.from(e.target.files)
		const availableSlots = limitFiles - selectedFiles.length

		// If no slots available, show error
		if (availableSlots <= 0) {
			setError(name, { message: t("Nx:you've reached the file size limit") })
			e.target.value = []
			return
		}

		// Only process files up to the available slots
		const filesToProcess = files.slice(0, availableSlots)
		const filesBeingProcessed = [] // Track files in current batch to avoid duplicates

		// Show warning if user selected more files than available slots
		if (files.length > availableSlots) {
			setError(name, {
				message: t("Nx:Only the first {{count}} file(s) will be processed due to limit", {
					count: availableSlots,
					defaultValue: `Only the first ${availableSlots} file(s) will be processed due to limit`,
				}),
			})
		}

		// Process each selected file up to the limit
		for (const file of filesToProcess) {
			// Check against both existing files and files being processed in this batch
			const allFilesToCheck = [...selectedFiles, ...filesBeingProcessed]
			const validation = validateFile(file, allFilesToCheck, fileSizeLimit, t)

			if (!validation.isValid) {
				setError(name, { message: validation.errorMessage })
				continue // Skip this file but process others
			}

			await handleFileUpload(
				file,
				url,
				{ setSelectedFiles, setIsLoading },
				{ clearErrors, setError },
				name,
				t
			)

			// Add to our tracking array
			filesBeingProcessed.push(file)
		}

		e.target.value = []
	}

	const handleDeleteFile = (file) => {
		setSelectedFiles((prev) => prev.filter((stateFile) => file !== stateFile))
	}

	const openFiles = () => {
		// Prevent opening dialog if limit is reached
		if (selectedFiles.length >= limitFiles) {
			setError(name, { message: t("Nx:you've reached the file size limit") })
			return
		}
		handleOpenFiles(limitFiles, selectedFiles, inputFileRef, setError, name, t)
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
							"inline-block shrink-0 grow text-sm font-semibold text-slate-900 md:max-w-1/5 md:basis-1/5 md:pr-5",
						labelDisplay == "after" && "order-2 mt-4"
					)}
					htmlFor={name}
				>
					{label}
				</label>
			)}
			<div
				className={vclsx(
					"relative w-full",
					labelDisplay == "default" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
					labelDisplay == "after" && "order-1"
				)}
			>
				<div className="relative">
					<FileDropzone
						openFiles={openFiles}
						hasError={hasError}
						isLoading={isLoading}
						selectedFiles={selectedFiles}
						limitFiles={limitFiles}
						t={t}
					/>
				</div>
				<input
					ref={inputFileRef}
					type="file"
					multiple
					className="absolute h-0 w-0"
					id={name}
					name={name}
					accept={convertAcceptedExtention(accept)}
					onChange={handleChange}
					aria-label={label}
				/>
				<input
					type={"hidden"}
					className="absolute h-0 w-0"
					{...register(name, validations)}
				/>
				<FileInfoDisplay
					hasError={hasError}
					errors={errors}
					name={name}
					limitFiles={limitFiles}
					selectedFiles={selectedFiles}
					accept={accept}
					fileSizeLimit={fileSizeLimit}
				/>
				<SelectedFilesList
					selectedFiles={selectedFiles}
					filePreview={filePreview}
					handleDeleteFile={handleDeleteFile}
					t={t}
				/>
			</div>
		</div>
	)
}
