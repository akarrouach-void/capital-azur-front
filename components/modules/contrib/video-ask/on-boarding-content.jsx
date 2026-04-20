import { Button, Wysiwyg, Heading, Icon, Image, Container } from "@/ui"

export const OnBoardingContent = ({
	Button_label,
	title,
	icon,
	content,
	image,
	showOnBoarding,
}) => {
	return (
		<Container>
			<div className="my-7 grid grid-cols-1 items-center gap-5 overflow-hidden rounded-lg border border-solid border-primary-500 bg-white py-5 md:grid-cols-2">
				{image?.src && (
					<div>
						<Image {...image} alt={image.alt} />
					</div>
				)}
				<div className="p-4">
					<Heading level="2" variant="4">
						{title}
					</Heading>
					<Icon id={icon} width="24" height="24" />
					<div className="mb-5">
						<Wysiwyg html={content} />
					</div>
					<Button onClick={showOnBoarding}>{Button_label}</Button>
				</div>
			</div>
		</Container>
	)
}
