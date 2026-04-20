import React, { useMemo } from "react"
import parse from "html-react-parser"

export const config = {
	id: "vactory_dynamic_block:dynamic_block",
	lazy: false,
}

/**
 * Error boundary to catch rendering errors from dynamic components.
 * Replaces try/catch around JSX per React best practices.
 */
class WidgetErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error }
	}

	componentDidCatch(err) {
		console.error(this.props.logPrefix || "Component error:", err)
	}

	render() {
		if (this.state.hasError) {
			const message =
				this.state.error instanceof Error
					? this.state.error.message
					: "An unexpected error occurred"
			return (
				<div className="rounded-xl border-2 border-red-300 bg-red-100 p-6 text-red-900">
					<div className="mb-3 text-lg font-bold">
						⚠️ {this.props.title || "Component Error"}
					</div>
					<div className="mb-3 rounded bg-red-50 p-3 font-mono text-sm">{message}</div>
					{this.props.tip && (
						<div className="text-xs text-red-700">
							<strong>Tip:</strong> {this.props.tip}
						</div>
					)}
				</div>
			)
		}
		return this.props.children
	}
}

/**
 * Recursively render a structure tree using React.createElement
 */
function renderStructure(structure) {
	if (!structure) return null

	// Handle text nodes
	if (typeof structure === "string") {
		return structure
	}

	const { type, props = {}, children = [] } = structure

	// Recursively render children
	const renderedChildren = children.map((child, index) => {
		if (typeof child === "string") {
			return child
		}
		return <React.Fragment key={index}>{renderStructure(child)}</React.Fragment>
	})

	return React.createElement(type, props, ...renderedChildren)
}

/** UI shown when component creation fails (e.g. syntax error in user code) */
function HydrateCreationError({ message }) {
	return (
		<div className="rounded-xl border-2 border-red-300 bg-red-100 p-6 text-red-900">
			<div className="mb-3 text-lg font-bold">⚠️ Component Error</div>
			<div className="mb-3 rounded bg-red-50 p-3 font-mono text-sm">{message}</div>
			<div className="text-xs text-red-700">
				<strong>Tip:</strong> Make sure your component code is valid and doesn&apos;t
				reference undefined variables.
			</div>
		</div>
	)
}

/**
 * Hydrate an interactive component from code.
 * - useMemo ensures the component is not re-created on every render.
 * - WidgetErrorBoundary catches errors that occur during rendering.
 */
function HydratedComponent({ hydrateData }) {
	const { Component, creationError } = useMemo(() => {
		try {
			const componentFactory = new Function(
				"React",
				`
				const { useState, useEffect, useRef, useMemo, useCallback } = React;
				
				${hydrateData.code}
				
				return ${hydrateData.componentName};
			`
			)
			return { Component: componentFactory(React), creationError: null }
		} catch (err) {
			console.error("Failed to hydrate component:", err)
			const message = err instanceof Error ? err.message : "Failed to load component"
			return { Component: null, creationError: message }
		}
	}, [hydrateData.code, hydrateData.componentName])

	if (creationError) {
		return <HydrateCreationError message={creationError} />
	}

	return (
		<WidgetErrorBoundary
			logPrefix="Failed to render hydrated component:"
			title="Component Error"
			tip="Make sure your component code is valid and doesn't reference undefined variables."
		>
			<Component {...hydrateData.props} />
		</WidgetErrorBoundary>
	)
}

/**
 * Render HTML content using html-react-parser
 */
function HTMLContent({ content, blockId, css }) {
	const encodedCSS = css ? encodeURIComponent(css) : ""

	return (
		<div className={`jsx-block-${blockId || "default"}`}>
			{css && (
				<link rel="stylesheet" href={`data:text/css;charset=utf-8,${encodedCSS}`} />
			)}
			{parse(content)}
		</div>
	)
}

/**
 * Render JSX structure (interactive or static)
 */
function JSXContent({ structure, blockId, css }) {
	const encodedCSS = css ? encodeURIComponent(css) : ""

	// Check if this is a HYDRATE component (interactive)
	if (structure?.type === "HYDRATE") {
		return (
			<div className={`jsx-block-${blockId || "default"}`}>
				{css && (
					<link rel="stylesheet" href={`data:text/css;charset=utf-8,${encodedCSS}`} />
				)}
				<HydratedComponent hydrateData={structure} />
			</div>
		)
	}

	// Otherwise, render static structure
	const element = renderStructure(structure)

	return (
		<div className={`jsx-block-${blockId || "default"}`}>
			{css && (
				<link rel="stylesheet" href={`data:text/css;charset=utf-8,${encodedCSS}`} />
			)}
			{element}
		</div>
	)
}

/**
 * Main JSX Widget Component
 * Renders custom JSX/HTML blocks created in the admin console
 *
 * Supports two content types:
 * - type: "HTML" - renders raw HTML content using dangerouslySetInnerHTML
 * - type: "JSX" - renders JSX structure tree or hydrated interactive components
 */
/** Safely parse JSON content, returning null on failure */
function safeJsonParse(content) {
	try {
		return JSON.parse(content)
	} catch (err) {
		console.error("Failed to parse JSX widget content:", err)
		return null
	}
}

const JsxWidget = (data) => {
	// Extract widget data - it's already an object, not a JSON string
	const widgetData = data?.data?.components?.[0]?.block

	if (!widgetData) {
		return null
	}

	const { blockId, content, css, type, structure } = widgetData

	// Handle HTML type - render raw HTML content
	if (type === "HTML") {
		if (!content) {
			return null
		}
		return (
			<WidgetErrorBoundary logPrefix="Failed to render JSX widget:" title="Widget Error">
				<HTMLContent content={content} blockId={blockId} css={css} />
			</WidgetErrorBoundary>
		)
	}

	// Handle JSX type - render structure tree or hydrated component
	if (type === "JSX" || structure) {
		const jsxStructure = structure || (content ? safeJsonParse(content) : null)
		if (!jsxStructure) {
			return null
		}
		return (
			<WidgetErrorBoundary logPrefix="Failed to render JSX widget:" title="Widget Error">
				<JSXContent structure={jsxStructure} blockId={blockId} css={css} />
			</WidgetErrorBoundary>
		)
	}

	// Fallback: if no type specified but content exists, try to render as HTML
	if (content) {
		return (
			<WidgetErrorBoundary logPrefix="Failed to render JSX widget:" title="Widget Error">
				<HTMLContent content={content} blockId={blockId} css={css} />
			</WidgetErrorBoundary>
		)
	}

	return null
}

export default JsxWidget
