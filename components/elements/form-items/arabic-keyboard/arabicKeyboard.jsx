import { useEffect, useRef, useState } from "react"
import { useUpdateEffect } from "@vactorynext/core/hooks"

import { vclsx } from "@vactorynext/core/utils"

const arabicAlphabet = [
	"ا",
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
	"ك",
	"ل",
	"م",
	"ن",
	"ه",
	"و",
	"ي",
	"ة",
	"ى",
	"ء",
	"آ",
	"أ",
	"ؤ",
	"إ",
	"ئ",
]

const numbers = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
	".",
	"-",
	":",
	",",
	"_",
]

export const Keyboard = ({ name, inputRef, inputClass, setValue }) => {
	const keyboardRef = useRef()
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

	const close = () => {
		setIsKeyboardVisible(false)
	}
	const print = (caracter) => {
		const inputValue = inputRef.current.value
		//inputRef.current.value = `${inputValue}${caracter}`
		setValue(name, `${inputValue}${caracter}`)
	}

	const erase = () => {
		const inputValue = inputRef.current.value
		inputRef.current.value = inputValue.substring(0, inputValue.length - 1)
	}

	useEffect(() => {
		let _inputRef = inputRef.current
		const handleInpuClick = () => {
			setIsKeyboardVisible(true)
		}
		_inputRef.addEventListener("click", handleInpuClick, true)
		return () => {
			_inputRef.removeEventListener("click", handleInpuClick, true)
		}
	}, [inputRef])

	useUpdateEffect(() => {
		if (isKeyboardVisible) {
			const handleClickOutside = (e) => {
				if (!keyboardRef.current.contains(e.target)) {
					close()
				}
			}
			document.addEventListener("click", handleClickOutside, true)
			return () => {
				document.removeEventListener("click", handleClickOutside, true)
			}
		}
	}, [isKeyboardVisible])

	useUpdateEffect(() => {
		const handleKeyUp = (e) => {
			if (e.code === "Backspace") {
				erase()
			}
		}

		document.addEventListener("keyup", handleKeyUp)
		return () => {
			document.removeEventListener("keyup", handleKeyUp)
		}
	}, [isKeyboardVisible])

	if (!isKeyboardVisible) return null

	return (
		<div
			ref={keyboardRef}
			className={vclsx(
				"absolute z-50 bg-gray-50 p-3 max-md:hidden",
				inputClass === "keyboard-reversed"
					? "ltr:right-0 rtl:left-0"
					: "ltr:left-0 rtl:right-0"
			)}
		>
			<div className="flex gap-1">
				<div>
					<div
						style={{ gridTemplateColumns: "repeat(9, minmax(3rem, 1fr))" }}
						className="grid w-full gap-1"
					>
						{arabicAlphabet.map((alphabet) => {
							return <KeyboardButton key={alphabet} value={alphabet} onClick={print} />
						})}
					</div>
					<div className="mt-1 flex gap-1">
						<div className="relative w-28">
							<KeyboardButton value={"<"} onClick={erase} />
						</div>
						<div className="relative flex-grow">
							<KeyboardButton value={" "} onClick={print} />
						</div>
					</div>
				</div>
				<div
					style={{ gridTemplateColumns: "repeat(3, minmax(3rem, 1fr))" }}
					className="grid w-full grid-rows-4 gap-1"
				>
					{numbers.map((number) => {
						return <KeyboardButton key={number} value={number} onClick={print} />
					})}
				</div>
			</div>
		</div>
	)
}

const KeyboardButton = ({ value, onClick }) => {
	return (
		<button
			type="button"
			onClick={(e) => {
				onClick(e.target.value)
			}}
			value={value}
			className="relative block h-12 w-full border bg-white"
		>
			{value}
		</button>
	)
}
