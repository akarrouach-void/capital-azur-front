import { useAccount, useI18n } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import duration from "dayjs/plugin/duration"
import "dayjs/locale/fr"
import "dayjs/locale/ar"
import { Button, Icon, Link, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Transition,
} from "@headlessui/react"

export const useProject = (projectData) => {
	const { isAuthenticated, profile } = useAccount()
	const [userData, setUserData] = useState({})
	useEffect(() => {
		if (isAuthenticated) {
			const uuid = profile?.user.uuid
			fetchUserData(uuid)
		}
		if (window.localStorage.getItem("mon-projet")) {
			const userData = JSON.parse(window.localStorage.getItem("mon-projet"))
			setUserData(userData)
		} else {
			if (window.localStorage.getItem("videoask")) {
				console.log("videoask")
			}
		}
	}, [isAuthenticated])

	const fetchUserData = (uuid) => {
		drupal
			.fetch(`project-progress/get?uuid=${uuid}`)
			.then(async (res) => {
				if (res.ok) {
					const parsed = JSON.parse(res.data.projectData)
					setUserData(parsed)
					syncUserDataCoeff(projectData, parsed)
					window.localStorage.setItem("mon-projet", res.data.projectData)
				}
			})
			.catch((err) => console.error(err.message))
	}

	const syncUserDataCoeff = (projectData, userData) => {
		let userDataItems = Object.keys(userData)
		let changedCategories = userDataItems.filter(function (element) {
			return userData[element]?.total_coeff
		})
		projectData?.map((category) => {
			if (changedCategories.includes(category.key)) {
				let newCoeff = 0
				category.steps.map((item) => {
					newCoeff += userData?.[item.key]?.completed ? item.coefficient : 0
				})
				setUserData({
					...userData,
					[category.key]: {
						...userData[category.key],
						total_coeff: newCoeff,
					},
				})
			}
		})
	}

	const postToBackend = (data) => {
		drupal
			.fetch("project-progress/post", {
				method: "POST",
				body: JSON.stringify(data),
				noProxy: true,
				withAuth: true,
			})
			.then(() => console.log("data has been saved"))
			.catch((err) => console.error(err.message))
	}

	const changeSelection = (categoryIndex, itemIndex, isCompleted) => {
		const stepKey = projectData[categoryIndex].steps[itemIndex].key
		const categKey = projectData[categoryIndex].key

		let newTotal = userData?.[categKey]?.total_coeff || 0
		if (isCompleted) {
			newTotal += projectData[categoryIndex].steps[itemIndex].coefficient
			newTotal = newTotal > 100 ? 100 : newTotal
		} else {
			newTotal -= projectData[categoryIndex].steps[itemIndex].coefficient
			newTotal = newTotal < 0 ? 0 : newTotal
			// @TODO delete unselected objects
		}

		const updatedUserData = {
			...userData,
			[categKey]: {
				...userData[categKey],
				total_coeff: newTotal,
			},
			[stepKey]: {
				...userData[stepKey],
				completed: isCompleted,
			},
		}
		setUserData(updatedUserData)
		const userDataString = JSON.stringify(updatedUserData)
		window.localStorage.setItem("mon-projet", userDataString)
		console.log("outside if statement updatedUserData", updatedUserData)
		//update user field
		if (isAuthenticated) {
			console.log("outside if statement updatedUserData", updatedUserData)
			const uuid = profile?.user.uuid
			postToBackend({ data: userDataString, uuid: uuid })
		}
	}

	const isInitialized = projectData.some((cat) =>
		cat.steps.some((step) => userData[step.key]?.completed)
	)

	const getNextStepTags = (categoryIndex) => {
		const step = projectData?.[categoryIndex].steps.find(
			(step) => userData[step.key]?.completed !== true
		)
		return step?.tags || []
	}

	return {
		userData,
		getNextStepTags,
		changeSelection,
		isInitialized,
	}
}

