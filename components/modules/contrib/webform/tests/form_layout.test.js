import "@testing-library/jest-dom"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { Form } from "../components/Form"
import { FormProvider, useForm } from "react-hook-form"
import { StyleCtx } from "@vactorynext/core/webform"
import { useEffect } from "react"

// Test wrapper with cleanup
const FormWrapper = ({ children }) => {
	const methods = useForm({
		defaultValues: {},
		mode: "onSubmit",
	})

	// Cleanup form on unmount
	useEffect(() => {
		return () => {
			methods.reset()
		}
	}, [])

	return (
		<StyleCtx.Provider value={{}}>
			<FormProvider {...methods}>{children}</FormProvider>
		</StyleCtx.Provider>
	)
}

// Mock cleanup to ensure tests exit properly
afterEach(() => {
	jest.clearAllMocks()
})

// Schema fragments for different field types
const mockSchemaForText = {
	name: {
		validation: { required: true },
		default_value: "admin",
		type: "text",
		label: "Your Name",
		class: "NameItemClass",
		wrapperClass: "NameWrapperClass",
		attributes: {
			class: ["NameItemClass"],
		},
		isMultiple: false,
	},
}

const mockSchemaForTextArea = {
	message: {
		type: "textArea",
		label: "Message",
		isMultiple: false,
	},
}

const mockSchemaForSelect = {
	test_select: {
		type: "select",
		label: "test select",
		options: [
			{ value: "Option 1", label: "Option 1" },
			{ value: "Option 2", label: "Option 2" },
			{ value: "Option 3", label: "Option 3" },
		],
		isMultiple: false,
	},
}

const mockSchemaForCheckboxes = {
	test_check: {
		type: "checkboxes",
		label: "Test check",
		options: [
			{ value: "Option 1", label: "Option 1" },
			{ value: "Option 2", label: "Option 2" },
			{ value: "Option 3", label: "Option 3" },
		],
		isMultiple: false,
	},
}

const mockSchemaForEmail = {
	email: {
		default_value: "admin@void.fr",
		type: "text",
		label: "Your Email",
		isMultiple: false,
		validation: {
			pattern: "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$/i",
			patternError: "Le champ Your Email n'est pas valide",
		},
	},
}

const mockSchemaForCheckbox = {
	i_agree_to_terms: {
		validation: {
			required: true,
		},
		type: "checkbox",
		label: "I agree to the terms and conditions",
		isMultiple: false,
	},
}

const mockSchemaConditional = {
	message: {
		type: "textArea",
		label: "Message",
		isMultiple: false,
		states: {
			visible: {
				operator: "and",
				checks: [
					{
						element: "test_check",
						operator: "checked",
						value: "Option 1",
					},
				],
			},
		},
	},
	test_check: {
		type: "checkboxes",
		label: "Test check",
		options: [
			{
				value: "Option 1",
				label: "Option 1",
			},
			{
				value: "Option 2",
				label: "Option 2",
			},
			{
				value: "Option 3",
				label: "Option 3",
			},
		],
		isMultiple: false,
	},
}

