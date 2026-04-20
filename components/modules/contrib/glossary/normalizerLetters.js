export const getLetters = (locale) => {
	if (locale != "ar") {
		return [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z",
		]
	} else {
		return [
			"أ",
			"ب",
			"ت",
			"ث",
			"ج",
			"ح",
			"خ",
			"د",
			"ذ",
			"ر",
			"ز",
			"س",
			"ش",
			"ص",
			"ض",
			"ط",
			"ظ",
			"ع",
			"غ",
			"ف",
			"ق",
			"ک",
			"ل",
			"م",
			"ن",
			"ه",
			"و",
			"ي",
		]
	}
}

const specialChars_ALIF = ["إ", "أ", "آ", "ا"]
const specialChars_K = ["ک", "ك"]

export const getGlossaryFilter = (letter) => {
	if (letter === "أ") {
		return buildFilter(letter, specialChars_ALIF)
	}

	if (letter === "ک") {
		return buildFilter(letter, specialChars_K)
	}

	return buildFilter(letter, [])
}

const buildFilter = (caractere, speciaux = []) => {
	let filters = {}
	if (speciaux.length === 0) {
		filters = {
			"filter[glossary-filter-lettre][condition][path]": "title",
			"filter[glossary-filter-lettre][condition][operator]": "STARTS_WITH",
			"filter[glossary-filter-lettre][condition][value]": caractere,
		}
	} else {
		filters = {
			"filter[title-filter-group][group][conjunction]": "OR",
		}
		let index = 0
		speciaux.map((letter) => {
			let filterCategory = {}
			filterCategory[`filter[glossary-filter-${index}][condition][path]`] = "title"
			filterCategory[`filter[glossary-filter-${index}][condition][operator]`] =
				"STARTS_WITH"
			filterCategory[`filter[glossary-filter-${index}][condition][value]`] = letter
			filterCategory[`filter[glossary-filter-${index}][condition][memberOf]`] =
				"title-filter-group"
			filters = { ...filterCategory, ...filters }
			index++
		})
	}
	return filters
}
