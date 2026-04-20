import { Fragment } from "react"

import { Transition, Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { dropdown } from "./theme"

export const Dropdown = ({ title, items, icon }) => {
	return (
		<Menu as="div" className={dropdown.wrapper}>
			{({ open }) => (
				<>
					<MenuButton
						className={vclsx(open && dropdown.button.active, dropdown.button.default)}
					>
						<span className={dropdown.title}>{title}</span>
						{icon}
					</MenuButton>
					{open && (
						<Transition
							unmount={false}
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<MenuItems unmount={false} className={dropdown.listWrapper}>
								{items.map((item, index) => {
									return (
										<MenuItem key={item || index}>
											{({ focus }) => (
												<button
													className={vclsx(
														dropdown.listItem.default,
														focus ? dropdown.listItem.active : dropdown.listItem.inactive
													)}
												>
													{item}
												</button>
											)}
										</MenuItem>
									)
								})}
							</MenuItems>
						</Transition>
					)}
				</>
			)}
		</Menu>
	)
}