const MonProjet = (props) => {
	const { projectData } = props
	const { userData, changeSelection } = useProject(projectData)
	const [active, setActive] = useState(0)
	const { activeLocale: language } = useI18n()
	const dayjsLocale = language === "ar" ? "ar-ma" : language
	dayjs.locale(dayjsLocale)
	dayjs.extend(duration)

	if (!projectData.length) {
		return <></>
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:gap-6">
			<div className="shadow-1 rounded-xl bg-white p-8">
				<Points {...{ userData, projectData, active, setActive }} />
				<hr className="my-5 border-opacity-10" />
				<PointProgress {...{ userData, point: projectData[active] }} />
				<hr className="mt-5 border-opacity-10" />
				<PointCheckList
					{...{
						projectData,
						userData,
						steps: projectData[active].steps,
						changeSelection,
						active,
					}}
				/>
			</div>
		</div>
	)
}

const PointCheckList = (props) => {
	const { userData, steps, changeSelection, active } = props
	const { t } = useI18n()
	return (
		<ul className="divide-y divide-black/10 border-b border-black/10">
			{steps.map((step, index) => {
				const completed = userData?.[step.key]?.completed || false
				return (
					<Disclosure key={step.key + "-?#" + index} as="li">
						{({ open }) => (
							<>
								<div className="flex items-start p-2.5 text-sm leading-tight">
									<input
										type="checkbox"
										className="border-trueGray-400 checked:bg-feedback-success checked:border-feedback-success mt-0.5 cursor-pointer rounded ltr:mr-2.5 rtl:ml-2.5"
										onChange={(e) => {
											changeSelection(active, index, e.target.checked)
											// dlpush({
											// 		event: "creation_projet_avancement",
											// 		phase: projectData[active].name,
											// 		etape: step.label,
											// 		validated: e.target.checked,
											// });
										}}
										checked={completed}
									/>
									<label className="sr-only" htmlFor={`check-${step.key}`}>
										{t("Mark as done")}
									</label>
									<DisclosureButton
										className="flex flex-1 ltr:text-left rtl:text-right"
										id={`check-${step.key}`}
									>
										<span className="cursor-pointer font-bold ltr:mr-2.5 rtl:ml-2.5">
											{step.label}
										</span>
										<span className="sr-only">{t("Lire les details")}</span>
										<Icon
											name="chevron-down"
											className={vclsx(
												open && "rotate-180 transform",
												"mt-1 h-3 w-3 flex-none ltr:ml-auto rtl:mr-auto"
											)}
										/>
									</DisclosureButton>
								</div>
								<Transition
									enter="transition duration-500 ease-out"
									enterFrom="scale-95 opacity-0"
									leave="transition duration-200 ease-out"
									leaveTo="scale-95 opacity-0"
								>
									<DisclosurePanel className="px-3 py-2">
										<Wysiwyg
											skipProcess={true}
											className="text-sm leading-tight"
											html={step.description}
										/>
										{(step.lien1 || step.lien2) && (
											<div className="mt-5 flex flex-col items-start">
												{step?.lien1?.url && (
													<Link
														href={step.lien1.url}
														className="mb-2 rounded-full border-2 border-primary bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-primary"
													>
														{step.lien1?.title}
													</Link>
												)}
												{step?.lien2?.url && (
													<Link
														href={step.lien2.url}
														className="mb-2 rounded-full border-2 border-primary bg-white px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white"
													>
														{step.lien2?.title}
													</Link>
												)}
											</div>
										)}
									</DisclosurePanel>
								</Transition>
							</>
						)}
					</Disclosure>
				)
			})}
		</ul>
	)
}

export const PointProgress = (props) => {
	const { userData, point } = props
	const total_coeff = userData?.[point.key]?.total_coeff || 0
	const { t } = useI18n()
	return (
		<div>
			<p className="text-sm font-bold">{point.title}</p>
			<div className="shadow-track bg-trueGray-200 my-2 h-1.5 grow overflow-hidden rounded-full">
				<div
					className="from-secondary to-secondary/70 h-full w-0 bg-gradient-to-r transition ease-in-out"
					style={{ width: `${total_coeff}%` }}
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={total_coeff}
				></div>
			</div>
			<span className="block text-sm font-bold ltr:text-right rtl:text-left">
				{total_coeff}%
			</span>
			{point.formatted_text && total_coeff === 100 && (
				<div className="bg-feedback-success/20 rounded-lg p-5">
					<h4 className="mb-3 flex items-center gap-2">
						<Icon
							id="valid-mark"
							className="bg-feedback-success h-5 w-5 rounded-full p-1 text-white"
						/>
						<span className="text-sm font-bold">{t("Étape finalisée")}</span>
					</h4>
					<Wysiwyg skipProcess={true} className="text-sm" html={point.formatted_text} />
				</div>
			)}
		</div>
	)
}

