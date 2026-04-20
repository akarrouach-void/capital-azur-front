import { Card, Text, Button, Image } from "@/ui"

export const Cards = ({ intro, btn_more, items = [] }) => {
	return (
		<>
			{intro && <Text className="mb-8 text-center"> {intro}</Text>}
			<div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
				{items.map((item) => {
					return (
						<Card
							key={item.id}
							variant="cardPicto"
							title={item.title}
							excerpt={item.description}
							url={item.link_url}
							urlContent={item.link_title}
							image={
								<Image
									{...item.image}
									alt={item.image_alt}
									className="h-full w-full object-cover"
								/>
							}
						/>
					)
				})}
			</div>
			{btn_more?.href && btn_more?.title && (
				<div className="text-center">
					<Button {...btn_more} variant="gradient" className="mx-auto w-fit">
						{btn_more?.title}
					</Button>
				</div>
			)}
		</>
	)
}
