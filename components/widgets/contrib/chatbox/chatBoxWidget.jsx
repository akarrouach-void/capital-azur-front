import { useState, useEffect, useRef } from "react"
import { Link } from "@/ui"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"

export const config = {
	id: "vactory_dynamic_search_ai:chatbox",
}

const Chatbox = () => {
	const router = useRouter()
	const locale = router.locale
	const [isChatboxOpen, setIsChatboxOpen] = useState(true)
	const [userInput, setUserInput] = useState("")
	const [messages, setMessages] = useState([])
	const [isReply, setIsReply] = useState(false)
	const chatboxRef = useRef(null)

	useEffect(() => {
		if (chatboxRef.current) {
			chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
		}
	}, [messages])

	const toggleChatbox = () => {
		setIsChatboxOpen((prev) => !prev)
	}

	const handleUserInput = (event) => {
		setUserInput(event.target.value)
	}

	const handleSendMessage = () => {
		if (userInput.trim() !== "") {
			addUserMessage(userInput)
			respondToUser(userInput)
			setIsReply(true)
			setUserInput("")
		}
	}

	const handleKeyUp = (event) => {
		if (event.key === "Enter") {
			handleSendMessage()
		}
	}

	const addUserMessage = (message) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{
				question: message,
				sender: "user",
			},
		])
	}

	const addBotMessage = (answers) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{
				answers: answers,
				sender: "bot",
			},
		])
	}

	const respondToUser = async (userMessage) => {
		let errorMessage = "Oops! Nothing found. try again"
		try {
			const controller = new AbortController()

			const response = await drupal.fetch(
				`${locale}/api/search-ai?q=${encodeURIComponent(userMessage)}`,
				{
					signal: controller.signal,
				}
			)
			const data = await response.json()
			if (data && data.resources && data.count > 0) {
				addBotMessage({
					code: 200,
					data: data.resources,
				})
			} else {
				addBotMessage({
					code: 400,
					text: errorMessage,
				})
			}
		} catch (error) {
			console.error("Error fetching data:", error)
			addBotMessage({
				code: 400,
				text: errorMessage,
			})
		} finally {
			setIsReply(false)
		}
	}

	return (
		<div>
			<div className={`fixed bottom-0 right-0 mb-4 mr-4`}>
				<button
					id="open-chat"
					className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
					onClick={toggleChatbox}
				>
					{/* Add your SVG icon here */}
					Chat with Vactory Bot
				</button>
			</div>

			<div
				id="chat-container"
				className={`fixed bottom-16 right-4 z-10 w-96 ${isChatboxOpen ? "" : "hidden"}`}
			>
				<div className="w-full max-w-lg rounded-lg bg-white shadow-md">
					<div className="flex items-center justify-between rounded-t-lg border-b bg-blue-500 p-4 text-white">
						<p className="text-lg font-semibold">Vactory Bot</p>
						<button
							id="close-chat"
							className="text-gray-300 hover:text-gray-400 focus:text-gray-400 focus:outline-none"
							onClick={toggleChatbox}
						>
							{/* Add your close button SVG icon here */}X
						</button>
					</div>

					<div ref={chatboxRef} id="chatbox" className="h-80 overflow-y-auto p-4">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`mb-2 ${message.sender === "user" ? "text-right" : ""}`}
							>
								<div
									className={`inline-block rounded-lg px-4 py-2 ${
										message.sender === "user"
											? "bg-blue-500 text-white"
											: "gap-2 bg-gray-200 text-gray-700"
									}`}
								>
									{message.sender === "user"
										? message.question
										: message.answers.code == 400
											? message.answers.text
											: message.answers.data.map((item, index) => (
													<div key={index} className="flex flex-col gap-2">
														<Link variant="permalink" href={item.url}>
															{item.label}
														</Link>
														<span className="italique text-sm font-light text-slate-600">
															{item.summary}
														</span>
													</div>
												))}
								</div>
							</div>
						))}
						{isReply && (
							<div className="mb-2 text-center">
								<p className="text-gray-500">Bot is preparing a response...</p>
							</div>
						)}
					</div>

					<div className="flex border-t p-4">
						<input
							id="user-input"
							type="text"
							placeholder="Type a message"
							className="w-full rounded-l-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={userInput}
							onChange={handleUserInput}
							onKeyUp={handleKeyUp}
						/>
						<button
							id="send-button"
							className="rounded-r-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
							onClick={handleSendMessage}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Chatbox
