import { Fragment } from "react"
import { useAccount, useI18n } from "@vactorynext/core/hooks"
import { Icon, Link, Button, Text, Avatar } from "@/ui"
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"
import Cookies from "js-cookie"

export const UserInfo = () => {
	const { t } = useI18n()
	const { signOut, loginUrl, accountUrl, profile, isAuthenticated } = useAccount()

	if (isAuthenticated) {
		return <UserMenu data={profile} accountUrl={accountUrl} signOut={signOut} />
	}

	return (
		<>
			<Button
				variant="gradient"
				href={loginUrl}
				icon={<Icon id="user" className="h-5 w-5" />}
			>
				{t("Nx:Sign in")}
			</Button>
		</>
	)
}

const UserMenu = ({ data, signOut, accountUrl }) => {
	const userNavigation = [
		{ name: "Settings", href: accountUrl, icon: "control-panel" },
		{
			name: "Sign out",
			href: "#.",
			icon: "chevron-right",
			onClick: () => {
				signOut().then(() => {
					Cookies.remove("isAuth")
				})
			},
		},
	]

	return (
		<Menu as="div" className="relative inline-block">
			<MenuButton className="animate group relative flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-md md:p-1">
				<Text as="span" className="sr-only">
					Open user menu
				</Text>
				{data.user?.avatar ? (
					<Avatar
						src={data.user.avatar}
						size="normal"
						alt="Me"
						className="ring-2 ring-white"
					/>
				) : (
					<Avatar variant="placeholder" size="normal" className="ring-2 ring-white" />
				)}
				<Text as="span" className="text-sm font-medium text-gray-700 md:hidden">
					{data.user.full_name}
				</Text>
			</MenuButton>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="transform opacity-0 scale-95 translate-y-1"
				enterTo="transform opacity-100 scale-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="transform opacity-100 scale-100 translate-y-0"
				leaveTo="transform opacity-0 scale-95 translate-y-1"
			>
				<MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl bg-white shadow-lg">
					{/* User Info Header */}
					<div className="bg-gray-50 px-4 py-3">
						<div className="flex items-center">
							{data.user?.avatar ? (
								<Avatar
									src={data.user.avatar}
									size="small"
									alt="Me"
									className="ring-2 ring-white"
								/>
							) : (
								<Avatar
									variant="placeholder"
									size="small"
									className="ring-2 ring-white"
								/>
							)}
							<div className="ml-3">
								<Text as="p" className="text-sm font-medium text-gray-900">
									{data.user.full_name}
								</Text>
								<Text as="p" className="text-xs text-gray-500">
									{data.user.email || "user@example.com"}
								</Text>
							</div>
						</div>
					</div>

					{/* Menu Items */}
					<div className="py-1">
						{userNavigation?.map((item) => (
							<MenuItem key={item.name}>
								{({ active }) => (
									<Link href={item?.href}>
										<div
											onClick={item?.onClick}
											onKeyDown={(e) => e.key === "Enter" && item?.onClick}
											role="button"
											tabIndex={0}
											className={vclsx(
												"group flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150",
												active
													? "bg-blue-50 text-blue-700"
													: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
											)}
										>
											<Icon
												id={item.icon}
												className={vclsx(
													"mr-3 h-4 w-4 transition-colors duration-150",
													active
														? "text-blue-600"
														: "text-gray-400 group-hover:text-gray-500"
												)}
											/>
											{item.name}
										</div>
									</Link>
								)}
							</MenuItem>
						))}
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	)
}