const isOverflown = ({ clientWidth, scrollWidth }) => {
	return scrollWidth > clientWidth
}

const Points = (props) => {
	const { userData, projectData, active, setActive } = props
	const scrollContainer = React.useRef(null)
	const [showArrows, setShowArrows] = React.useState(false)
	const { t } = useI18n()
	const scroll = (dir) => {
		// dir: 1 = right, -1 = left
		const scrollLeft = scrollContainer.current.scrollLeft
		const width = scrollContainer.current.firstElementChild.clientWidth

		scrollContainer.current.scroll({
			left: scrollLeft + width * dir,
			behavior: "smooth",
		})
	}

	useEffect(() => {
		const showHideArrows = () => {
			if (!scrollContainer.current) return

			if (isOverflown(scrollContainer.current)) {
				setShowArrows(true)
			}
		}
		showHideArrows()
		window.addEventListener("resize", showHideArrows)
		return () => window.removeEventListener("resize", showHideArrows)
	}, [])

	if (projectData?.length === 0) return null

	return (
		<div>
			<h3 className="mb-2 text-lg font-bold">{t("Le point sur mon projet")}</h3>
			<div className="relative">
				{showArrows && (
					<Button
						icon="arrow-left"
						extraClassNames="absolute ltr:-left-9 rtl:-right-9 top-1/2 -translate-y-1/2"
						onClick={() => scroll(-1)}
					/>
				)}
				<div
					ref={scrollContainer}
					className="dd-snap flex justify-between space-x-1 overflow-x-auto py-3 rtl:space-x-reverse"
				>
					{projectData.map((item, index) => {
						const total_coeff = userData?.[item.key]?.total_coeff || 0
						return (
							<div
								onClick={() => setActive(index)}
								onKeyDown={(e) => {
									e.key === "Enter" && setActive(index)
								}}
								role="button"
								tabIndex={0}
								key={item.key}
								className={vclsx(
									"border-true-200 relative box-content w-20 shrink-0 cursor-pointer border p-5 text-center",
									active === index && "bg-secondary bg-opacity-20",
									active !== index && total_coeff === 0 && "grayscale",
									"hover:bg-secondary rounded-lg hover:bg-opacity-20"
								)}
							>
								<span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-2 text-xs font-bold text-white">
									{index + 1}
								</span>
								<Icon id={item.picto} className="mx-auto h-9 w-9" />
								<span for="idee-progress" className="text-2xs font-bold">
									{item.name}
								</span>
								<div className="flex items-center">
									<div className="shadow-track bg-trueGray-200 h-1.5 grow overflow-hidden rounded-full">
										<div
											className={vclsx(
												"h-full w-0 transition ease-in-out",
												total_coeff === 100 && "bg-success-600",
												total_coeff < 100 &&
													"from-secondary to-secondary/70 bg-gradient-to-r"
											)}
											style={{ width: `${total_coeff}%` }}
											role="progressbar"
											aria-valuemin="0"
											aria-valuemax="100"
											aria-valuenow={total_coeff}
										></div>
									</div>
									<span className="text-2xs font-bold ltr:ml-1 rtl:mr-1">
										{total_coeff}%
									</span>
								</div>
								{/* {total_coeff === 0 && (
								<div className="text-primary text-2xs font-bold underline hover:no-underline">
									{t("Commencer")}
									<Icon
										name="chevron-right"
										className="inline-block mx-1 rtl:-scale-x-100 h-1.5 w-1.5"
										width="5"
										height="5"
										style={{ strokeWidth: "20%" }}
									/>
								</div>
							)} */}
							</div>
						)
					})}
				</div>
				{showArrows && (
					<Button
						icon="arrow-right"
						extraClassNames=" absolute ltr:-right-9 rtl:-left-9 top-1/2 -translate-y-1/2"
						onClick={() => scroll(1)}
					/>
				)}
			</div>
		</div>
	)
}

export default MonProjet
