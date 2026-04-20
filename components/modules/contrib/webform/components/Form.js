import { useI18n as useTranslation, useNode } from "@vactorynext/core/hooks"

import {
	getDefaultValues,
	scrollFormItem,
	onSubmit,
	handleDraftSubmit,
	useWebformRequest,
} from "@vactorynext/core/webform"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import merge from "lodash.merge"
import { defaultStyles } from "./FormStyles"
import { TextField } from "./TextField"
import { TextAreaField } from "./TextAreaField"
import { RawHtml } from "./RawHtml"
import { Markup } from "./Markup"
import { NumberField } from "./NumberField"
import { CheckboxField } from "./CheckboxField"
import { CheckboxesField } from "./CheckboxesField"
import { RadiosField } from "./RadiosField"
import { SelectField } from "./SelectField"
import { SelectOtherField } from "./SelectOtherField"
import { ReCaptchaField } from "./ReCaptchaField"
import { InputFileField } from "./InputFileField"
import { DateField } from "./DateField"
import { TimeField } from "./TimeField"
import { PasswordField } from "./PasswordField"
import { RangeField } from "./RangeField"
import { ScaleField } from "./ScaleField"
import { Button, Wysiwyg } from "@/ui"
import { ConfirmationMessage } from "./ConfirmationMessage"
import { FormMultiStep } from "./form-multi-steps/MultiStep"
import { FormLayout } from "./FormLayout"
import { dlPush } from "@vactorynext/core/lib"

import useFormPersist from "react-hook-form-persist"
import { ErrorBoundary } from "@vactorynext/core/utils"
import { toast } from "react-toastify"

export const RenderField = (props) => {
	const fieldData = props.field
	const [name, field] = fieldData
	const { webformId } = useFormContext()
	let Component = null
	switch (field.type) {
		case "text":
			Component = TextField
			break
		case "password":
			Component = PasswordField
			break
		case "textArea":
			Component = TextAreaField
			break

		case "rawhtml":
			Component = RawHtml
			break

		case "markup":
			Component = Markup
			break

		case "number":
			Component = NumberField
			break

		case "checkbox":
			Component = CheckboxField
			break

		case "checkboxes":
			Component = CheckboxesField
			break

		case "radios":
			Component = RadiosField
			break

		case "select":
			Component = SelectField
			break

		case "webform_select_other":
			Component = SelectOtherField
			break

		case "captcha":
			Component = ReCaptchaField
			break

		case "upload":
			Component = InputFileField
			break

		case "date":
			Component = DateField
			break

		case "time":
			Component = TimeField
			break

		case "range":
			Component = RangeField
			break

		case "webform_scale":
			Component = ScaleField
			break

		case "webform_flexbox":
		case "webform_section":
		case "container":
		case "fieldset":
		case "details":
			return <FormLayout data={fieldData[1]} />
		case "custom":
			Component = field.component
			return (
				<Component
					name={name}
					webformId={webformId}
					field={field}
					//ref={(r) => (internalRefs.current[name] = r)}
					{...field.props}
				/>
			)

		default:
			return (
				<div className="alert alert-warning">
					<p>
						Component <i>{field.type}</i> <b>{name}</b> is not found. Checkout
						`components/modules/contrib/webform/components/Form.js` for more.
					</p>
				</div>
			)
	}

	return (
		<Component
			name={name}
			webformId={webformId}
			field={field}
			//ref={(r) => (internalRefs.current[name] = r)}
		/>
	)
}

