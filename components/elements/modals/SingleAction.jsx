import { Transition } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { Button } from "../button/Button"
import { modal } from "./theme"

export const SingleActionModal = ({
	body,
	actionHandler,
	actionLabel,
	isOpen,
	variant = "default",
}) => {
	return (
		<div className={`${vclsx(modal[variant].wrapper)} ${isOpen ? "fixed" : "hidden"}`}>
			<div className={modal[variant].container}>
				<Transition
					show={isOpen}
					timeout={{
						enter: 300,
						exit: 200,
					}}
					enter={modal[variant].background.animation.enter}
					enterFrom={modal[variant].background.animation.enterFrom}
					enterTo={modal[variant].background.animation.enterTo}
					leave={modal[variant].background.animation.leave}
					leaveFrom={modal[variant].background.animation.leaveFrom}
					leaveTo={modal[variant].background.animation.leaveTo}
				>
					<div className={modal[variant].background.wrapper} aria-hidden="true">
						<div className={modal[variant].background.container}></div>
					</div>
				</Transition>
				<Transition
					show={isOpen}
					timeout={{
						enter: 300,
						exit: 200,
					}}
					enter={modal[variant].modal.animation.enter}
					enterFrom={modal[variant].modal.animation.enterFrom}
					enterTo={modal[variant].modal.animation.enterTo}
					leaveFrom={modal[variant].modal.animation.leaveFrom}
					leaveTo={modal[variant].modal.animation.leaveTo}
				>
					<dialog
						className={`${modal[variant].modal.wrapper} ${
							isOpen ? "inline-block" : "hidden"
						}`}
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<div>{body}</div>
						{actionLabel && (
							<div className={modal[variant].modal.buttonContainer}>
								<Button
									onClick={actionHandler}
									className={modal[variant].modal.button}
									variant="gradient"
								>
									{actionLabel}
								</Button>
							</div>
						)}
					</dialog>
				</Transition>
			</div>
		</div>
	)
}
