// Set build-time env vars that replace the removed publicRuntimeConfig
process.env.VACTORY_I18N_CONFIG = JSON.stringify({
	default: "en",
	enabled: ["en", "fr"],
	labels: [
		{ code: "en", label: "English" },
		{ code: "fr", label: "Français" },
	],
})
process.env.VACTORY_MENUS_CONFIG = JSON.stringify([
	"main",
	"menu-top",
	"footer",
	"footer-bottom",
])

// Mock next/router
jest.mock("next/router", () => ({
	useRouter: () => ({
		route: "/",
		pathname: "",
		query: {},
		asPath: "",
		push: jest.fn(),
		replace: jest.fn(),
		locale: "en",
	}),
}))

// Mock only essential core hooks
jest.mock("@vactorynext/core/hooks", () => ({
	useI18n: () => ({
		t: (key) => key,
		i18n: {
			activeLocale: "en",
			language: "en",
		},
		activeLocale: "en",
	}),
	useNode: () => ({
		csrfToken: "mock-csrf-token",
	}),
}))

// Mock only API and external service related functions
jest.mock("@vactorynext/core/webform", () => {
	const actual = jest.requireActual("@vactorynext/core/webform")
	return {
		...actual, // Keep real implementations
		useWebformRequest: () =>
			jest.fn().mockImplementation(() => {
				return Promise.resolve({
					success: true,
					data: {
						message: "Form submitted successfully",
					},
				})
			}),
	}
})

// Mock analytics
jest.mock("@vactorynext/core/lib", () => ({
	dlPush: jest.fn(),
}))

// ResizeObserver is used by Headless UI (Listbox, etc.) but not implemented in jsdom
class ResizeObserverMock {
	observe() {
		void 0
	}
	unobserve() {
		void 0
	}
	disconnect() {
		void 0
	}
}
global.ResizeObserver = ResizeObserverMock

// Set up storage mock
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	clear: jest.fn(),
	removeItem: jest.fn(),
}
global.localStorage = localStorageMock
global.sessionStorage = localStorageMock

// Clean up mocks between tests
beforeEach(() => {
	jest.clearAllMocks()
})

// Clean up when all tests are done
afterAll(() => {
	jest.restoreAllMocks()
	// Clear any DOM elements to avoid memory leaks
	if (typeof document !== "undefined") {
		document.body.innerHTML = ""
	}
})