export const Form = ({
	title,
	webformId,
	autoSaveSettings,
	schema,
	overwriteDefaultStyles,
	buttons,
	styles = {},
	render,
	confirmeSubmit = null,
	handleSubmitRedirection = true,
	runtimeDefaultValues = {},
	onSuccess = null,
	onError = null,
	formatSubmitData = (data) => {
		return data
	},
	reset = true,
	formOnSubmit,
}) => {
	const { csrfToken } = useNode()
	const router = useRouter()
	const { t } = useTranslation()
	const defaultValues = { ...getDefaultValues(schema), ...runtimeDefaultValues }
	const form = useForm({
		validateCriteriaMode: "all",
		defaultValues: defaultValues,
	})

	// Check if auto-save should be enabled based on settings
	const shouldPersist = !!autoSaveSettings?.autosave_enabled
	// Retrieve all form field names to use them in case auto-save is disabled
	const allFormFieldNames = Object.keys(form.getValues())
	// Set fields to exclude from persistence:
	// - If auto-save is enabled, exclude specific fields like 'csrf_token', 'c_password',
	//   and any fields specified in the auto-save settings.
	// - If auto-save is disabled, exclude all fields to prevent any data from being saved.
	const excludeFields = shouldPersist
		? [
				"csrf_token",
				"c_password",
				...(autoSaveSettings?.autosave_exclude_fields
					? Object.keys(autoSaveSettings.autosave_exclude_fields)
					: []),
			]
		: allFormFieldNames
	// Determine the storage type (localStorage or sessionStorage) based on the settings
	let storageType = null

	useEffect(() => {
		storageType =
			autoSaveSettings?.autosave_storage_type === "local"
				? window.localStorage
				: window.sessionStorage
	}, [])

	// Calculate the timeout in milliseconds. If the interval is null, set timeout as undefined
	const timeoutMs = autoSaveSettings?.autosave_interval
		? parseInt(autoSaveSettings.autosave_interval, 10) * 1000
		: undefined
	// Configure the form persistence settings
	const persistConfig = {
		watch: form.watch,
		setValue: form.setValue,
		storage: storageType,
		exclude: excludeFields,
		timeout: timeoutMs,
	}
	// Apply form persistence with the configured settings
	useFormPersist(webformId, persistConfig)

	useEffect(() => {
		scrollFormItem(form)
	}, [form.formState])
	const internalRefs = useRef({})
	const baseStyles = overwriteDefaultStyles ? styles : merge({}, defaultStyles, styles)
	const [isLoading, setIsLoading] = React.useState(false)
	const [isSuccess, setIsSuccess] = React.useState(false)
	const [isError, setIsError] = React.useState(false)
	const [confirmationMessage, setConfirmationMessage] = useState("")
	const [inlineConfirmation, setInlineConfirmation] = useState(false)
	const [confirmationAtTopPage, setConfirmationAtTopPage] = useState(false)
	const [sid, setSid] = useState(schema?.draft?.sid || null)
	const [formStep, setFormStep] = useState(() => {
		const keys = Object.keys(schema?.pages || [])
		return keys.indexOf(schema?.draft?.currentPage) > 0
			? keys.indexOf(schema?.draft?.currentPage)
			: 0
	})
	const nextFormStep = async () => {
		const result = await form.trigger()
		if (result) {
			setFormStep((currentStep) => currentStep + 1)
		}
	}
	const prevFormStep = () => setFormStep((currentStep) => currentStep - 1)

	const goToStep = async (page) => {
		let result = true
		if (page > formStep) {
			result = await form.trigger()
		}
		if (result && (page - formStep == 1 || page - formStep < 0)) {
			setFormStep(page)
		}
	}

	const resetForm = () => {
		form.reset()
	}

	const reloadCurrentPage = () => {
		setInlineConfirmation(false)
	}

	useEffect(() => {
		dlPush("Affichage formulaire", {
			"ID formulaire": webformId,
			"Titre formulaire": title,
		})
	}, [])

	const submitWebform = useWebformRequest()

	return (
		<ErrorBoundary>
			<FormProvider
				webformId={webformId}
				internalRefs={internalRefs}
				{...form}
				defaultValues={defaultValues}
			>
				{inlineConfirmation ? (
					<>
						<div className="py-[30px]">
							<div className="relative rounded bg-success-100 py-6 pl-5 pr-8">
								<span className="text-sm">
									<Wysiwyg html={confirmationMessage} />
								</span>
								<button className="absolute right-3 top-3">
									<svg className="h-5 w-5">
										<use href="/icons.svg#x"></use>
									</svg>
								</button>
							</div>
						</div>
						<Button onClick={reloadCurrentPage}>{t("Nx:Back to form")}</Button>
					</>
				) : (
					<>
						{confirmationAtTopPage && (
							<ConfirmationMessage message={confirmationMessage} />
						)}
						<form
							onSubmit={form.handleSubmit((data) =>
								onSubmit(
									t,
									data,
									formatSubmitData,
									webformId,
									sid,
									schema,
									internalRefs,
									handleSubmitRedirection,
									setIsLoading,
									setIsSuccess,
									setIsError,
									setInlineConfirmation,
									setConfirmationMessage,
									setConfirmationAtTopPage,
									reset,
									resetForm,
									setFormStep,
									confirmeSubmit,
									form,
									router,
									formOnSubmit,
									Wysiwyg,
									submitWebform,
									onSuccess,
									onError,
									toast
								)
							)}
							ref={internalRefs}
							data-testid="form"
							id={`webform-${webformId}`}
							name={`webform-${webformId}`}
						>
							<input
								name="csrf_token"
								{...form.register("csrf_token")}
								type="hidden"
								defaultValue={csrfToken}
							/>
							{render ? (
								render(
									resetForm,
									isLoading,
									isSuccess,
									isError,
									nextFormStep,
									prevFormStep,
									goToStep,
									formStep
								)
							) : (
								<React.Fragment>
									<div className="ui-form__fieldGroups">
										{Object.entries(schema).map((field, index) => {
											if (field[0] === "buttons" || field[0] == "draft") return false
											else if (field[0] == "pages") {
												return (
													<FormMultiStep
														pages={field[1]}
														schema={schema}
														currentStep={formStep}
														prevFormStep={prevFormStep}
														nextFormStep={nextFormStep}
														goToStep={goToStep}
														buttonBaseStyles={baseStyles?.submitButton}
														buttontext={buttons?.actions?.actions?.text || t("Nx:Submit")}
														key={index}
														isLoading={isLoading}
													/>
												)
											}
											return (
												<RenderField
													key={`${field[0]}-container`}
													field={field}
													form={form}
												/>
											)
										})}
									</div>
									{schema?.draft?.enable && (
										<Button
											disabled={isLoading}
											onClick={form.handleSubmit((data) =>
												handleDraftSubmit(
													data,
													setIsLoading,
													formatSubmitData,
													webformId,
													schema,
													formStep,
													sid,
													setSid,
													setIsError,
													submitWebform
												)
											)}
											type="button"
										>
											{t("Nx:Save Draft")}
										</Button>
									)}
									{!schema?.pages && (
										<div className="ui-form__buttonGroup">
											{/* {buttons?.reset?.hidden ? null : (
								<Button
									type="reset"
									onClick={resetForm}
									{...baseStyles?.resetButton}
									disabled={isLoading}
								>
									{buttons?.reset?.text || t("Nx:Reset")}
								</Button>
							)} */}

											<Button
												type="submit"
												disabled={isLoading}
												className="group"
												variant="gradient"
												{...baseStyles?.submitButton}
												data-testid="webform-submit-button"
											>
												{isLoading ? (
													<span className="h-5 w-5 animate-spin cursor-wait rounded-full border-b-2 border-l-2 border-white group-hover:border-primary"></span>
												) : (
													buttons?.actions?.actions?.text || t("Nx:Submit")
												)}
											</Button>
										</div>
									)}
								</React.Fragment>
							)}
						</form>
					</>
				)}
			</FormProvider>
		</ErrorBoundary>
	)
}
