import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { AnswerQuiz } from "./answer-quiz"
import { BgImage } from "./bg-image"
import { BgVideo } from "./bg-video"
import { ButtonQuiz } from "./button-quiz"
import { ExtraButton } from "./extra-button"
import { MultipleChoice } from "./multiple-choice"

export const Screen = ({
	id,
	active,
	content,
	type_response,
	response,
	bgType,
	bgImage,
	bgVideo,
	setScreen,
	extra_button,
	steps,
}) => {
	const enumtypeAnswer = {
		quiz: AnswerQuiz,
		button: ButtonQuiz,
		multiple_choices: MultipleChoice,
	}

	const bgcomponentVariant = {
		video: BgVideo,
		image: BgImage,
		wysiwyg: "div",
	}

	const BgComponent = bgcomponentVariant?.[bgType] || "div" //bgType === "video" ? BgVideo : BgImage
	const AnswerComponent = enumtypeAnswer?.[type_response] || ButtonQuiz

	return (
		<BgComponent
			className={vclsx(
				"min-h-full items-end justify-center",
				active === id ? "flex" : "hidden"
			)}
			bgImage={bgImage}
			bgVideo={bgVideo}
		>
			<div className="w-full px-5 py-5 text-center text-white">
				<div className="mb-5">
					<Wysiwyg html={content} />
				</div>
				<AnswerComponent
					response={response}
					setScreen={setScreen}
					id={id}
					steps={steps}
					extra_button={extra_button}
				/>

				{extra_button?.label &&
					extra_button?.goto &&
					type_response !== "multiple_choices" && (
						<ExtraButton id={id} steps={steps} setScreen={setScreen} {...extra_button} />
					)}
			</div>
		</BgComponent>
	)
}
