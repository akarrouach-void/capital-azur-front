import React from "react"
import PropTypes from "prop-types"
import debounce from "lodash.debounce"
import memoize from "lodash.memoize"
import reduce from "lodash.reduce"
import startsWith from "lodash.startswith"
import classNames from "classnames"
import "./utils/prototypes"

import CountryData from "./CountryData.js"

export class PhoneInput extends React.Component {
	static propTypes = {
		country: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		value: PropTypes.string,

		onlyCountries: PropTypes.arrayOf(PropTypes.string),
		preferredCountries: PropTypes.arrayOf(PropTypes.string),
		excludeCountries: PropTypes.arrayOf(PropTypes.string),

		placeholder: PropTypes.string,
		searchPlaceholder: PropTypes.string,
		searchNotFound: PropTypes.string,
		disabled: PropTypes.bool,

		containerStyle: PropTypes.object,
		inputStyle: PropTypes.object,
		buttonStyle: PropTypes.object,
		dropdownStyle: PropTypes.object,
		searchStyle: PropTypes.object,

		containerClass: PropTypes.string,
		inputClass: PropTypes.string,
		buttonClass: PropTypes.string,
		dropdownClass: PropTypes.string,
		searchClass: PropTypes.string,
		// for styled-components
		className: PropTypes.string,

		autoFormat: PropTypes.bool,

		enableAreaCodes: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.arrayOf(PropTypes.string),
		]),
		enableTerritories: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.arrayOf(PropTypes.string),
		]),

		disableCountryCode: PropTypes.bool,
		disableDropdown: PropTypes.bool,
		enableLongNumbers: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
		countryCodeEditable: PropTypes.bool,
		enableSearch: PropTypes.bool,
		disableSearchIcon: PropTypes.bool,
		disableInitialCountryGuess: PropTypes.bool,
		disableCountryGuess: PropTypes.bool,

		regions: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),

		inputProps: PropTypes.object,
		localization: PropTypes.object,
		masks: PropTypes.object,
		areaCodes: PropTypes.object,

		preserveOrder: PropTypes.arrayOf(PropTypes.string),

		defaultMask: PropTypes.string,
		alwaysDefaultMask: PropTypes.bool,
		prefix: PropTypes.string,
		copyNumbersOnly: PropTypes.bool,
		renderStringAsFlag: PropTypes.string,
		autocompleteSearch: PropTypes.bool,
		jumpCursorToEnd: PropTypes.bool,
		priority: PropTypes.object,
		enableAreaCodeStretch: PropTypes.bool,
		enableClickOutside: PropTypes.bool,
		showDropdown: PropTypes.bool,

		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		onClick: PropTypes.func,
		onKeyDown: PropTypes.func,
		onEnterKeyPress: PropTypes.func,
		onMount: PropTypes.func,
		isValid: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
		defaultErrorMessage: PropTypes.string,
		specialLabel: PropTypes.string,
		flagsImagePath: PropTypes.string,
		keys: PropTypes.object,
	}

	static defaultProps = {
		country: "",
		value: "",

		onlyCountries: [],
		preferredCountries: [],
		excludeCountries: [],

		placeholder: "1 (702) 123-4567",
		searchPlaceholder: "search",
		searchNotFound: "No entries to show",
		flagsImagePath: "./flags.png",
		disabled: false,

		containerStyle: {},
		inputStyle: {},
		buttonStyle: {},
		dropdownStyle: {},
		searchStyle: {},

		containerClass: "",
		inputClass: "",
		buttonClass: "",
		dropdownClass: "",
		searchClass: "",
		className: "",

		autoFormat: true,
		enableAreaCodes: false,
		enableTerritories: false,
		disableCountryCode: false,
		disableDropdown: false,
		enableLongNumbers: false,
		countryCodeEditable: true,
		enableSearch: false,
		disableSearchIcon: false,
		disableInitialCountryGuess: false,
		disableCountryGuess: false,

		regions: "",

		inputProps: {},
		localization: {},

		masks: null,
		priority: null,
		areaCodes: null,

		preserveOrder: [],

		defaultMask: ". .. .. .. .. .. .. ..", // prefix+dialCode+' '+defaultMask
		alwaysDefaultMask: false,
		prefix: "+",
		copyNumbersOnly: true,
		renderStringAsFlag: "",
		autocompleteSearch: false,
		jumpCursorToEnd: true,
		enableAreaCodeStretch: false,
		enableClickOutside: true,
		showDropdown: false,

		isValid: true, // (value, selectedCountry, onlyCountries, hiddenAreaCodes) => true | false | 'Message'
		defaultErrorMessage: "",
		specialLabel: "Phone",

		onEnterKeyPress: null, // null or function

		keys: {
			UP: 38,
			DOWN: 40,
			RIGHT: 39,
			LEFT: 37,
			ENTER: 13,
			ESC: 27,
			PLUS: 43,
			A: 65,
			Z: 90,
			SPACE: 32,
			TAB: 9,
		},
	}

	constructor(props) {
		super(props)
		const { onlyCountries, preferredCountries, hiddenAreaCodes } = new CountryData(props)

		const inputNumber = props.value ? props.value.replace(/\D/g, "") : ""

		let countryGuess
		if (props.disableInitialCountryGuess) {
			countryGuess = 0
		} else if (inputNumber.length > 1) {
			// Country detect by phone
			countryGuess =
				this.guessSelectedCountry(
					inputNumber.substring(0, 6),
					props.country,
					onlyCountries,
					hiddenAreaCodes
				) || 0
		} else if (props.country) {
			// Default country
			countryGuess = onlyCountries.find((o) => o.iso2 == props.country) || 0
		} else {
			// Empty params
			countryGuess = 0
		}

		let dialCode = ""
		if (
			inputNumber.length < 2 &&
			countryGuess &&
			!startsWith(inputNumber, countryGuess.dialCode)
		) {
			dialCode = countryGuess.dialCode
		}

		let formattedNumber
		if (inputNumber === "" && countryGuess === 0) {
			formattedNumber = ""
		} else {
			const numberToFormat = (props.disableCountryCode ? "" : dialCode) + inputNumber
			const countryData = countryGuess.name ? countryGuess : undefined
			formattedNumber = this.formatNumber(numberToFormat, countryData)
		}

		const highlightCountryIndex = onlyCountries.findIndex((o) => o == countryGuess)

		this.state = {
			showDropdown: props.showDropdown,

			formattedNumber,
			onlyCountries,
			preferredCountries,
			hiddenAreaCodes,
			selectedCountry: countryGuess,
			highlightCountryIndex,

			queryString: "",
			freezeSelection: false,
			debouncedQueryStingSearcher: debounce(this.searchCountry, 250),
			searchValue: "",
		}
	}

	componentDidMount() {
		if (document.addEventListener && this.props.enableClickOutside) {
			document.addEventListener("mousedown", this.handleClickOutside)
		}
		if (this.props.onMount) {
			this.props.onMount(
				this.state.formattedNumber.replace(/\D/g, ""),
				this.getCountryData(),
				this.state.formattedNumber
			)
		}
	}

	componentWillUnmount() {
		if (document.removeEventListener && this.props.enableClickOutside) {
			document.removeEventListener("mousedown", this.handleClickOutside)
		}
	}

	//componentDidUpdate(prevProps, prevState, snapshot) {
	componentDidUpdate(prevProps) {
		if (prevProps.country !== this.props.country) {
			this.updateCountry(this.props.country)
		} else if (prevProps.value !== this.props.value) {
			this.updateFormattedNumber(this.props.value)
		}
	}

	getProbableCandidate = memoize((queryString) => {
		if (!queryString || queryString.length === 0) {
			return null
		}
		// don't include the preferred countries in search
		const probableCountries = this.state.onlyCountries.filter((country) => {
			return startsWith(country.name.toLowerCase(), queryString.toLowerCase())
		}, this)
		return probableCountries[0]
	})

	guessSelectedCountry = memoize(
		(inputNumber, country, onlyCountries, hiddenAreaCodes) => {
			// if enableAreaCodes == false, try to search in hidden area codes to detect area code correctly
			// then search and insert main country which has this area code
			// https://github.com/bl00mber/react-phone-input-2/issues/201
			if (this.props.enableAreaCodes === false) {
				let mainCode
				hiddenAreaCodes.some((country) => {
					if (startsWith(inputNumber, country.dialCode)) {
						onlyCountries.some((o) => {
							if (country.iso2 === o.iso2 && o.mainCode) {
								mainCode = o
								return true
							}
						})
						return true
					}
				})
				if (mainCode) return mainCode
			}

			const secondBestGuess = onlyCountries.find((o) => o.iso2 == country)
			if (inputNumber.trim() === "") return secondBestGuess

			const bestGuess = onlyCountries.reduce(
				(selectedCountry, country) => {
					if (startsWith(inputNumber, country.dialCode)) {
						if (country.dialCode.length > selectedCountry.dialCode.length) {
							return country
						}
						if (
							country.dialCode.length === selectedCountry.dialCode.length &&
							country.priority < selectedCountry.priority
						) {
							return country
						}
					}
					return selectedCountry
				},
				{ dialCode: "", priority: 10001 },
				this
			)

			if (!bestGuess.name) return secondBestGuess
			return bestGuess
		}
	)

	// Hooks for updated props
	updateCountry = (country) => {
		const { onlyCountries } = this.state
		let newSelectedCountry
		if (country.indexOf(0) >= "0" && country.indexOf(0) <= "9") {
			// digit
			newSelectedCountry = onlyCountries.find((o) => o.dialCode == +country)
		} else {
			newSelectedCountry = onlyCountries.find((o) => o.iso2 == country)
		}
		if (newSelectedCountry?.dialCode) {
			this.setState({
				selectedCountry: newSelectedCountry,
				formattedNumber: this.props.disableCountryCode
					? ""
					: this.formatNumber(newSelectedCountry.dialCode, newSelectedCountry),
			})
		}
	}

	updateFormattedNumber(value) {
		if (value === null) return this.setState({ selectedCountry: 0, formattedNumber: "" })

		const { onlyCountries, selectedCountry, hiddenAreaCodes } = this.state
		const { country, prefix } = this.props

		if (value === "") return this.setState({ selectedCountry, formattedNumber: "" })

		let inputNumber = value.replace(/\D/g, "")
		let newSelectedCountry, formattedNumber

		// if new value start with selectedCountry.dialCode, format number, otherwise find newSelectedCountry
		if (selectedCountry && startsWith(value, prefix + selectedCountry.dialCode)) {
			formattedNumber = this.formatNumber(inputNumber, selectedCountry)
			this.setState({ formattedNumber })
		} else {
			if (this.props.disableCountryGuess) {
				newSelectedCountry = selectedCountry
			} else {
				newSelectedCountry =
					this.guessSelectedCountry(
						inputNumber.substring(0, 6),
						country,
						onlyCountries,
						hiddenAreaCodes
					) || selectedCountry
			}
			const dialCode =
				newSelectedCountry &&
				startsWith(inputNumber, prefix + newSelectedCountry.dialCode)
					? newSelectedCountry.dialCode
					: ""

			formattedNumber = this.formatNumber(
				(this.props.disableCountryCode ? "" : dialCode) + inputNumber,
				newSelectedCountry || undefined
			)
			this.setState({ selectedCountry: newSelectedCountry, formattedNumber })
		}
	}

	// View methods
	scrollTo = (country, middle) => {
		if (!country) return
		const container = this.dropdownRef
		if (!container || !document.body) return

		const containerHeight = container.offsetHeight
		const containerOffset = container.getBoundingClientRect()
		const containerTop = containerOffset.top + document.body.scrollTop
		const containerBottom = containerTop + containerHeight

		const element = country
		const elementOffset = element.getBoundingClientRect()

		const elementHeight = element.offsetHeight
		const elementTop = elementOffset.top + document.body.scrollTop
		const elementBottom = elementTop + elementHeight

		let newScrollTop = elementTop - containerTop + container.scrollTop
		const middleOffset = containerHeight / 2 - elementHeight / 2

		if (
			this.props.enableSearch ? elementTop < containerTop + 32 : elementTop < containerTop
		) {
			// scroll up
			if (middle) {
				newScrollTop -= middleOffset
			}
			container.scrollTop = newScrollTop
		} else if (elementBottom > containerBottom) {
			// scroll down
			if (middle) {
				newScrollTop += middleOffset
			}
			const heightDifference = containerHeight - elementHeight
			container.scrollTop = newScrollTop - heightDifference
		}
	}

	scrollToTop = () => {
		const container = this.dropdownRef
		if (!container || !document.body) return
		container.scrollTop = 0
	}

	// Helper method to get the pattern for formatting
	getFormattingPattern = (country, disableCountryCode, enableAreaCodeStretch) => {
		const { format } = country

		if (disableCountryCode) {
			const pattern = format.split(" ")
			pattern.shift()
			return pattern.join(" ")
		}

		if (enableAreaCodeStretch && country.isAreaCode) {
			const pattern = format.split(" ")
			pattern[1] = pattern[1].replace(/\.+/, "".padEnd(country.areaCodeLength, "."))
			return pattern.join(" ")
		}

		return format
	}

	// Helper method to format text based on pattern
	applyPattern = (text, pattern) => {
		const formattedObject = reduce(
			pattern,
			(acc, character) => {
				if (acc.remainingText.length === 0) {
					return acc
				}

				if (character !== ".") {
					return {
						formattedText: acc.formattedText + character,
						remainingText: acc.remainingText,
					}
				}

				const [head, ...tail] = acc.remainingText

				return {
					formattedText: acc.formattedText + head,
					remainingText: tail,
				}
			},
			{
				formattedText: "",
				remainingText: text.split(""),
			}
		)
		return formattedObject
	}

	formatNumber = (text, country) => {
		if (!country) return text

		const { disableCountryCode, enableAreaCodeStretch, enableLongNumbers, autoFormat } =
			this.props

		const pattern = this.getFormattingPattern(
			country,
			disableCountryCode,
			enableAreaCodeStretch
		)

		if (!text || text.length === 0) {
			return disableCountryCode ? "" : this.props.prefix
		}

		// for all strings with length less than 2, just return it (1, 2 etc.)
		// also return the same text if the selected country has no fixed format
		if ((text && text.length < 2) || !pattern || !autoFormat) {
			return disableCountryCode ? text : this.props.prefix + text
		}

		const formattedObject = this.applyPattern(text, pattern)

		let formattedNumber
		if (enableLongNumbers) {
			formattedNumber =
				formattedObject.formattedText + formattedObject.remainingText.join("")
		} else {
			formattedNumber = formattedObject.formattedText
		}

		// Always close brackets
		if (formattedNumber.includes("(") && !formattedNumber.includes(")"))
			formattedNumber += ")"
		return formattedNumber
	}

	// Put the cursor to the end of the input (usually after a focus event)
	cursorToEnd = () => {
		const input = this.numberInputRef
		if (document.activeElement != input) return
		input.focus()
		let len = input.value.length
		if (input.value.charAt(len - 1) === ")") len = len - 1
		input.setSelectionRange(len, len)
	}

	getElement = (index) => {
		return this[`flag_no_${index}`]
	}

	// return country data from state
	getCountryData = () => {
		if (!this.state.selectedCountry) return {}
		return {
			name: this.state.selectedCountry.name || "",
			dialCode: this.state.selectedCountry.dialCode || "",
			countryCode: this.state.selectedCountry.iso2 || "",
			format: this.state.selectedCountry.format || "",
		}
	}

	handleFlagDropdownClick = (e) => {
		e.preventDefault()
		if (!this.state.showDropdown && this.props.disabled) return
		const { preferredCountries, onlyCountries, selectedCountry } = this.state
		const allCountries = this.concatPreferredCountries(preferredCountries, onlyCountries)

		const highlightCountryIndex = allCountries.findIndex(
			(o) => o.dialCode === selectedCountry.dialCode && o.iso2 === selectedCountry.iso2
		)

		this.setState(
			(prevState) => ({
				showDropdown: !prevState.showDropdown,
				highlightCountryIndex,
			}),
			() => {
				if (this.state.showDropdown) {
					this.scrollTo(this.getElement(this.state.highlightCountryIndex))
				}
			}
		)
	}

	// Helper methods for handleInput to reduce cognitive complexity
	validateCountryCodeEditable = (value, newSelectedCountry) => {
		if (!this.props.countryCodeEditable) {
			const { prefix } = this.props
			const mainCode = newSelectedCountry.hasAreaCodes
				? this.state.onlyCountries.find(
						(o) => o.iso2 === newSelectedCountry.iso2 && o.mainCode
					).dialCode
				: newSelectedCountry.dialCode

			const updatedInput = prefix + mainCode
			return value.slice(0, updatedInput.length) === updatedInput
		}
		return true
	}

	shouldExceedLengthLimit = (value) => {
		const digitCount = value.replace(/\D/g, "").length
		if (digitCount <= 15) return false

		if (this.props.enableLongNumbers === false) return true
		if (typeof this.props.enableLongNumbers === "number") {
			return digitCount > this.props.enableLongNumbers
		}
		return false
	}

	processInputNumber = (inputNumber, newFreezeSelection, selectedCountry) => {
		const { country } = this.props
		const { onlyCountries, hiddenAreaCodes } = this.state
		let newSelectedCountry = selectedCountry

		if (
			!newFreezeSelection ||
			(!!selectedCountry && selectedCountry.dialCode.length > inputNumber.length)
		) {
			if (this.props.disableCountryGuess) {
				newSelectedCountry = selectedCountry
			} else {
				newSelectedCountry =
					this.guessSelectedCountry(
						inputNumber.substring(0, 6),
						country,
						onlyCountries,
						hiddenAreaCodes
					) || selectedCountry
			}
		}

		return newSelectedCountry
	}

	handleCaretPosition = (e, formattedNumber, oldFormattedText, onChange) => {
		const oldCaretPosition = e.target.selectionStart
		let caretPosition = e.target.selectionStart
		const diff = formattedNumber.length - oldFormattedText.length

		if (diff > 0) {
			caretPosition = caretPosition - diff
		}

		const lastChar = formattedNumber.charAt(formattedNumber.length - 1)

		if (lastChar === ")") {
			this.numberInputRef.setSelectionRange(
				formattedNumber.length - 1,
				formattedNumber.length - 1
			)
		} else if (caretPosition > 0 && oldFormattedText.length >= formattedNumber.length) {
			this.numberInputRef.setSelectionRange(caretPosition, caretPosition)
		} else if (oldCaretPosition < oldFormattedText.length) {
			this.numberInputRef.setSelectionRange(oldCaretPosition, oldCaretPosition)
		}

		if (onChange) {
			onChange(
				formattedNumber.replace(/\D/g, ""),
				this.getCountryData(),
				e,
				formattedNumber
			)
		}
	}

	handleInput = (e) => {
		const { value } = e.target
		const { prefix, onChange } = this.props

		let formattedNumber = this.props.disableCountryCode ? "" : prefix

		// Get state values through setState to avoid direct state access
		this.setState(
			(prevState) => {
				let newSelectedCountry = prevState.selectedCountry
				let newFreezeSelection = prevState.freezeSelection

				// Validation checks
				if (!this.validateCountryCodeEditable(value, newSelectedCountry)) return prevState

				if (value === prefix) {
					if (onChange) onChange("", this.getCountryData(), e, "")
					return { formattedNumber: "" }
				}

				if (this.shouldExceedLengthLimit(value)) return prevState

				if (value === prevState.formattedNumber) return prevState

				// IE hack
				if (e.preventDefault) {
					e.preventDefault()
				} else {
					e.returnValue = false
				}

				if (onChange) e.persist()

				if (value.length > 0) {
					const inputNumber = value.replace(/\D/g, "")
					newSelectedCountry = this.processInputNumber(
						inputNumber,
						newFreezeSelection,
						prevState.selectedCountry
					)
					newFreezeSelection = false
					formattedNumber = this.formatNumber(inputNumber, newSelectedCountry)
					newSelectedCountry = newSelectedCountry.dialCode
						? newSelectedCountry
						: prevState.selectedCountry
				}

				return {
					formattedNumber,
					freezeSelection: newFreezeSelection,
					selectedCountry: newSelectedCountry,
				}
			},
			() => {
				if (value.length > 0) {
					this.handleCaretPosition(
						e,
						formattedNumber,
						this.state.formattedNumber,
						onChange
					)
				}
			}
		)
	}

	handleInputClick = (e) => {
		this.setState({ showDropdown: false })
		if (this.props.onClick) this.props.onClick(e, this.getCountryData())
	}

	handleDoubleClick = (e) => {
		const len = e.target.value.length
		e.target.setSelectionRange(0, len)
	}

	handleFlagItemClick = (country, e) => {
		this.setState(
			(prevState) => {
				const currentSelectedCountry = prevState.selectedCountry
				const newSelectedCountry = prevState.onlyCountries.find((o) => o == country)
				if (!newSelectedCountry) return prevState

				const unformattedNumber = prevState.formattedNumber
					.replace(" ", "")
					.replace("(", "")
					.replace(")", "")
					.replace("-", "")
				const newNumber =
					unformattedNumber.length > 1
						? unformattedNumber.replace(
								currentSelectedCountry.dialCode,
								newSelectedCountry.dialCode
							)
						: newSelectedCountry.dialCode
				const formattedNumber = this.formatNumber(
					newNumber.replace(/\D/g, ""),
					newSelectedCountry
				)

				return {
					showDropdown: false,
					selectedCountry: newSelectedCountry,
					freezeSelection: true,
					formattedNumber,
					searchValue: "",
				}
			},
			() => {
				this.cursorToEnd()
				if (this.props.onChange) {
					const formattedNumber = this.state.formattedNumber
					this.props.onChange(
						formattedNumber.replace(/\D/g, ""),
						this.getCountryData(),
						e,
						formattedNumber
					)
				}
			}
		)
	}

	handleInputFocus = (e) => {
		// if the input is blank, insert dial code of the selected country
		if (this.numberInputRef) {
			this.setState(
				(prevState) => {
					if (
						this.numberInputRef.value === this.props.prefix &&
						prevState.selectedCountry &&
						!this.props.disableCountryCode
					) {
						const dialCode = prevState.selectedCountry.dialCode
						return {
							formattedNumber: this.props.prefix + dialCode,
							placeholder: "",
						}
					}
					return { placeholder: "" }
				},
				() => {
					this.props.jumpCursorToEnd && setTimeout(this.cursorToEnd, 0)
				}
			)
		} else {
			this.setState({ placeholder: "" })
		}

		typeof this.props.onFocus === "function" &&
			this.props.onFocus(e, this.getCountryData())
		this?.props?.jumpCursorToEnd && setTimeout(this.cursorToEnd, 0)
	}

	handleInputBlur = (e) => {
		if (!e.target.value) this.setState({ placeholder: this.props.placeholder })
		typeof this.props.onBlur === "function" && this.props.onBlur(e, this.getCountryData())
	}

	handleInputCopy = (e) => {
		if (!this.props.copyNumbersOnly) return
		const text = window.getSelection().toString().replace(/\D/g, "")
		e.clipboardData.setData("text/plain", text)
		e.preventDefault()
	}

	searchCountry = () => {
		const probableCandidate =
			this.getProbableCandidate(this.state.queryString) || this.state.onlyCountries[0]
		const probableCandidateIndex =
			this.state.onlyCountries.findIndex((o) => o == probableCandidate) +
			this.state.preferredCountries.length

		this.scrollTo(this.getElement(probableCandidateIndex), true)

		this.setState(() => ({
			queryString: "",
			highlightCountryIndex: probableCandidateIndex,
		}))
	}

	handleInputKeyDown = (e) => {
		const { keys, onEnterKeyPress, onKeyDown } = this.props
		if (e.which === keys.ENTER) {
			if (onEnterKeyPress) onEnterKeyPress(e)
		}
		if (onKeyDown) onKeyDown(e)
	}

	handleClickOutside = (e) => {
		if (this.dropdownRef && !this.dropdownContainerRef.contains(e.target)) {
			this.state.showDropdown && this.setState({ showDropdown: false })
		}
	}

	handleSearchChange = (e) => {
		const {
			currentTarget: { value: searchValue },
		} = e
		const { preferredCountries, selectedCountry } = this.state
		let highlightCountryIndex = 0

		if (searchValue === "" && selectedCountry) {
			const { onlyCountries } = this.state
			highlightCountryIndex = this.concatPreferredCountries(
				preferredCountries,
				onlyCountries
			).findIndex((o) => o == selectedCountry)
			// wait asynchronous search results re-render, then scroll
			setTimeout(() => this.scrollTo(this.getElement(highlightCountryIndex)), 100)
		}
		this.setState({ searchValue, highlightCountryIndex })
	}

	concatPreferredCountries = (preferredCountries, onlyCountries) => {
		if (preferredCountries.length > 0) {
			return [...new Set(preferredCountries.concat(onlyCountries))]
		} else {
			return onlyCountries
		}
	}

	getDropdownCountryName = (country) => {
		return country.localName || country.name
	}

	getSearchFilteredCountries = () => {
		const { preferredCountries, onlyCountries, searchValue } = this.state
		const { enableSearch } = this.props
		const allCountries = this.concatPreferredCountries(preferredCountries, onlyCountries)
		const sanitizedSearchValue = searchValue.trim().toLowerCase().replace("+", "")
		if (enableSearch && sanitizedSearchValue) {
			// [...new Set()] to get rid of duplicates
			// firstly search by iso2 code
			if (/^\d+$/.test(sanitizedSearchValue)) {
				// contains digits only
				// values wrapped in ${} to prevent undefined
				return allCountries.filter(({ dialCode }) =>
					[`${dialCode}`].some((field) =>
						field.toLowerCase().includes(sanitizedSearchValue)
					)
				)
			} else {
				const iso2countries = allCountries.filter(({ iso2 }) =>
					[`${iso2}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue))
				)
				// || '' - is a fix to prevent search of 'undefined' strings
				// Since all the other values shouldn't be undefined, this fix was accepte
				// but the structure do not looks very good
				const searchedCountries = allCountries.filter(({ name, localName /*, iso2*/ }) =>
					[`${name}`, `${localName || ""}`].some((field) =>
						field.toLowerCase().includes(sanitizedSearchValue)
					)
				)
				this.scrollToTop()
				return [...new Set([].concat(iso2countries, searchedCountries))]
			}
		} else {
			return allCountries
		}
	}

	getCountryDropdownList = () => {
		const { preferredCountries, highlightCountryIndex, showDropdown, searchValue } =
			this.state
		const { disableDropdown, prefix } = this.props
		const {
			enableSearch,
			searchNotFound,
			disableSearchIcon,
			searchClass,
			searchStyle,
			searchPlaceholder,
			autocompleteSearch,
		} = this.props

		const searchedCountries = this.getSearchFilteredCountries()

		let countryDropdownList = searchedCountries.map((country, index) => {
			const highlight = highlightCountryIndex === index
			const itemClasses = classNames({
				country: true,
				preferred: country.iso2 === "us" || country.iso2 === "gb",
				active: country.iso2 === "us",
				highlight,
				"w-full text-left": true,
			})

			// Activate this to show the flags
			// const inputFlagClasses = `flag ${country.iso2}`

			return (
				<li
					ref={(el) => (this[`flag_no_${index}`] = el)}
					key={`${country.iso2}_${country.dialCode}_${index}`}
					data-flag-key={`flag_no_${index}`}
					data-dial-code="1"
					data-country-code={country.iso2}
				>
					<button
						className={itemClasses}
						type="button"
						tabIndex={disableDropdown ? "-1" : "0"}
						onClick={(e) => this.handleFlagItemClick(country, e)}
						onKeyDown={(e) => this.handleFlagItemClick(country, e)}
					>
						<span className="country-name">{this.getDropdownCountryName(country)}</span>
						<span className="dial-code">
							{country.format
								? this.formatNumber(country.dialCode, country)
								: prefix + country.dialCode}
						</span>
					</button>
				</li>
			)
		})

		const dashedLi = <li key={"dashes"} className="divider" />
		// let's insert a dashed line in between preffered countries and the rest
		preferredCountries.length > 0 &&
			(!enableSearch || (enableSearch && !searchValue.trim())) &&
			countryDropdownList.splice(preferredCountries.length, 0, dashedLi)

		const dropDownClasses = classNames({
			"country-list": true,
			hide: !showDropdown,
			[this.props.dropdownClass]: true,
		})

		return (
			<ul
				ref={(el) => {
					!enableSearch && el?.focus()
					this.dropdownRef = el
					return el
				}}
				className={dropDownClasses}
				style={this.props.dropdownStyle}
			>
				{enableSearch && (
					<li
						className={classNames({
							search: true,
							[searchClass]: searchClass,
						})}
					>
						{!disableSearchIcon && (
							<span
								className={classNames({
									"search-emoji": true,
									[`${searchClass}-emoji`]: searchClass,
								})}
								aria-label="Magnifying glass"
							>
								🔍
							</span>
						)}
						<input
							className={classNames({
								"search-box": true,
								[`${searchClass}-box`]: searchClass,
							})}
							style={searchStyle}
							type="search"
							placeholder={searchPlaceholder}
							autoComplete={autocompleteSearch ? "on" : "off"}
							value={searchValue}
							onChange={this.handleSearchChange}
						/>
					</li>
				)}
				{countryDropdownList.length > 0 ? (
					countryDropdownList
				) : (
					<li className="no-entries-message">
						<span>{searchNotFound}</span>
					</li>
				)}
			</ul>
		)
	}

	// Helper methods for render to reduce cognitive complexity
	processValidation = () => {
		const { formattedNumber, selectedCountry, onlyCountries, hiddenAreaCodes } =
			this.state
		const { isValid, defaultErrorMessage } = this.props

		let isValidValue, errorMessage

		if (typeof isValid === "boolean") {
			isValidValue = isValid
		} else {
			const isValidProcessed = isValid(
				formattedNumber.replace(/\D/g, ""),
				selectedCountry,
				onlyCountries,
				hiddenAreaCodes
			)
			if (typeof isValidProcessed === "boolean") {
				isValidValue = isValidProcessed
				if (isValidValue === false) errorMessage = defaultErrorMessage
			} else {
				// typeof === 'string'
				isValidValue = false
				errorMessage = isValidProcessed
			}
		}

		return { isValidValue, errorMessage }
	}

	buildClassNames = (isValidValue) => {
		const { showDropdown } = this.state

		return {
			containerClasses: classNames({
				[this.props.containerClass]: true,
				"react-tel-input": true,
			}),
			inputClasses: classNames({
				"form-control": true,
				"invalid-number": !isValidValue,
				open: showDropdown,
				[this.props.inputClass]: true,
			}),
			selectedFlagClasses: classNames({
				"selected-flag": true,
				open: showDropdown,
				"flex items-center": true,
			}),
			flagViewClasses: classNames({
				"flag-dropdown": true,
				"invalid-number": !isValidValue,
				open: showDropdown,
				[this.props.buttonClass]: true,
				"!rounded-l-md": true,
			}),
		}
	}

	renderInputElement = (inputClasses) => {
		const { formattedNumber } = this.state

		return (
			<input
				className={inputClasses}
				style={this.props.inputStyle}
				onChange={this.handleInput}
				onClick={this.handleInputClick}
				onDoubleClick={this.handleDoubleClick}
				onFocus={this.handleInputFocus}
				onBlur={this.handleInputBlur}
				onCopy={this.handleInputCopy}
				value={formattedNumber}
				onKeyDown={this.handleInputKeyDown}
				placeholder={this.props.placeholder}
				disabled={this.props.disabled}
				type="tel"
				id={this.props.id}
				{...this.props.inputProps}
				ref={(el) => {
					this.numberInputRef = el
					if (typeof this.props.inputProps.ref === "function") {
						this.props.inputProps.ref(el)
					} else if (typeof this.props.inputProps.ref === "object") {
						this.props.inputProps.ref.current = el
					}
				}}
			/>
		)
	}

	renderFlagSection = (flagViewClasses, selectedFlagClasses) => {
		const { selectedCountry, showDropdown } = this.state
		const { disableDropdown, renderStringAsFlag } = this.props

		return (
			<div
				className={flagViewClasses}
				style={this.props.buttonStyle}
				ref={(el) => (this.dropdownContainerRef = el)}
			>
				{renderStringAsFlag ? (
					<div className={selectedFlagClasses}>test{renderStringAsFlag}</div>
				) : (
					<button
						type="button"
						onClick={disableDropdown ? undefined : this.handleFlagDropdownClick}
						onKeyDown={disableDropdown ? undefined : this.handleFlagDropdownClick}
						className={selectedFlagClasses}
						title={
							selectedCountry
								? `${selectedCountry.localName || selectedCountry.name}: + ${
										selectedCountry.dialCode
									}`
								: ""
						}
						tabIndex={disableDropdown ? "-1" : "0"}
						aria-haspopup="listbox"
						aria-expanded={showDropdown ? true : undefined}
					>
						<div className={""}>
							{!disableDropdown && (
								<div className={"arrowClasses"}>{selectedCountry.iso2}</div>
							)}
						</div>
					</button>
				)}

				{showDropdown && this.getCountryDropdownList()}
			</div>
		)
	}

	render() {
		const { specialLabel } = this.props
		const { isValidValue, errorMessage } = this.processValidation()
		const { containerClasses, inputClasses, selectedFlagClasses, flagViewClasses } =
			this.buildClassNames(isValidValue)

		return (
			<div
				className={`${containerClasses} ${this.props.className}`}
				style={this.props.style || this.props.containerStyle}
			>
				{specialLabel && <div className="special-label">{specialLabel}</div>}
				{errorMessage && <div className="invalid-number-message">{errorMessage}</div>}
				{this.renderInputElement(inputClasses)}
				{this.renderFlagSection(flagViewClasses, selectedFlagClasses)}
			</div>
		)
	}
}
