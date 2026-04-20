export { default, getServerSideProps } from "@vactory/console/admin"
import { Form, RenderField } from "@/form"
import { Badge, Button, Icon } from "@/ui"
import { Layout } from "../../themes/admin/Layout"
import ErrorNode from "components/modules/contrib/error/ErrorNode"
import { addComponent } from "@vactory/console/components-resolver"
addComponent("webform", Form)
addComponent("webformRenderField", RenderField)
addComponent("button", Button)
addComponent("badge", Badge)
addComponent("icon", Icon)
addComponent("_layout", Layout) // This is used to force import of the css file > due to the nature of multi themes.
addComponent("errorNode", ErrorNode)
