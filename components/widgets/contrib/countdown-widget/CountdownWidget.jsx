import React, { useState, useEffect } from "react"
import { Button, Icon, Link, Text, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:89",
}

const Countdown = ({ intro, date, link }) => {
	const day = 0
	const month = 0

	const { t } = useI18n()

	// State for toggling modal in mobile
	const [toggleModal, setToggleModal] = useState(false)

	// State for countdown units
	const [countdownUnits, setCountdownUnits] = useState([
		{ labelLg: t("Nx:days"), labelSm: t("Nx:d"), value: 0 },
		{ labelLg: t("Nx:hours"), labelSm: t("Nx:h"), value: 0 },
		{ labelLg: t("Nx:minutes"), labelSm: t("Nx:m"), value: 0 },
		{ labelLg: t("Nx:seconds"), labelSm: t("Nx:s"), value: 0 },
	])

	// State for countdown status
	const [isCounting, setIsCounting] = useState(true)

	// Get current year
	const currentYear = new Date().getFullYear()

	useEffect(() => {
		const countdown = () => {
			const dateAtm = new Date()
			let givingDate = new Date(date)

			if (dateAtm > givingDate) {
				givingDate = new Date(currentYear + 1, month - 1, day)
			}

			if (dateAtm.getFullYear() === givingDate.getFullYear() + 1) {
				givingDate = new Date(currentYear, month - 1, day)
			}

			const currentTime = dateAtm.getTime()
			const givingDateTime = givingDate.getTime()

			const timeRemaining =
				givingDateTime >= currentTime ? givingDateTime - currentTime : 0

			let seconds = Math.floor(timeRemaining / 1000)
			let minutes = Math.floor(seconds / 60)
			let hours = Math.floor(minutes / 60)
			let days = Math.floor(hours / 24)

			seconds %= 60
			minutes %= 60
			hours %= 24

			setCountdownUnits([
				{ labelLg: t("Nx:days"), labelSm: t("Nx:d"), value: days },
				{ labelLg: t("Nx:hours"), labelSm: t("Nx:h"), value: hours },
				{ labelLg: t("Nx:minutes"), labelSm: t("Nx:m"), value: minutes },
				{ labelLg: t("Nx:seconds"), labelSm: t("Nx:s"), value: seconds },
			])

			timeRemaining === 0 ? setIsCounting(false) : setIsCounting(true)
		}

		const intervalId = setInterval(() => {
			if (isCounting) {
				countdown()
			}
		}, 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [currentYear, date, isCounting, day, month])

	return (
		<>
			{isCounting && !toggleModal && (
				<>
					<div
						className={vclsx(
							"fixed left-0 right-0 top-1/2 z-50 mx-auto flex w-[90%] -translate-y-1/2 flex-col items-stretch rounded-lg bg-white shadow-xl md:w-fit md:max-w-[80%] md:flex-row lg:left-0",
							toggleModal
								? "left-4 h-[70px] w-auto justify-end overflow-hidden rounded"
								: "justify-between"
						)}
					>
						<button
							className="absolute -top-10 right-0 flex items-center rounded-lg bg-white p-2"
							onClick={() => setToggleModal(true)}
						>
							<Icon id="x" className="h-4 w-4 text-black" />
						</button>
						<div className={vclsx(toggleModal ? "hidden" : "p-4 md:p-5 lg:p-8")}>
							{intro && intro}
							<div className="grid grid-cols-2 gap-4 rounded-md md:flex md:justify-between md:gap-0 lg:gap-3 lg:text-black">
								{countdownUnits.map((unit, index) => (
									<div
										key={index}
										className="flex items-center rounded-md bg-gray-50 p-8 shadow lg:flex-1 lg:flex-col"
									>
										<Text as="span" className="text-2xl font-bold lg:text-5xl">
											{unit.value}
										</Text>
										<Text as="span" className="text-2xl font-bold lg:hidden">
											{unit.labelSm}
										</Text>
										<Text as="span" className="hidden text-sm lg:inline-block">
											{unit.labelLg}
										</Text>
									</div>
								))}
							</div>
							<div className="mt-8 flex flex-col justify-center gap-5 md:flex-row md:justify-between">
								<div className="flex items-center justify-center text-black">
									<Icon id="calendar" width="30" height="30" />
									<Text as="span" className="ml-4 w-fit">
										Fin: {date}
									</Text>
								</div>
								{link.href && (
									<div className="block">
										<Button variant="gradient" className="mx-auto w-fit">
											<Link {...link}>{link.title}</Link>
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="fixed left-0 top-0 z-40 h-screen w-screen bg-black/40"></div>
				</>
			)}
		</>
	)
}

const CountdownContainer = ({ data }) => {
	const props = {
		intro: data?.components?.[0]?.intro?.value?.["#text"] ? (
			<Wysiwyg
				className="max-lg::text-center mx-auto mb-5 w-fit lg:mb-6 lg:text-black"
				html={data?.components?.[0]?.intro?.value?.["#text"]}
			/>
		) : null,
		date: data?.components[0]?.date,
		link: {
			href: data?.components?.[0]?.link?.url || null,
			title: data?.components?.[0]?.link?.title,
			id: data?.components?.[0]?.link?.attributes?.id,
			rel: data?.components?.[0]?.link?.attributes?.rel,
			target: data?.components?.[0]?.link?.attributes?.target || "_self",
			className: data?.components?.[0]?.link?.attributes?.class,
		},
	}

	return <Countdown {...props} />
}

export default CountdownContainer
