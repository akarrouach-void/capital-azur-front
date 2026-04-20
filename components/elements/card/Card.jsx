import { vclsx } from "@vactorynext/core/utils"
import { Badge } from "../badge/Badge"
import { Heading } from "../heading/Heading"
import { Link } from "../link/Link"
import { Text } from "../text/Text"
import { card } from "./theme"

const Card = ({
	variant = "default",
	title,
	excerpt,
	image,
	urlTag,
	url,
	urlContent,
	className,
	category,
	...props
}) => {
	return (
		<div
			className={vclsx(card.default.wrapper, card[variant].wrapper, className)}
			{...props}
		>
			<div className={vclsx(card.default.image, card[variant].image, "overflow-hidden")}>
				{image}
			</div>
			<div className={vclsx(card[variant].body, url && "group")}>
				{url && <Link href={url} className="absolute left-0 top-0 h-full w-full"></Link>}
				{category && (
					<div className={card[variant].tag}>
						<Badge text={category} href={urlTag || null} size="normal" />
					</div>
				)}
				{url ? (
					<Link href={url} className="block">
						<>
							{title && (
								<Heading
									level={3}
									variant={5}
									className={vclsx(card.default.title, card[variant].title)}
								>
									{title}
								</Heading>
							)}
							{excerpt && (
								<Text
									as="p"
									className={vclsx(card.default.excerpt, card[variant].excerpt)}
								>
									{excerpt}
								</Text>
							)}
						</>
					</Link>
				) : (
					<div>
						{title && (
							<Heading
								level={3}
								variant={5}
								className={vclsx(card.default.title, card[variant].title)}
							>
								{title}
							</Heading>
						)}
						{excerpt && (
							<Text as="p" className={vclsx(card.default.excerpt, card[variant].excerpt)}>
								{excerpt}
							</Text>
						)}
					</div>
				)}

				{url && urlContent && (
					<div className={card[variant].link}>
						<Link href={url} variant="permalink">
							{urlContent}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export { Card }
