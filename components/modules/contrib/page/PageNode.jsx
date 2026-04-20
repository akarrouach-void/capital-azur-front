import React from "react"
import {
	ParagraphsController,
	ParagraphWrapper,
	ParagraphToolbox,
} from "@vactorynext/core/paragraphs"
import DF_DEV_MAPPING from "@/runtime/widgets.dev.json"
import { Widgets } from "@/runtime/widgets"
import {
	Accordion,
	Container,
	CustomAnimation,
	Heading,
	Icon,
	Image,
	Tabs,
	Text,
	fadeInRightAnimation,
} from "@/ui"
import { toast } from "react-toastify"

const PageNode = ({ node }) => {
	let Component = Widgets[node?.field_df_sticky?.widget_id]
	return (
		<React.Fragment>
			<div className="vactory-paragrphs-wrapper relative">
				{node?.field_sticky_ancre ? (
					<div className="container flex flex-row">
						<div className="md:basis-3/4">
							{node?.field_vactory_paragraphs?.map((paragraph, index) => (
								<ParagraphsController
									key={paragraph.id}
									data={paragraph}
									DF_DEV_MAPPING={DF_DEV_MAPPING}
									ContainerComponent={Container}
									ImageComponent={Image}
									Widgets={Widgets}
									IconComponent={Icon}
									HeadingComponent={Heading}
									TextComponent={Text}
									TabsComponent={Tabs}
									AccordionComponent={Accordion}
									weight={index}
								/>
							))}
						</div>
						<div className="hidden md:block md:basis-1/4">
							<Component data={JSON.parse(node?.field_df_sticky?.widget_data)} />
						</div>
					</div>
				) : (
					<ParagraphWrapper
						initialParagraphs={node?.field_vactory_paragraphs}
						nid={node.drupal_internal__nid}
						toast={toast}
					>
						{({
							paragraphs,
							handleCopy,
							handlePaste,
							handleDelete,
							handleInsert,
							templates,
							isLiveMode = false,
							showPasteButtons,
						}) => (
							<>
								{paragraphs?.map((paragraph, index) => (
									<React.Fragment key={paragraph.id}>
										{isLiveMode && (
											<ParagraphToolbox
												onHandleCopy={handleCopy}
												onHandlePast={handlePaste}
												onHandleDelete={handleDelete}
												handleInsert={handleInsert}
												props={{
													parent_id: node.drupal_internal__nid,
													pid: paragraph.drupal_internal__id,
													type: paragraph.type,
													weight: index,
													isFirst: index === 0,
													templates,
												}}
												showPasteButtons={showPasteButtons}
											/>
										)}
										<ParagraphsController
											key={paragraph.id}
											data={paragraph}
											DF_DEV_MAPPING={DF_DEV_MAPPING}
											ContainerComponent={Container}
											ImageComponent={Image}
											Widgets={Widgets}
											IconComponent={Icon}
											HeadingComponent={Heading}
											TextComponent={Text}
											TabsComponent={Tabs}
											AccordionComponent={Accordion}
											isAnimated={true}
											AnimationComponent={CustomAnimation}
											animationKeyframe={fadeInRightAnimation}
											weight={index}
										/>
										{isLiveMode && paragraphs?.length === index + 1 && (
											<ParagraphToolbox
												onHandleCopy={handleCopy}
												onHandlePast={handlePaste}
												onHandleDelete={handleDelete}
												handleInsert={handleInsert}
												props={{
													parent_id: node.drupal_internal__nid,
													pid: paragraph.drupal_internal__id,
													type: paragraph.type,
													weight: paragraphs?.length === index + 1 ? index + 1 : index,
													isFirst: false,
													isLast: paragraphs?.length === index + 1,
													templates,
												}}
												showPasteButtons={showPasteButtons}
											/>
										)}
									</React.Fragment>
								))}
							</>
						)}
					</ParagraphWrapper>
				)}
			</div>
		</React.Fragment>
	)
}

export const config = {
	id: "node--vactory_page",
	params: {
		fields: {
			"node--vactory_page":
				"field_vactory_paragraphs,node_bg_image,node_class,node_body_class,node_banner_title,node_banner_image,node_banner_mobile_image,node_banner_description,node_banner_showbreadcrumb,field_sticky_ancre,field_df_sticky,field_live_mode,node_summary",
			"media--image": "thumbnail",
			"file--image": "uri",
			"paragraph--vactory_component":
				"drupal_internal__id,paragraph_section,paragraph_identifier,paragraph_container,field_animation,container_spacing,paragraph_css_class,paragraph_background_color,paragraph_background_image,field_vactory_component,field_vactory_title,field_titre_ancre,field_background_color,field_paragraph_hide_lg,field_paragraph_hide_sm,field_position_image_x,field_position_image_y,field_size_image,field_vactory_flag,field_vactory_flag_2,paragraph_background_parallax",
			"paragraph--vactory_paragraph_multi_template":
				"drupal_internal__id,paragraph_section,paragraph_identifier,paragraph_container,field_animation,container_spacing,paragraph_css_class,paragraph_background_color,paragraph_background_image,field_vactory_component,field_vactory_title,field_titre_ancre,field_paragraph_introduction,field_vactory_paragraph_tab,field_background_color,field_multi_paragraph_type,field_paragraph_hide_lg,field_paragraph_hide_sm,field_position_image_x,field_position_image_y,field_size_image,field_vactory_flag,field_vactory_flag_2,paragraph_background_parallax",
		},
		include:
			"field_vactory_paragraphs,field_vactory_paragraphs.field_vactory_paragraph_tab,field_vactory_paragraphs.paragraph_background_image,field_vactory_paragraphs.paragraph_background_image.thumbnail,node_bg_image,node_bg_image.thumbnail,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default PageNode