describe("Form Field Rendering", () => {
	describe("Text Fields", () => {
		it("renders name field with correct attributes", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForText} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check label
			const label = screen.getByText("Nx:Your Name *")
			expect(label).toBeInTheDocument()

			// Check input field
			const input = screen.getByRole("textbox", { name: /Your Name/i })
			expect(input).toBeInTheDocument()
			expect(input).toHaveValue("admin") // Check default value
			expect(input).toHaveClass("NameItemClass")

			// Check wrapper class
			const wrapper = input.closest(".NameWrapperClass")
			expect(wrapper).toBeInTheDocument()

			// Check accessibility
			expect(input).toHaveAttribute("aria-label", "Nx:Your Name")
		})

		it("renders email field with validation", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForEmail} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check label
			const label = screen.getByText("Nx:Your Email")
			expect(label).toBeInTheDocument()

			// Check input field
			const input = screen.getByRole("textbox", { name: /Your Email/i })
			expect(input).toBeInTheDocument()
			expect(input).toHaveValue("admin@void.fr") // Check default value
			expect(input).toHaveAttribute("type", "text") // Should be text type for email

			// Check accessibility
			expect(input).toHaveAttribute("aria-label", "Nx:Your Email")
		})

		it("validates email - invalid email case", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForEmail} buttons={""} />
					</FormWrapper>
				)
			})

			const form = screen.getByTestId("form")
			const input = screen.getByRole("textbox", { name: /Your Email/i })

			// Test invalid email
			await act(async () => {
				fireEvent.change(input, { target: { value: "invalid-email" } })
				fireEvent.blur(input) // Trigger validation on blur
			})

			// check input new value
			expect(input).toHaveValue("invalid-email")

			await act(async () => {
				fireEvent.submit(form)
			})

			await waitFor(() => {
				const errorMessage = screen.getByTestId("error-message")
				expect(errorMessage).toBeInTheDocument()
			})
		})

		it("validates email - valid email case", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForEmail} buttons={""} />
					</FormWrapper>
				)
			})

			const form = screen.getByTestId("form")
			const input = screen.getByRole("textbox", { name: /Your Email/i })

			// Test valid email
			await act(async () => {
				fireEvent.change(input, { target: { value: "valid@email.com" } })
				fireEvent.blur(input)
			})

			// check input new value
			expect(input).toHaveValue("valid@email.com")

			await act(async () => {
				fireEvent.submit(form)
			})

			await waitFor(() => {
				const errorMessage = screen.queryByTestId("error-message")
				expect(errorMessage).toBeNull()
			})
		})
	})

	describe("TextArea Fields", () => {
		it("renders textarea field correctly", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForTextArea} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check label
			const label = screen.getByText("Nx:Message")
			expect(label).toBeInTheDocument()

			// Check textarea field
			const textarea = screen.getByRole("textbox", { name: /Message/i })
			expect(textarea).toBeInTheDocument()
			expect(textarea.tagName.toLowerCase()).toBe("textarea")

			// Check default rows attribute
			expect(textarea).toHaveAttribute("rows", "3")

			// Check accessibility
			expect(textarea).toHaveAttribute("aria-label", "Nx:Message")
		})
	})

	describe("Select Fields", () => {
		it("renders select field with options", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForSelect} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check label
			const label = screen.getByText("Nx:test select")
			expect(label).toBeInTheDocument()

			// Check select field (it's a button in Headless UI)
			const selectButton = screen.getByRole("button", { name: /test select/i })
			expect(selectButton).toBeInTheDocument()

			// Click the select to show options
			await act(async () => {
				fireEvent.click(selectButton)
			})

			await waitFor(() => {
				const options = screen.getAllByRole("option")
				expect(options).toHaveLength(3)
				expect(options[0]).toHaveTextContent("Option 1")
				expect(options[1]).toHaveTextContent("Option 2")
				expect(options[2]).toHaveTextContent("Option 3")
			})
		})

		it("handles selection changes", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForSelect} buttons={""} />
					</FormWrapper>
				)
			})

			// Get and click the select button
			const selectButton = screen.getByRole("button", { name: /test select/i })

			await act(async () => {
				fireEvent.click(selectButton)
			})

			// Click an option
			const options = screen.getAllByRole("option")
			const option2 = options[1]

			await act(async () => {
				fireEvent.click(option2)
			})

			// Check if selection is updated
			await waitFor(() => {
				const selectButton = screen.getByRole("button", { name: /test select/i })
				expect(selectButton).toHaveTextContent("Option 2")
			})
		})
	})

	describe("Checkbox Fields", () => {
		it("renders single checkbox correctly", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForCheckbox} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check label (with required asterisk)
			const label = screen.getByText("Nx:I agree to the terms and conditions *")
			expect(label).toBeInTheDocument()

			// Check checkbox input
			// eslint-disable-next-line no-unused-vars
			const [checkbox, _] = screen.queryAllByRole("checkbox", {
				name: /I agree to the terms and conditions/i,
			})
			expect(checkbox).toBeInTheDocument()
			expect(checkbox).not.toBeChecked()

			// Check accessibility
			expect(checkbox).toHaveAttribute(
				"aria-label",
				"Nx:I agree to the terms and conditions"
			)
		})

		it("renders checkbox group correctly", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForCheckboxes} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check group label
			const groupLabel = screen.getByText("Nx:Test check")
			expect(groupLabel).toBeInTheDocument()

			// Check all checkboxes in the group
			// Get only checkbox inputs, not the checkbox role divs
			const checkboxInputs = screen
				.getAllByRole("checkbox")
				.filter((el) => el.tagName === "INPUT")
			expect(checkboxInputs).toHaveLength(3)

			// Check individual options
			expect(screen.getByLabelText("Option 1")).toBeInTheDocument()
			expect(screen.getByLabelText("Option 2")).toBeInTheDocument()
			expect(screen.getByLabelText("Option 3")).toBeInTheDocument()

			// Check none are checked by default
			checkboxInputs.forEach((checkbox) => {
				expect(checkbox).not.toBeChecked()
			})
		})

		it("handles checkbox group selections", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaForCheckboxes} buttons={""} />
					</FormWrapper>
				)
			})

			const checkboxInputs = screen
				.getAllByRole("checkbox")
				.filter((el) => el.tagName === "INPUT")

			// Get the parent button elements (since checkboxes are hidden)
			const checkboxButtons = checkboxInputs.map((input) => input.closest("button"))

			// Select first option
			await act(async () => {
				fireEvent.click(checkboxButtons[0])
			})

			await waitFor(() => {
				expect(checkboxInputs[0]).toBeChecked()
				expect(checkboxInputs[1]).not.toBeChecked()
			})

			// Select second option
			await act(async () => {
				fireEvent.click(checkboxButtons[1])
			})

			await waitFor(() => {
				expect(checkboxInputs[0]).toBeChecked()
				expect(checkboxInputs[1]).toBeChecked()
			})

			// Unselect first option
			await act(async () => {
				fireEvent.click(checkboxButtons[0])
			})

			await waitFor(() => {
				expect(checkboxInputs[0]).not.toBeChecked()
				expect(checkboxInputs[1]).toBeChecked()
			})
		})
	})

	describe("Conditional Fields", () => {
		it("renders conditional fields correctly", async () => {
			await act(async () => {
				render(
					<FormWrapper>
						<Form schema={mockSchemaConditional} buttons={""} />
					</FormWrapper>
				)
			})

			// Check form exists
			const form = screen.getByTestId("form")
			expect(form).toBeInTheDocument()

			// Check label (with required asterisk)
			const groupLabel = screen.getByText("Nx:Test check")
			expect(groupLabel).toBeInTheDocument()

			const checkboxInputs = screen
				.getAllByRole("checkbox")
				.filter((el) => el.tagName === "INPUT")
			expect(checkboxInputs).toHaveLength(3)

			// Check individual options
			expect(screen.getByLabelText("Option 1")).toBeInTheDocument()
			expect(screen.getByLabelText("Option 2")).toBeInTheDocument()
			expect(screen.getByLabelText("Option 3")).toBeInTheDocument()

			// check message field is not visible
			let textarea = screen.queryByRole("textbox", { name: /Message/i })
			expect(textarea).not.toBeInTheDocument()

			// Get the parent button elements (since checkboxes are hidden)
			const checkboxButtons = checkboxInputs.map((input) => input.closest("button"))

			// Select first option
			await act(async () => {
				fireEvent.click(checkboxButtons[0])
			})

			await waitFor(() => {
				expect(checkboxInputs[0]).toBeChecked()
				expect(checkboxInputs[1]).not.toBeChecked()
			})

			// check message field is visible
			textarea = screen.getByRole("textbox", { name: /Message/i })
			expect(textarea).toBeInTheDocument()

			// Unselect first option
			await act(async () => {
				fireEvent.click(checkboxButtons[0])
			})

			await waitFor(() => {
				expect(checkboxInputs[0]).not.toBeChecked()
				expect(checkboxInputs[1]).not.toBeChecked()
			})

			// check message field is not visible
			textarea = screen.queryByRole("textbox", { name: /Message/i })
			expect(textarea).not.toBeInTheDocument()
		})
	})
})
