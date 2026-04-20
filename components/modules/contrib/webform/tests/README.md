# Webform Tests

This directory contains test suites for the Webform component using React Testing Library and Jest.

## Overview

The test suite validates the rendering and functionality of various form field types and their behaviors, examples:

- Text fields
- Email fields with validation
- Textarea fields
- Select fields with options
- Checkbox fields (single and groups)
- Conditional field visibility

## Running Tests

To run the tests:

```bash
yarn workspace <workspace-name> test apps/<workspace-name>/components/modules/contrib/webform/tests 
```

This command will execute all the tests in the suite and provide a detailed report of the results.


## Adding New Tests

### 1. Create Mock Schema

First, define a mock schema that represents your form field configuration:

```javascript
const mockSchemaForNewField = {
    fieldName: {
        type: "yourFieldType",
        label: "Your Field Label",
        // Add other necessary properties
        validation: {
            required: true,
            // Other validation rules
        },
        isMultiple: false,
    }
}
```


### 2. Write Test Cases

Follow this pattern to add new tests:

```javascript
describe("Your Field Type", () => {
    it("renders correctly", () => {
        render(
            <FormWrapper>
                <Form schema={mockSchemaForNewField} buttons={""} />
            </FormWrapper>
        )
        // Test field rendering
        const element = screen.getByRole("yourRole")
        expect(element).toBeInTheDocument()
        // Test other aspects
    })
    it("handles user interaction", async () => {
        // Test user interactions
        // Use fireEvent or userEvent
        // Check results with await waitFor()
    })
})
```


## Mocked Dependencies

The test environment includes mocks for:
- next/config
- next/router
- @vactorynext/core hooks
- Local/Session Storage

See `jest.setup.js` for details on mocked implementations.