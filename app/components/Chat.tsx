"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
  
    const userMessage: Message = { role: "user", content: input.trim() }

    // Immediately update the messages state to show the user's message
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("") // Clear input field immediately
  
    setIsLoading(true)
  
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }), // Ensure latest messages are sent
      })
  
      const data = await response.json()
      console.log("API Response:", data)
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }
  
      // Extract and clean assistant's response
      let assistantContent = data.response.content || "No response"
      assistantContent = assistantContent.replace(/<think>.*?<\/think>/gis, "").trim()

      // Format assistant's response to be more organized
      const formattedResponse = formatAssistantResponse(assistantContent)
      const assistantMessage: Message = { role: "assistant", content: formattedResponse }

      // Add assistant's message to state
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format the assistant's response for better UI rendering
  const formatAssistantResponse = (content: string) => {
    // Example formatting: if content contains code or markdown, format it
    return content
      .replace(/```(.*?)```/gs, (match, code) => {
        // Wrap code blocks in <pre> for styling
        return `<pre class="bg-gray-800 text-white p-4 rounded">${code.trim()}</pre>`
      })
      .replace(/- (.*?)(\n|$)/g, (match, listItem) => {
        // Format list items with bullet points
        return `<li class="ml-4 list-disc">${listItem.trim()}</li>`
      })
      .replace(/\n/g, "<br>") // Replace newlines with <br> for better formatting
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-gray-800 text-white shadow-md">
        <h1 className="text-lg font-semibold">AI Chatbot</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <h1 className="text-2xl font-bold">Welcome to AI Chat</h1>
            <p>Ask anything</p>
          </div>
        )}

        {messages.map((m, index) => (
          <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-3 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {/* Displaying HTML formatted content */}
              <div dangerouslySetInnerHTML={{ __html: m.content }} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
