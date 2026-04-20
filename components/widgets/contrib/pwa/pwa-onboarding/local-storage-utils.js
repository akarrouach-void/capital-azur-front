// localStorageUtils.js
export const saveStepsToLocalStorage = (stepsObject) => {
	if (typeof stepsObject !== "object" || Array.isArray(stepsObject)) {
		console.error("Invalid input: expected an object")
		return
	}

	try {
		const serializedSteps = JSON.stringify(stepsObject)
		localStorage.setItem("onbording", serializedSteps)
	} catch (error) {
		console.error("Error saving steps results to localStorage:", error)
	}
}

export const getStepsFromLocalStorage = () => {
	try {
		const serializedSteps = localStorage.getItem("videoask")
		if (serializedSteps === null) {
			return {}
		}
		return JSON.parse(serializedSteps)
	} catch (error) {
		console.error("Error retrieving steps results from localStorage:", error)
		return {}
	}
}

export const saveOnBoardingStatusLocalStorage = (value) => {
	try {
		localStorage.setItem("onboadred", value)
	} catch (error) {
		console.error("Error saving onBoarding status", error)
	}
}

export const getOnBoardingStatusLocaleStorage = () => {
	try {
		const onBoardingStatut = localStorage.getItem("onboadred")

		return onBoardingStatut
	} catch (error) {
		console.error("Error retrieving on boarding status from localeStorage", error)
	}

	return null
}
